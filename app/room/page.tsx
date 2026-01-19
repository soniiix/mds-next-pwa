import { Suspense } from "react";
import Room from "./Room";

export default function RoomPage() {
    return <Suspense fallback={<div>Chargement...</div>}>
        <Room />
    </Suspense>;
}