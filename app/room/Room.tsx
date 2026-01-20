"use client";

import { Camera } from "@/components/Camera";
import { CameraIcon, PaperPlaneRightIcon, UsersThreeIcon, XIcon, MapPinIcon, BatteryHighIcon } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { useSearchParams, useRouter } from "next/navigation";

export default function Room() {
    const router = useRouter();

    // Register the service worker
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("SW enregistré", reg))
                .catch((err) => console.error("Erreur SW:", err));
        }
    }, []);

    const searchParams = useSearchParams();
    const roomName = searchParams.get("room");
    const pseudo = searchParams.get("pseudo");

    const hasValidParams = roomName && pseudo;

    // Redirect if parameters are missing
    useEffect(() => {
        if (!hasValidParams) {
            router.replace("/reception");
        }
    }, [hasValidParams, router]);

    const [isCameraClicked, setIsCameraClicked] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<Record<string, any>>({});
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const fetchImageFromServer = async (imageId: string) => {
        try {
            const response = await fetch(`https://api.tools.gavago.fr/socketio/api/images/${imageId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération de l\'image.');
            }

            const data = await response.json();

            if (!data.success) {
                console.error('Erreur serveur:', data.message);
                return null;
            }

            return data.data_image;
        } catch (error) {
            console.error('Erreur fetch image:', error);
            return null;
        }
    };

    // Extract pseudo from image message content like:
    // "SERVER: Nouvelle image pour le user {pseudo}."
    const extractPseudoFromImageContent = (content?: string | null) => {
        if (!content) return null;
        const match = content.match(/Nouvelle image pour le user\s+([^.]+)/i);
        return match?.[1]?.trim() ?? null;
    };

    // Socket connections and events handling
    useEffect(() => {
        if (!socket.connected) socket.connect();

        // Join the room
        socket.emit("chat-join-room", {
            pseudo,
            roomName,
        });

        // When successfully joined the room
        socket.on("chat-joined-room", (data) => {
            setUsers(data.clients || {});
        });

        socket.on("chat-msg", async (msg) => {
            if (msg.categorie === "NEW_IMAGE" && msg.id_image) {
                const imageData = await fetchImageFromServer(msg.id_image);
                if (imageData) {
                    const pseudoFromContent = extractPseudoFromImageContent(msg.content);
                    setMessages((prev) => [
                        ...prev,
                        {
                            ...msg,
                            pseudo: pseudoFromContent ?? msg.pseudo,
                            image_data: imageData,
                        },
                    ]);
                }
            } else if (msg.content && !msg.content.startsWith("[IMAGE]")) {
                // Normal text message (ignore placeholder messages)
                setMessages((prev) => [...prev, msg]);
            }
        });

        // Cleanup when leaving the page
        return () => {
            socket.off("chat-joined-room");
            socket.off("chat-msg");
            socket.off("chat-disconnected");
        };
    }, [roomName, pseudo]);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        socket.emit("chat-msg", {
            content: inputValue,
            roomName,
        });
        setInputValue("");
    };

    const compressImage = (dataUrl: string, quality: number = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width * 0.7;
                canvas.height = img.height * 0.7;
                
                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedUrl);
                }
            };
        });
    };

    const sendImageMessage = async (dataUrl: string) => {
        try {
            const compressedDataUrl = await compressImage(dataUrl);
            
            const response = await fetch(`https://api.tools.gavago.fr/socketio/api/images/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: socket.id, image_data: compressedDataUrl })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Erreur lors de l'envoi de l'image.`);
            }

            const data = await response.json();
            
            socket.emit("chat-msg", {
                categorie: "NEW_IMAGE",
                id_image: socket.id,
                roomName,
            });
        } catch (error) {
            console.error('Erreur:', error);
            alert(`Erreur: ${error instanceof Error ? error.message : 'Impossible d\'envoyer l\'image'}`);
        } finally {
            setIsCameraClicked(false);
        }
    };

    const sendLocation = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                socket.emit("chat-msg", {
                    content: `📍 Localisation: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                    latitude,
                    longitude,
                    roomName,
                });
            },
            (error) => {
                console.error("Erreur géolocalisation:", error);
                alert("Impossible d'accéder à votre localisation.");
            }
        );
    };

    const sendBattery = () => {
        alert("TODO");
    };

    return (
        <main className="flex flex-1 min-h-0 overflow-hidden bg-neutral-50 text-neutral-900">
            {/* Camera feature modal */}
            {isCameraClicked && (
                <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button
                            onClick={() => setIsCameraClicked(false)}
                            className="absolute top-5 right-5 text-neutral-500 hover:text-neutral-700 text-xl font-bold cursor-pointer hover:bg-neutral-200 rounded-full p-2 transition"
                            aria-label="Fermer"
                        >
                            <XIcon size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-5">Prendre une photo</h2>
                        <div>
                            <Camera onSendAction={sendImageMessage} />
                        </div>
                    </div>
                </div>
            )}

            {/* SIDEBAR */}
            <aside className="flex flex-col min-h-0 bg-white border-r border-neutral-200 w-80 px-6 py-4 space-y-4">
                <div>
                    <span>Utilisateurs connectés : <strong>{Object.keys(users).length}</strong></span>
                </div>
                <div>
                    Connecté en tant que <strong>{pseudo}</strong>
                </div>
            </aside>

            {/* CHAT AREA */}
            <section className="flex flex-col flex-1 min-h-0">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-3 border-b border-neutral-200 bg-white shadow-sm">
                    <div className="font-semibold text-lg flex items-center">
                        <div className="bg-gray-200 text-gray-600 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                            <UsersThreeIcon size={30} className="" />
                        </div>
                        <h3>Room : {roomName}</h3>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh] bg-neutral-50">
                    {messages.map((msg, index) => {
                        const isMe = msg.pseudo === pseudo;
                        const formattedDate = msg?.dateEmis ? new Date(msg.dateEmis).toLocaleString() : "";
                        return (
                            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div className="flex flex-col">
                                    <div className={`${isMe ? "bg-orange-gradient text-white" : "bg-neutral-200 text-neutral-900"} px-4 py-2 rounded-lg min-w-46 max-w-lg shadow break-words`}>
                                        <strong className="block text-xs opacity-70 mb-1">{msg.pseudo?.toUpperCase()}</strong>
                                        {msg.image_data ? (
                                            <img
                                                src={msg.image_data}
                                                className="rounded-lg max-w-full h-auto max-h-64 object-contain"
                                            />
                                        ) : (
                                            <div>{msg.content}</div>
                                        )}
                                    </div>
                                    {formattedDate && (
                                        <time dateTime={msg.dateEmis} className="text-[11px] opacity-60 mt-2">
                                            {formattedDate}
                                        </time>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="px-6 py-4 border-t border-neutral-200 bg-white flex items-center gap-3">
                    <div
                        className="flex items-center gap-2 border-neutral-200 border px-4 py-2 rounded-lg cursor-pointer hover:bg-neutral-100 h-full transition"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsCameraClicked((e) => !e);
                        }}
                        title="Prendre une photo"
                    >
                        <CameraIcon size={19} />
                    </div>
                    <button
                        type="button"
                        onClick={sendLocation}
                        className="flex items-center gap-2 border-neutral-200 border px-4 py-2 rounded-lg cursor-pointer hover:bg-neutral-100 h-full transition"
                        title="Envoyer ma localisation"
                    >
                        <MapPinIcon size={19} />
                    </button>
                    <button
                        type="button"
                        onClick={sendBattery}
                        className="flex items-center gap-2 border-neutral-200 border px-4 py-2 rounded-lg cursor-pointer hover:bg-neutral-100 h-full transition"
                        title="Envoyer le niveau de batterie"
                    >
                        <BatteryHighIcon size={19} />
                    </button>
                    <input
                        type="text"
                        className="flex-1 border border-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                        placeholder="Écrivez un message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="flex h-full items-center gap-2 bg-orange-gradient text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer"
                    >
                        Envoyer <PaperPlaneRightIcon size={18} />
                    </button>
                </form>
            </section>
        </main>
    );
}
