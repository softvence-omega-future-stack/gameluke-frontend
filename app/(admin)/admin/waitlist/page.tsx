"use client";

import React from "react";
import {
    History,
    Users,
    Timer,
    CheckCircle2,
    PencilLine,
    Trash2,
    Play,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        label: "Groups Waiting",
        value: "04",
        Icon: CheckCircle2,
        iconBg: "bg-brand-info/20",
        iconColor: "text-brand-info",
    },
    {
        label: "Total Players",
        value: "22",
        Icon: PencilLine,
        iconBg: "bg-brand-warning/20",
        iconColor: "text-brand-warning",
    },
    {
        label: "Longest Wait",
        value: "5m 0s",
        Icon: History,
        iconBg: "bg-brand-accent/20",
        iconColor: "text-brand-accent",
    }
];

const queueData = [
    {
        id: 1,
        position: "#1",
        name: "Ninja Warriors",
        isNext: true,
        players: 5,
        waitTime: "5m 0s",
        avgScore: "18,450",
        gamesPlayed: 2,
    },
    {
        id: 2,
        position: "#2",
        name: "Elite Squad",
        isNext: false,
        players: 4,
        waitTime: "4m 0s",
        avgScore: "22,100",
        gamesPlayed: 3,
    },
    {
        id: 3,
        position: "#3",
        name: "Thunder Titans",
        isNext: false,
        players: 6,
        waitTime: "3m 0s",
        avgScore: "15,800",
        gamesPlayed: 1,
    },
    {
        id: 4,
        position: "#4",
        name: "Shadow Legends",
        isNext: false,
        players: 3,
        waitTime: "2m 0s",
        avgScore: "19,200",
        gamesPlayed: 2,
    },
    {
        id: 5,
        position: "#5",
        name: "Cosmic Force",
        isNext: false,
        players: 4,
        waitTime: "1m 0s",
        avgScore: "16,500",
        gamesPlayed: 1,
    }
];

export default function WaitlistPage() {
    return (
        <div className="space-y-8 max-w-8xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary text-nowrap">Waitlist Management</h1>
                    <p className="text-brand-success mt-1 text-sm tracking-wider">Manage group queue and priority settings</p>
                </div>
                {/* <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-brand-secondary text-black rounded-lg font-bold hover:bg-brand-secondary/90 transition-colors text-sm sm:text-base text-nowrap">
                    <History className="w-4 h-4 sm:w-5 h-5" />
                    Hide History
                </button> */}
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stats.map((item, index) => (
                    <div key={index} className="bg-bg-card border-border p-4 sm:p-6 flex items-center justify-between group transition-all duration-300">
                        <div>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{item.value}</h2>
                        </div>
                        <div className={cn("p-2.5 sm:p-3 rounded-lg transition-transform", item.iconBg)}>
                            <item.Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", item.iconColor)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Queue Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Current Queue</h3>

                <div className="space-y-4">
                    {queueData.map((group) => (
                        <div key={group.id} className="bg-bg-card border-border p-3 sm:p-4 sm:rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 group transition-all">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
                                <div className="flex flex-col items-center justify-center min-w-14 sm:min-w-16">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-accent rounded-lg flex items-center justify-center text-white text-lg sm:text-xl font-bold mb-1">
                                        {group.position}
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">Position</span>
                                </div>

                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                                        <h4 className="text-base sm:text-lg font-bold text-white truncate max-w-50 sm:max-w-none">{group.name}</h4>
                                        {group.isNext && (
                                            <span className="bg-brand-warning/20 text-brand-warning px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">Next</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-zinc-400 text-xs sm:text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                                            <span>{group.players} players</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                                            <span>{group.waitTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span>Avg Score: <span className="text-zinc-300">{group.avgScore}</span></span>
                                        </div>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{group.gamesPlayed} games played</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <button className="flex-1 cursor-pointer md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-brand-secondary text-black rounded-lg font-bold hover:bg-brand-secondary/90 transition-colors whitespace-nowrap text-sm sm:text-base">
                                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
                                    Assign Room
                                </button>
                                <button className="p-2.5 cursor-pointer sm:p-2 text-zinc-500 border border-zinc-800 rounded-lg hover:bg-brand-error/20 hover:text-brand-error hover:border-brand-error/50 transition-all shrink-0">
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notification Bar */}
            <div className="bg-bg-dark/60 border border-brand-info/30 p-4 rounded-xl flex items-start gap-3">
                <div className="p-1 rounded bg-brand-info/20">
                    <Info className="w-5 h-5 text-brand-info" />
                </div>
                <div>
                    <h5 className="text-brand-info text-sm sm:text-base font-bold uppercase tracking-wider">Auto-Promotion Active</h5>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
                        Groups will be automatically assigned to rooms as they become available, following the First In First Out priority order.
                    </p>
                </div>
            </div>
        </div>
    );
}
