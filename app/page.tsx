'use client';
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

export default function Home() {
    // Register the service worker
    useEffect(() => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => console.log("SW enregistré", reg))
            .catch((err) => console.error("Erreur SW:", err));
    }, []);

    return (
        <main>
            <aside className="sticky h-screen bg-zinc-200 w-80 p-4">
                <h2 className="text-lg font-bold">Conversations</h2>
                {/* Search input */}
                <div className="flex flex-row mt-4 items-center w-full pl-3 py-2 rounded bg-white border border-zinc-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-400">
                    <span className="text-zinc-500">
                        <MagnifyingGlassIcon size={20} />
                    </span>
                    <input
                        type="text"
                        className="flex-1 focus:outline-none ml-3"
                        placeholder="Search"
                    />
                </div>

                {/* Conversation list */}
                <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between p-2 rounded border border-zinc-400 hover:bg-zinc-300 cursor-pointer transition-colors duration-100">
                        <span className="font-medium">John Doe</span>
                        <span className="text-sm text-zinc-500">2h ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border border-zinc-400 hover:bg-zinc-300 cursor-pointer transition-colors duration-100">
                        <span className="font-medium">Paul Dupont</span>
                        <span className="text-sm text-zinc-500">5d ago</span>
                    </div>
                </div>
            </aside>
        </main>
    );
}
