"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { IRootState } from "../app/store";

interface ISocketContext {
    socket: Socket | null;
}

const SocketContext = createContext<ISocketContext>({
    socket: null,
});

export function useSocket() {
    return useContext(SocketContext);
}

interface Props {
    children: React.ReactNode;
}

export default function SocketProvider({ children }: Props) {
    const admin = useSelector((state: IRootState) => state.admin.adminData);

    const socket = useMemo(() => {
        return io("http://localhost:5000", {
            autoConnect: false,
            withCredentials: true,
            transports: ["websocket"],
        });
    }, []);

    useEffect(() => {
        if (!admin?._id) return; // wait for admin data

        socket.connect();

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);

            // 🔥 JOIN ROOM USING ADMIN ID
            socket.emit("join_room", admin._id);
            console.log("Joined room:", admin._id);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, [socket, admin?._id]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
