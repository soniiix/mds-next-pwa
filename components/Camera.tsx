"use client";

import { ArrowsClockwiseIcon, CameraIcon, RepeatIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    const startCamera = async () => {
        setError(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError(true);
        }
    };

    // Launch camera on component mount
    useEffect(() => {
        startCamera();

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
            setPhoto(canvas.toDataURL("image/png"));
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
                                className="bg-orange-500 text-white p-3 rounded-full cursor-pointer"
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

                    <div className="flex items-center justify-center mt-5 h-12">
                        <button
                            onClick={() => setPhoto(null)}
                            className="bg-gray-500 flex items-center gap-2 text-white px-4 py-2 cursor-pointer transition rounded-lg hover:bg-gray-600"
                        >
                            Reprendre
                            <ArrowsClockwiseIcon size={17}/>
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
