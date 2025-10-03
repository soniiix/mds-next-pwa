import Link from "next/link";
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.className}>
            <body className="min-h-screen flex flex-col bg-neutral-50">
                <nav className="flex items-center justify-between bg-white border-b border-neutral-200 w-full px-6 py-4">
                    <Link href="/"><img src="icon.svg" alt="Logo" className="h-10 w-10 rounded-lg"/></Link>
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-orange-500 font-medium px-4 py-2 hover:bg-orange-100/60 rounded-lg transition">Home</Link>
                        <Link href="/room" className="text-orange-500 font-medium px-4 py-2 hover:bg-orange-100/60 rounded-lg transition">Réception</Link>
                        <Link href="/room" className="text-orange-500 font-medium px-4 py-2 hover:bg-orange-100/60 rounded-lg transition">Room</Link>
                        <Link href="/room" className="text-orange-500 font-medium px-4 py-2 hover:bg-orange-100/60 rounded-lg transition">Gallery</Link>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    )
}