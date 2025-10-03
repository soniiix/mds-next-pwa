"use client";

import { GithubLogoIcon } from "@phosphor-icons/react";

export default function Home() {
    return (
        <main className="flex-1 min-h-0 w-full flex flex-col items-center justify-center bg-neutral-50 text-neutral-900">
            <div className="m-auto flex items-center flex-col gap-4">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-bold">Application PWA avec Next.js</h1>
                    <a 
                        className="text-orange-500 border border-orange-500 rounded-full p-1 transition-colors cursor-pointer"
                        href="https://github.com/soniiix/mds-next-pwa"
                        target="_blank" rel="noopener noreferrer"
                    >
                        <GithubLogoIcon size={22}/>
                    </a>
                </div>
                <p className="text-center">
                    Les technologies utilisées dans cette application sont :&nbsp;
                    <a href="https://fr.react.dev/" className="text-orange-500 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                        React
                    </a>,&nbsp;
                    <a href="https://nextjs.org/" className="text-orange-500 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                        Next.js
                    </a>,&nbsp;
                    <a href="https://tailwindcss.com/" className="text-orange-500 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                        Tailwind CSS
                    </a>,
                    et <a href="https://phosphoricons.com/" className="text-orange-500 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                        Phosphor Icons
                    </a>.
                </p>
            </div>
        </main>
    )
}