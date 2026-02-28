"use client";

import React, { useState } from "react";
import {
    MapPin,
    Users,
    CheckCircle2,
    Pause,
    Play,
    Search,
    ArrowLeft,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Station {
    id: string;
    team?: string;
    active: boolean;
}

interface Room {
    id: string;
    name: string;
    status: "Occupied" | "Available";
    timeLeft: string;
    group: string;
    details: string;
    stations: Station[];
}

const allRooms: Room[] = [
    {
        id: "1",
        name: "Room 1",
        status: "Occupied",
        timeLeft: "07:50",
        group: "Team Phoenix",
        details: "6 players • 5 games played today",
        stations: [
            { id: "A", team: "Team 01", active: true },
            { id: "B", team: "Team 02", active: true },
            { id: "C", team: "Team 03", active: true },
        ],
    },
    {
        id: "2",
        name: "Room 2",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "5 games played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "3",
        name: "Room 3",
        status: "Occupied",
        timeLeft: "12:30",
        group: "Dragon Squad",
        details: "4 players • 3 games played today",
        stations: [
            { id: "A", team: "Dragon A", active: true },
            { id: "B", team: "Dragon B", active: true },
            { id: "C", team: "Dragon C", active: true },
        ],
    },
    {
        id: "4",
        name: "Room 4",
        status: "Occupied",
        timeLeft: "05:15",
        group: "Ninja Warriors",
        details: "5 players • 4 games played today",
        stations: [
            { id: "A", team: "Ninja A", active: true },
            { id: "B", team: "Ninja B", active: true },
            { id: "C", team: "Ninja C", active: true },
        ],
    },
    {
        id: "5",
        name: "Room 5",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "2 games played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "6",
        name: "Room 6",
        status: "Occupied",
        timeLeft: "09:45",
        group: "Elite Squad",
        details: "6 players • 6 games played today",
        stations: [
            { id: "A", team: "Elite A", active: true },
            { id: "B", team: "Elite B", active: true },
            { id: "C", team: "Elite C", active: true },
        ],
    },
    {
        id: "7",
        name: "Room 7",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "1 game played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "8",
        name: "Room 8",
        status: "Occupied",
        timeLeft: "14:20",
        group: "Shadow Legends",
        details: "3 players • 2 games played today",
        stations: [
            { id: "A", team: "Shadow A", active: true },
            { id: "B", team: "Shadow B", active: true },
            { id: "C", team: "Shadow C", active: true },
        ],
    },
    {
        id: "9",
        name: "Room 9",
        status: "Occupied",
        timeLeft: "03:30",
        group: "Thunder Titans",
        details: "5 players • 7 games played today",
        stations: [
            { id: "A", team: "Thunder A", active: true },
            { id: "B", team: "Thunder B", active: true },
            { id: "C", team: "Thunder C", active: true },
        ],
    },
    {
        id: "10",
        name: "Room 10",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "4 games played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "11",
        name: "Room 11",
        status: "Occupied",
        timeLeft: "11:00",
        group: "Cosmic Force",
        details: "4 players • 3 games played today",
        stations: [
            { id: "A", team: "Cosmic A", active: true },
            { id: "B", team: "Cosmic B", active: true },
            { id: "C", team: "Cosmic C", active: true },
        ],
    },
    {
        id: "12",
        name: "Room 12",
        status: "Occupied",
        timeLeft: "08:05",
        group: "Cyber Warriors",
        details: "6 players • 5 games played today",
        stations: [
            { id: "A", team: "Cyber A", active: true },
            { id: "B", team: "Cyber B", active: true },
            { id: "C", team: "Cyber C", active: true },
        ],
    },
    {
        id: "13",
        name: "Room 13",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "3 games played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "14",
        name: "Room 14",
        status: "Occupied",
        timeLeft: "06:40",
        group: "Iron Wolves",
        details: "5 players • 4 games played today",
        stations: [
            { id: "A", team: "Wolf A", active: true },
            { id: "B", team: "Wolf B", active: true },
            { id: "C", team: "Wolf C", active: true },
        ],
    },
    {
        id: "15",
        name: "Room 15",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "0 games played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "16",
        name: "Room 16",
        status: "Occupied",
        timeLeft: "15:55",
        group: "Apex Predators",
        details: "6 players • 6 games played today",
        stations: [
            { id: "A", team: "Apex A", active: true },
            { id: "B", team: "Apex B", active: true },
            { id: "C", team: "Apex C", active: true },
        ],
    },
    {
        id: "17",
        name: "Room 17",
        status: "Occupied",
        timeLeft: "02:10",
        group: "Storm Breakers",
        details: "4 players • 2 games played today",
        stations: [
            { id: "A", team: "Storm A", active: true },
            { id: "B", team: "Storm B", active: true },
            { id: "C", team: "Storm C", active: true },
        ],
    },
    {
        id: "18",
        name: "Room 18",
        status: "Available",
        timeLeft: "00:00",
        group: "None",
        details: "1 game played today",
        stations: [
            { id: "A", active: true },
            { id: "B", active: true },
            { id: "C", active: true },
        ],
    },
    {
        id: "19",
        name: "Room 19",
        status: "Occupied",
        timeLeft: "10:25",
        group: "Galaxy Knights",
        details: "5 players • 3 games played today",
        stations: [
            { id: "A", team: "Galaxy A", active: true },
            { id: "B", team: "Galaxy B", active: true },
            { id: "C", team: "Galaxy C", active: true },
        ],
    },
];

export default function AllRoomsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | "Occupied" | "Available">("All");
    const [pausedRooms, setPausedRooms] = useState<Set<string>>(new Set());

    const togglePause = (roomId: string) => {
        setPausedRooms(prev => {
            const next = new Set(prev);
            if (next.has(roomId)) next.delete(roomId);
            else next.add(roomId);
            return next;
        });
    };

    const filtered = allRooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase()) ||
            room.group.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "All" || room.status === filter;
        return matchesSearch && matchesFilter;
    });

    const occupiedCount = allRooms.filter(r => r.status === "Occupied").length;
    const availableCount = allRooms.filter(r => r.status === "Available").length;

    return (
        <div className="space-y-6 max-w-8xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/live-monitoring"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">All Rooms</h1>
                        <p className="text-brand-success mt-0.5 text-sm tracking-wider">
                            Overview of all {allRooms.length} rooms
                        </p>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="px-3 py-1.5 bg-brand-success/10 text-brand-success rounded-lg">
                        {occupiedCount} Occupied
                    </span>
                    <span className="px-3 py-1.5 bg-brand-info/10 text-brand-info rounded-lg">
                        {availableCount} Available
                    </span>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by room name or group..."
                        className="w-full bg-bg-card border-border py-2.5 pl-11 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm rounded-lg italic"
                    />
                </div>
                <div className="flex gap-2">
                    {(["All", "Occupied", "Available"] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                                filter === f
                                    ? "bg-brand-secondary text-black"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Showing {filtered.length} of {allRooms.length} rooms
            </p>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((room) => {
                    const isPaused = pausedRooms.has(room.id);
                    return (
                        <div
                            key={room.id}
                            className="bg-bg-dark border-border rounded-2xl p-4 sm:p-5 space-y-4 transition-colors"
                        >
                            {/* Room Header */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-brand-accent rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-white w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-sm font-bold line-clamp-1">{room.name}</h3>
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 w-fit mt-0.5",
                                            room.status === "Occupied"
                                                ? "bg-brand-success/20 text-brand-success"
                                                : "bg-brand-info/20 text-brand-info"
                                        )}>
                                            {room.status === "Occupied"
                                                ? <CheckCircle2 className="w-2.5 h-2.5" />
                                                : <Users className="w-2.5 h-2.5" />
                                            }
                                            {room.status}
                                        </span>
                                    </div>
                                </div>
                                {/* Time Left */}
                                <div className="text-right shrink-0">
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                                        <Clock className="w-3 h-3" /> Time Left
                                    </p>
                                    <p className="text-white text-base font-bold">{room.timeLeft}</p>
                                </div>
                            </div>

                            {/* Group Info */}
                            <div className="bg-bg-deep border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3">
                                <div className="space-y-0.5 min-w-0">
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Current Group</p>
                                    <p className="text-white font-bold truncate text-sm">{room.group}</p>
                                    <p className="text-zinc-600 text-xs truncate">{room.details}</p>
                                </div>
                                {room.status === "Occupied" && (
                                    <div
                                        onClick={() => togglePause(room.id)}
                                        title={isPaused ? "Resume" : "Pause"}
                                        className="bg-brand-secondary p-1.5 rounded-md cursor-pointer hover:bg-brand-secondary/90 shrink-0 transition-colors"
                                    >
                                        {isPaused
                                            ? <Play className="w-3.5 h-3.5 text-black" fill="black" />
                                            : <Pause className="w-3.5 h-3.5 text-black" fill="black" />
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Stations */}
                            <div className="space-y-2">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Stations</p>
                                <div className="space-y-1.5">
                                    {room.stations.map((station) => (
                                        <div
                                            key={station.id}
                                            className="bg-bg-card border border-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="bg-brand-success/20 p-0.5 rounded">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                                                </div>
                                                <span className="text-white text-xs font-semibold">Station {station.id}</span>
                                            </div>
                                            {station.team && (
                                                <span className="text-zinc-400 text-xs font-medium">{station.team}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Assign button for available rooms */}
                            {room.status === "Available" && (
                                <button className="w-full cursor-pointer bg-brand-secondary text-black py-2 rounded-xl font-bold hover:bg-brand-secondary/90 transition-colors text-xs">
                                    Available for Assign Group
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-zinc-500">
                    <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-bold text-sm uppercase tracking-wider">No rooms found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filter</p>
                </div>
            )}
        </div>
    );
}
