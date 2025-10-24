"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, CameraIcon } from "@phosphor-icons/react";

type Room = { id: string; name: string };
const ROOMS: Room[] = [
    { id: "general", name: "Général"},
    { id: "support", name: "Support"},
    { id: "random", name: "Random"},
];

const PROFILE_KEY = "userProfile";

type Profile = {
    name: string;
    avatarDataUrl?: string | null;
};

export default function Reception() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger un profil existant
    useEffect(() => {
        try {
            const raw = localStorage.getItem(PROFILE_KEY);
            if (raw) {
                const p: Profile = JSON.parse(raw);
                setName(p.name ?? "");
                setAvatar(p.avatarDataUrl ?? null);
                setSaved(true);
            }
        } catch {
            // ignore
        }
    }, []);

    const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result as string);
        reader.readAsDataURL(file);
    };

    const saveProfile = () => {
        if (!name.trim()) {
            setError("Veuillez saisir un pseudo.");
            return false;
        }
        // avatar optionnel; si requis, décommentez:
        // if (!avatar) { setError("Veuillez ajouter une photo."); return false; }

        const profile: Profile = { name: name.trim(), avatarDataUrl: avatar };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        setSaved(true);
        setError(null);
        return true;
    };

    const enterRoom = (roomId: string) => {
        const ok = saveProfile();
        if (!ok) return;
        router.push(`/room?room=${encodeURIComponent(roomId)}`);
    };

    const clearProfile = () => {
        localStorage.removeItem(PROFILE_KEY);
        setName("");
        setAvatar(null);
        setSaved(false);
        setError(null);
    };

    return (
        <main className="flex-1 min-h-0 w-full flex flex-col bg-neutral-50 text-neutral-900">
            <div className="mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profil */}
                <section className="bg-white border border-neutral-200 rounded-xl p-5">
                    <h1 className="text-xl font-semibold mb-4">Se connecter</h1>
                    <div className="flex items-start gap-4">
                        {/* Avatar cliquable avec overlay */}
                        <label
                            className="group relative w-30 h-30 rounded-full overflow-hidden border border-neutral-300 bg-neutral-100 flex items-center justify-center cursor-pointer"
                            aria-label="Changer la photo de profil"
                        >
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <img src="/user.jpg" alt="Avatar par défaut" className="w-full h-full object-cover" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                capture="user"
                                onChange={onAvatarChange}
                                className="sr-only"
                            />
                            <div className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                                <CameraIcon size={20} />
                                <span className="text-xs">Changer</span>
                            </div>
                        </label>

                        <div className="flex-1 space-y-3">
                            <div className="flex flex-col">
                                <label className="text-sm text-neutral-600 mb-1">Pseudo</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre pseudo"
                                    className="border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Bouton 'Choisir une photo' supprimé */}
                                <button
                                    onClick={saveProfile}
                                    className="px-3 py-2 rounded-lg border border-transparent text-white bg-orange-gradient hover:bg-orange-600 transition cursor-pointer"
                                    title="Enregistrer le profil"
                                >
                                    Enregistrer
                                </button>
                                {saved && (
                                    <button
                                        onClick={clearProfile}
                                        className="px-3 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition cursor-pointer"
                                    >
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                    </div>
                </section>

                {/* Rooms */}
                <section className="bg-white border border-neutral-200 rounded-xl p-5">
                    <h2 className="text-xl font-semibold mb-4">Rooms disponibles</h2>
                    <ul className="flex flex-col gap-3">
                        {ROOMS.map((room) => (
                            <li key={room.id}>
                                <button
                                    onClick={() => enterRoom(room.id)}
                                    className="w-full text-left p-4 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{room.name}</div>
                                        </div>
                                        <span className="text-orange-500 flex items-center gap-2 text-sm">Entrer <ArrowRightIcon size={20}/></span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}