"use client";
import { CameraIcon, MagnifyingGlassIcon, PaperPlaneRightIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

export default function Home() {
    // Register the service worker
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("SW enregistré", reg))
                .catch((err) => console.error("Erreur SW:", err));
        }
    }, []);

    return (
        <main className="flex h-screen bg-neutral-50 text-neutral-900">
            {/* SIDEBAR */}
            <aside className="flex flex-col h-full bg-white border-r border-neutral-200 w-80 p-4">
                <h2 className="text-lg font-bold mb-4">Conversations</h2>

                {/* Search input */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 border border-neutral-300 focus-within:ring-2 focus-within:ring-blue-400">
                    <MagnifyingGlassIcon size={20} className="text-neutral-500" />
                    <input
                        type="text"
                        className="flex-1 bg-transparent focus:outline-none"
                        placeholder="Rechercher..."
                    />
                </div>

                {/* Conversation list */}
                <div className="mt-6 flex-1 flex flex-col gap-2 overflow-y-auto">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-neutral-200/50 text-blue-500 hover:bg-neutral-200/50 cursor-pointer transition">
                        <span className="font-medium">John Doe</span>
                        <span className="text-xs">2h ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-neutral-200/50 cursor-pointer transition">
                        <span className="font-medium">Paul Dupont</span>
                        <span className="text-xs text-neutral-500">5d ago</span>
                    </div>
                </div>
            </aside>

            {/* CHAT AREA */}
            <section className="flex flex-col flex-1 h-full">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shadow-sm">
                    <h2 className="font-semibold text-lg">Chat avec John Doe</h2>
                </header>

                {/* Messages */}
                <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto bg-neutral-50">
                    <div className="flex justify-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs shadow">
                            Salut ! Comment ça va ?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-neutral-200 text-neutral-900 px-4 py-2 rounded-lg max-w-xs shadow">
                            Ça va bien, merci ! Et toi ?
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs shadow">
                            Oui nickel !
                        </div>
                    </div>
                </div>

                {/* Input */}
                <form className="px-6 py-4 border-t border-neutral-200 bg-white flex items-center gap-3">
                    <a
                        href="#"
                        className="flex items-center gap-2 border-neutral-300 border px-4 py-2 rounded-lg hover:bg-neutral-100 h-full transition"
                    >
                       <CameraIcon size={19} />
                    </a>
                    <input
                        type="text"
                        className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Écrivez un message..."
                    />
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                    >
                        Envoyer <PaperPlaneRightIcon size={18} />
                    </button>
                </form>
            </section>
        </main>
    );
}
