"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
});

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/reception", label: "Reception" },
        { href: "/room", label: "Room" },
        { href: "/gallery", label: "Gallery" },
    ];

    return (
        <html lang="en" className={inter.className}>
            <body className="min-h-screen flex flex-col bg-neutral-50 selection:bg-orange-500 selection:text-white">
                <nav className="flex items-center justify-between bg-white border-b border-neutral-200 w-full px-6 py-4">
                    <Link href="/"><img src="icon.svg" alt="Logo" className="h-10 w-10 rounded-lg"/></Link>
                    <div className="flex items-center gap-2">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition text-orange-500 ${isActive
                                            ? "bg-orange-100/90"
                                            : "hover:bg-orange-100/60"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
                {children}
            </body>
        </html>
    );
}