"use client";

import { TrashIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function Gallery() {
    const [photos, setPhotos] = useState<{ id: number; dataUrl: string; createdAt: number }[]>([]);

    // Load photos from localStorage on component mount
    useEffect(() => {
        try {
            const storedPhotos = JSON.parse(localStorage.getItem("galleryPhotos") || "[]");
            setPhotos(storedPhotos);
        } catch (e) {
            console.error("Failed to load photos from localStorage:", e);
        }
    }, []);

    const clearGallery = () => {
        localStorage.removeItem("galleryPhotos");
        setPhotos([]);
    };

    return (
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">{photos.length} photos</h2>
                    <button 
                        onClick={() => clearGallery()} 
                        className="px-4 py-2 flex items-center cursor-pointer bg-orange-100/90 text-orange-500 rounded-lg font-medium hover:bg-orange-100 transition"
                    >
                        Vider la galerie
                        <TrashIcon size={18} className="ml-2" />
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {photos.map((photo) => (
                        <div key={photo.id} className="relative">
                            <img src={photo.dataUrl} className="w-full h-auto rounded-lg shadow" />
                        </div>
                    ))}
                </div>
            </div>
    );
}