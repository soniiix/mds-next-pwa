"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, CameraIcon, ChatCircleSlashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

type Room = { name: string; clients?: Record<string, unknown> };

const PROFILE_KEY = "userProfile";
const DEFAULT_AVATAR = "/user.jpg";

type Profile = {
    name: string;
    avatarDataUrl?: string | null;
};

export default function Reception() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<string | null>(DEFAULT_AVATAR);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Load rooms + profil
    useEffect(() => {
        fetch("https://api.tools.gavago.fr/socketio/api/rooms")
            .then((res) => res.json())
            .then((data) => {
                const roomsArray: Room[] = Object.entries<any>(data.data).map(
                    ([roomName, roomData]) => ({
                        name: roomName,
                        clients: roomData?.clients || {},
                    })
                );
                roomsArray.sort((a, b) =>
                    a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
                );
                setRooms(roomsArray);
            })
            .catch(() => {});

        const storedProfile = localStorage.getItem(PROFILE_KEY);
        if (storedProfile) {
            const profile: Profile = JSON.parse(storedProfile);
            setName(profile.name);
            setAvatar(profile.avatarDataUrl ?? DEFAULT_AVATAR);
            setSaved(true);
        }
    }, []);

    // Handle avatar file selection
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
        const profile: Profile = { name: name.trim(), avatarDataUrl: avatar };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        setSaved(true);
        setError(null);
        return true;
    };

    const enterRoom = (roomId: string) => {
        const ok = saveProfile();
        if (!ok) return;
        const pseudo = name.trim();
        const params = new URLSearchParams({ room: roomId, pseudo: pseudo });
        router.push(`/room?${params.toString()}`);
    };

    const clearProfile = () => {
        localStorage.removeItem(PROFILE_KEY);
        setName("");
        setAvatar(DEFAULT_AVATAR);
        setSaved(false);
        setError(null);
    };

    // Filter rooms based on search
    const filteredRooms = rooms.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sort rooms by client count descending
    filteredRooms.sort((a, b) => {
        const aCount = a.clients ? Object.keys(a.clients).length : 0;
        const bCount = b.clients ? Object.keys(b.clients).length : 0;
        return bCount - aCount;
    });

    return (
        <main className="flex-1 min-h-0 w-full flex flex-col bg-neutral-50 text-neutral-900">
            <div className="mx-auto w-full p-6 flex flex-col lg:flex-row gap-6">
                {/* Profil */}
                <section className="bg-white border h-fit border-neutral-200 rounded-xl p-5">
                    <h1 className="text-xl font-semibold mb-4">Se connecter</h1>
                    <div className="flex items-start gap-4 mb-4">
                        {/* Avatar cliquable avec overlay */}
                        <label
                            className="group relative w-30 h-30 rounded-full overflow-hidden border border-neutral-300 bg-neutral-100 flex items-center justify-center cursor-pointer"
                            aria-label="Changer la photo de profil"
                        >
                            <img src={avatar ?? DEFAULT_AVATAR} alt="Avatar" className="w-full h-full object-cover" />
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
                                    className="border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400 focus:ring focus:ring-orange-400 bg-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
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
                <section className="bg-white border border-neutral-200 rounded-xl p-5 flex-1 min-w-0 overflow-auto max-h-[80vh]">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1 min-w-0">
                            <MagnifyingGlassIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                placeholder="Rechercher une room…"
                                className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-orange-400 focus:ring focus:ring-orange-400"
                            />
                        </div>
                    </div>

                    {filteredRooms.length === 0 && (
                        <div className="w-full h-32 flex flex-col gap-3 items-center justify-center text-sm text-center text-neutral-500">
                            <ChatCircleSlashIcon size={32} />
                            <p>Aucune room trouvée.</p>
                        </div>
                    )}

                    {/* Room List */}
                    {filteredRooms.length > 0 && (
                        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
                            <ul className="divide-y divide-neutral-200">
                                {filteredRooms.map((room) => {
                                    const clientCount = room.clients ? Object.keys(room.clients).length : 0;
                                    return (
                                        <li
                                            key={room.name}
                                            className="hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg overflow-hidden"
                                            title={room.name}
                                        >
                                            <button
                                                onClick={() => enterRoom(room.name)}
                                                className="w-full text-left p-3 transition cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate">{room.name}</div>
                                                        <div className="text-xs text-neutral-500">
                                                            {clientCount} connecté{clientCount > 1 ? "s" : ""}
                                                        </div>
                                                    </div>
                                                    <span className="text-orange-500 flex items-center gap-2 text-sm shrink-0">
                                                        Entrer <ArrowRightIcon size={20} />
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}