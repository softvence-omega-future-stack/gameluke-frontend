"use client";

import {
    MapPin,
    Users,
    AlertCircle,
    Search,
    Plus,
    Pause,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        label: "Active Rooms",
        value: "14/18",
        icon: MapPin,
        color: "text-brand-success",
        bgColor: "bg-brand-success/10",
    },
    {
        label: "Total Players",
        value: "42",
        icon: Users,
        color: "text-brand-info",
        bgColor: "bg-brand-info/10",
    },
    {
        label: "Defective Stations",
        value: "04",
        icon: AlertCircle,
        color: "text-brand-error",
        bgColor: "bg-brand-error/10",
    },
];
interface Station {
    id: string;
    team?: string;
    active: boolean;
}

interface Room {
    id: string;
    name: string;
    status: string;
    timeLeft: string;
    group: string;
    details: string;
    stations: Station[];
}

const rooms: Room[] = [
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
];

export default function LiveMonitoringPage() {
    return (
        <div className="space-y-8 max-w-8xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-brand-secondary">Admin Dashboard</h1>
                    <p className="text-brand-success mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your platform.</p>
                </div>
                <button className="w-full sm:w-auto bg-brand-secondary text-black px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary/90 transition-colors text-sm sm:text-base">
                    <Plus className="w-4 h-4" />
                    Create New Group
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-bg-dark border border-zinc-700/50 rounded-2xl p-4 sm:p-6 flex items-center justify-between group hover:border-brand-secondary/30 transition-all duration-300">
                        <div>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-white text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 tracking-tight">{stat.value}</p>
                        </div>
                        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bgColor)}>
                            <stat.icon className={cn("w-5 h-5 sm:w-6 h-6", stat.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Room Status Section */}
            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Live Room Status</h2>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by the Room name or game"
                        className="w-full bg-bg-card border border-zinc-800 rounded-xl py-3 md:py-3.5 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all placeholder:text-zinc-600 text-sm sm:text-base italic"
                    />
                </div>

                {/* Room Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-bg-dark border border-zinc-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 hover:border-brand-secondary/20 transition-colors">
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-accent rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-white w-4 h-4 sm:w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-lg sm:text-xl font-bold line-clamp-1">{room.name}</h3>
                                        <span className={cn(
                                            "text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 w-fit mt-1",
                                            room.status === "Occupied" ? "bg-brand-success/20 text-brand-success" : "bg-brand-info/20 text-brand-info"
                                        )}>
                                            {room.status === "Occupied" ? <CheckCircle2 className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                            {room.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-left xs:text-right">
                                    <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Time Left</p>
                                    <p className="text-white text-xl sm:text-2xl font-bold">{room.timeLeft}</p>
                                </div>
                            </div>

                            {/* Group Info Box */}
                            <div className="bg-bg-deep border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                                <div className="space-y-1 min-w-0">
                                    <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Current Group</p>
                                    <p className="text-white font-bold truncate text-sm sm:text-base">{room.group}</p>
                                    <p className="text-zinc-600 text-xs sm:text-sm truncate">{room.details}</p>
                                </div>
                                {room.status === "Occupied" && (
                                    <div className="bg-brand-secondary p-1.5 sm:p-2 rounded-md cursor-pointer hover:bg-brand-secondary/90 shrink-0">
                                        <Pause className="w-3.5 h-3.5 sm:w-4 h-4 text-black" fill="black" />
                                    </div>
                                )}
                            </div>

                            {/* Stations List */}
                            <div className="space-y-3">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Stations</p>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                                    {room.stations.map((station) => (
                                        <div key={station.id} className="bg-bg-card border border-zinc-800 rounded-xl p-3 flex items-center justify-between hover:bg-grey-900 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-brand-success/20 p-1 rounded-md">
                                                    <CheckCircle2 className="w-4 h-4 text-brand-success" />
                                                </div>
                                                <span className="text-white text-sm sm:text-base font-semibold">Station {station.id}</span>
                                            </div>
                                            {station.team && <span className="text-zinc-400 text-xs sm:text-sm font-medium">{station.team}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {room.status === "Available" && (
                                <button className="w-full bg-brand-secondary text-black py-2.5 sm:py-3 rounded-xl font-bold hover:bg-brand-secondary/90 transition-colors mt-2 text-sm sm:text-base">
                                    Available for Assign Group
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button className="w-full py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-zinc-200 transition-colors shadow-2xl shadow-white/5">
                    See All Rooms
                </button>
            </div>
        </div>
    );
}
