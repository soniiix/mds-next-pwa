"use client";

import { ArrowsClockwiseIcon, CameraIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const GALLERY_KEY = "galleryPhotos";
const addPhotoToGallery = (dataUrl: string) => {
    try {
        const prev = JSON.parse(localStorage.getItem(GALLERY_KEY) ?? "[]");
        const next = [...prev, { id: Date.now(), dataUrl, createdAt: Date.now() }];
        localStorage.setItem(GALLERY_KEY, JSON.stringify(next));
    } catch (e) {
        console.error("Failed to save photo in localStorage:", e);
    }
};

const showNotification = async () => {
    // Trigger vibration if supported
    if ('vibrate' in navigator) {
        navigator.vibrate(200); // 200ms vibration
    }

    if (!("Notification" in window)) {
        console.log("Ce navigateur ne supporte pas les notifications");
        return;
    }

    // Request permission if not already granted
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

    // Display notification if granted
    if (Notification.permission === "granted") {
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification("Photo capturée", {
                    body: "Photo prise et enregistrée dans la galerie",
                    icon: "/icon.svg",
                    badge: "/icon.svg",
                });
            });
        } else {
            // Fallback without Service Worker
            new Notification("Photo capturée", {
                body: "Photo prise et enregistrée dans la galerie",
                icon: "/icon.svg",
            });
        }
    }
};

export const Camera = ({ onSendAction }: { onSendAction: (dataUrl: string) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        setError(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError(true);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Launch camera on component mount
    useEffect(() => {
        startCamera();

        // Request notification permission on mount
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    // Restart camera if photo is reset
    useEffect(() => {
        if (photo === null) {
            startCamera();
        }
    }, [photo]);

    // Take picture logic
    const takePicture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            setPhoto(dataUrl);
            stopCamera();
            addPhotoToGallery(dataUrl);
            showNotification();
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Show the camera */}
            <div className="flex flex-col items-center">
                {(!photo && !error) && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-lg w-full border-3 border-orange-500"
                    ></video>
                )}

                <canvas ref={canvasRef} className="hidden"></canvas>

                {(!photo && !error) && (
                    <div className="flex mt-5">
                        {!photo && (
                            <button
                                onClick={takePicture}
                                className="bg-orange-500 text-white p-3 rounded-full cursor-pointer hover:bg-orange-600 transition"
                            >
                                <CameraIcon size={24} />
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            {/* Show the taken photo */}
            {photo && photo !== "data:," && (
                <div className="flex flex-col items-center">
                    <img
                        src={photo}
                        alt="Capture"
                        className="rounded-lg border-3 border-gray-500 w-full"
                    />

                    <div className="flex items-center justify-center gap-3 mt-5">
                        <button
                            onClick={() => setPhoto(null)}
                            className="bg-gray-500 flex items-center gap-2 text-white px-4 py-2 cursor-pointer transition rounded-lg hover:bg-gray-600"
                        >
                            Reprendre
                            <ArrowsClockwiseIcon size={17}/>
                        </button>
                        <button
                            onClick={() => onSendAction(photo)}
                            className="bg-orange-500 flex items-center gap-2 text-white px-4 py-2 cursor-pointer transition rounded-lg hover:bg-orange-600"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            )}

            {/* Error message if photo couldn't be taken */}
            {(photo === "data:," || error) && (
                <div className="text-red-500 w-full">Une erreur est survenue. Veuillez réessayer.</div>
            )}
        </div>
    );
};
