"use client";

import React, { useState } from "react";
import {
    Search,
    Lock,
    Unlock,
    CheckCircle2,
    AlertTriangle,
    Play,
    Square,
    Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

type StationStatus = "Active" | "Inactive" | "Defective";

interface Station {
    id: string;
    name: string;
    status: StationStatus;
    warning?: string;
}

interface Room {
    id: string;
    name: string;
    isLocked: boolean;
    stations: Station[];
    allowManualOverride: boolean;
}

const initialRooms: Room[] = [
    {
        id: "room-1",
        name: "Room 1",
        isLocked: false,
        allowManualOverride: true,
        stations: [
            { id: "1-a", name: "Station A", status: "Active" },
            { id: "1-b", name: "Station B", status: "Active" },
            { id: "1-c", name: "Station C", status: "Active" },
        ]
    },
    {
        id: "room-2",
        name: "Room 2",
        isLocked: false,
        allowManualOverride: true,
        stations: [
            { id: "2-a", name: "Station A", status: "Active" },
            { id: "2-b", name: "Station B", status: "Defective", warning: "Sensor malfunction" },
            { id: "2-c", name: "Station C", status: "Active" },
        ]
    }
];

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleStationStatus = (roomId: string, stationId: string, newStatus: StationStatus) => {
        setRooms(prevRooms => prevRooms.map(room => {
            if (room.id !== roomId) return room;
            return {
                ...room,
                stations: room.stations.map(station =>
                    station.id === stationId ? { ...station, status: newStatus } : station
                )
            };
        }));
    };

    const toggleRoomLock = (roomId: string) => {
        setRooms(prevRooms => prevRooms.map(room =>
            room.id === roomId ? { ...room, isLocked: !room.isLocked } : room
        ));
    };

    const toggleOverride = (roomId: string) => {
        setRooms(prevRooms => prevRooms.map(room =>
            room.id === roomId ? { ...room, allowManualOverride: !room.allowManualOverride } : room
        ));
    };

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-secondary">Room Management</h1>
                <p className="text-brand-success mt-1 font-bold text-sm sm:text-base uppercase tracking-wider">Manage rooms, stations, and hardware status</p>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search by the Room name or game"
                    className="w-full bg-bg-card border border-zinc-800 rounded-xl py-3 md:py-3.5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm sm:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-bg-card border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col h-full ring-1 ring-brand-secondary/5 hover:ring-brand-secondary/20 transition-all">
                        {/* Room Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="p-2.5 md:p-3 bg-pink-500 rounded-xl shadow-lg shadow-pink-500/20">
                                    <Unlock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{room.name}</h2>
                                    <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-brand-success">
                                        {room.isLocked ? "Locked" : "Unlocked"}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleRoomLock(room.id)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-brand-success/30 rounded-xl text-brand-success text-[10px] sm:text-xs font-bold hover:bg-brand-success/10 transition-colors uppercase tracking-wider"
                            >
                                <Lock className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                {room.isLocked ? "Unlock Room" : "Lock Room"}
                            </button>
                        </div>

                        {/* Stations Section */}
                        <div className="flex-1 space-y-6">
                            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.15em] mb-4">Stations</h3>
                            <div className="space-y-4">
                                {room.stations.map((station) => (
                                    <div key={station.id} className={cn(
                                        "bg-[#1e293b]/40 border rounded-2xl p-4 transition-all duration-300",
                                        station.status === "Defective" ? "border-red-900/50" : "border-zinc-800"
                                    )}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    station.status === "Defective" ? "bg-brand-error/20" : "bg-brand-success/20"
                                                )}>
                                                    {station.status === "Defective" ? (
                                                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-brand-error" />
                                                    ) : (
                                                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-brand-success" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm sm:text-base">{station.name}</h4>
                                                    <span className={cn(
                                                        "text-[10px] sm:text-xs uppercase font-bold px-2 py-0.5 rounded tracking-wider",
                                                        station.status === "Active" ? "bg-brand-success/40 text-brand-success" :
                                                            station.status === "Defective" ? "bg-brand-error/40 text-brand-error" :
                                                                "bg-zinc-800 text-zinc-500"
                                                    )}>
                                                        {station.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {station.warning && (
                                            <div className="bg-brand-error/20 border border-brand-error/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-brand-error flex-shrink-0" />
                                                <span className="text-brand-error text-[10px] sm:text-xs font-bold uppercase tracking-wider">{station.warning}</span>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            <button
                                                onClick={() => toggleStationStatus(room.id, station.id, "Active")}
                                                className={cn(
                                                    "flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all",
                                                    station.status === "Active" ? "bg-brand-success/20 text-brand-success border border-brand-success/50 cursor-default" : "text-zinc-500 border border-zinc-800 hover:bg-zinc-800"
                                                )}
                                            >
                                                <Play className={cn("w-3.5 h-3.5", station.status === "Active" && "fill-brand-success")} />
                                                Activate
                                            </button>
                                            <button
                                                onClick={() => toggleStationStatus(room.id, station.id, "Inactive")}
                                                className={cn(
                                                    "flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all",
                                                    station.status === "Inactive" ? "bg-zinc-800 text-white border border-zinc-700" : "text-zinc-500 border border-zinc-800 hover:bg-zinc-800"
                                                )}
                                            >
                                                <Square className={cn("w-3.5 h-3.5", station.status === "Inactive" && "fill-white")} />
                                                Deactivate
                                            </button>
                                            <button
                                                onClick={() => toggleStationStatus(room.id, station.id, "Defective")}
                                                className={cn(
                                                    "sm:col-span-2 md:col-span-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all text-nowrap",
                                                    station.status === "Defective" ? "bg-brand-error/20 text-brand-error border border-brand-error/50" : "text-zinc-500 border border-zinc-800 hover:bg-brand-error/10 hover:text-brand-error hover:border-brand-error/30"
                                                )}
                                            >
                                                <Wrench className="w-3.5 h-3.5" />
                                                Mark Defect
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Manual Override Toggle */}
                        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
                            <span className="text-zinc-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Allow Manual Override</span>
                            <button
                                onClick={() => toggleOverride(room.id)}
                                className={cn(
                                    "relative inline-flex h-5 w-10 md:h-6 md:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                    room.allowManualOverride ? "bg-brand-secondary" : "bg-zinc-700"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-4 w-4 md:h-5 md:w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out",
                                    room.allowManualOverride ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* See All Rooms Button */}
            <button className="w-full bg-white text-black py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-zinc-200 transition-colors shadow-xl">
                See All Rooms
            </button>
        </div>
    );
}
