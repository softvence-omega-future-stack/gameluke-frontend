"use client";

import React, { useState } from "react";
import {
    Zap,
    AlertTriangle,
    Crown,
    Play,
    Pause,
    Square,
    Users,
    ChevronDown,
    Layout
} from "lucide-react";

interface SessionCardProps {
    teamName: string;
    room: string;
    players: number;
    timeRemaining: string;
}

const SessionCard = ({ teamName, room, players, timeRemaining }: SessionCardProps) => (
    <div className="bg-bg-card border-border p-5 mb-4 transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ec2c8a]/20 rounded-xl flex items-center justify-center border border-[#ec2c8a]/30 group-hover:bg-[#ec2c8a]/30 transition-colors">
                    <Play className="text-[#ec2c8a] fill-[#ec2c8a]" size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-white transition-colors">{teamName}</h3>
                    <p className="text-gray-400 text-sm">{room} • {players} players</p>
                </div>
            </div>

            <div className="text-right flex flex-col items-end w-full md:w-auto">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Time Remaining</p>
                <p className="text-xl font-mono font-bold text-white">{timeRemaining}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <button className="flex cursor-pointer items-center justify-center gap-2 py-2.5 px-4 bg-transparent border-border-2 text-sm font-bold text-[#fff200] hover:scale-101 transition-all">
                <Pause size={16} />
                Pause
            </button>
            <button className="flex cursor-pointer items-center justify-center gap-2 py-2.5 px-4 bg-transparent border-border-2 text-sm font-bold text-[#ff4842] hover:scale-101 transition-all">
                <Square size={16} fill="currentColor" />
                Force End
            </button>
        </div>
    </div>
);

import { CustomDropdown } from "@/components/ui/CustomDropdown";

const groupOptions = [
    { value: "group1", label: "Shadow Legends" },
    { value: "group2", label: "Elite Squad" },
    { value: "group3", label: "Cyber Warriors" },
];

const roomOptions = [
    { value: "room1", label: "Room 1" },
    { value: "room2", label: "Room 2" },
    { value: "room3", label: "Room 3" },
    { value: "room4", label: "Room 4" },
];

export default function GodModePage() {
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");

    return (
        <div className="min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary">God Mode Controls</h1>
                    <p className="text-brand-success mt-1 text-sm tracking-wider">Advanced administrative overrides and system controls</p>
                </div>
                <div className="px-4 py-2 bg-[#fff2001a] border border-[#fff20033] rounded-lg flex items-center gap-2 text-[#fff200] text-sm font-bold uppercase tracking-wider">
                    <Crown size={16} />
                    Admin Access
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-[#450a0a]/40 border border-[#991b1b]/50 rounded-2xl p-5 mb-8 flex items-start gap-4">
                <div className="bg-[#991b1b]/20 p-2 rounded-lg">
                    <AlertTriangle className="text-[#f87171]" size={24} />
                </div>
                <div>
                    <h4 className="text-[#f87171] font-bold mb-1">Critical System Controls</h4>
                    <p className="text-[#f87171]/80 text-sm leading-relaxed">
                        Actions performed in God Mode directly affect live gameplay. All actions are logged and audited. Use with caution.
                    </p>
                </div>
            </div>

            {/* Active Session Controls */}
            <div className="bg-[#141414] border-border p-6 mb-8 shadow-[0_0_30px_rgba(255,242,0,0.05)]">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                            <Zap className="text-black" size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-[#fff200] text-base font-bold font-heading">Active Session Controls</h2>
                    </div>
                    <span className="px-2 py-1 bg-[#10b98126] text-[#10b981] text-[10px] font-bold rounded-md text-nowrap">2 Active</span>
                </div>

                <div className="space-y-4">
                    <SessionCard
                        teamName="Team Phoenix"
                        room="Room 1"
                        players={6}
                        timeRemaining="09:00"
                    />
                    <SessionCard
                        teamName="Dragon Squad"
                        room="Room 2"
                        players={4}
                        timeRemaining="11:20"
                    />
                </div>
            </div>

            {/* Manual Group Assignment */}
            <div className="bg-[#141414] border-border p-6 shadow-[0_0_30px_rgba(255,242,0,0.05)]">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                        <Users className="text-black" size={20} fill="currentColor" />
                    </div>
                    <h2 className="text-[#fff200] text-base font-bold font-heading">Manual Group Assignment</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
                    <div className="lg:col-span-2">
                        <CustomDropdown
                            label="Group Name"
                            options={groupOptions}
                            value={selectedGroup}
                            onChange={setSelectedGroup}
                            placeholder="Select group name"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <CustomDropdown
                            label="Assign to Room"
                            options={roomOptions}
                            value={selectedRoom}
                            onChange={setSelectedRoom}
                            placeholder="Select Room name"
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <button className="w-full bg-[#fff200] cursor-pointer text-black font-bold py-3.5 px-6 rounded-2xl hover:bg-[#e6d800] transition-colors shadow-[0_0_15px_rgba(255,242,0,0.2)]">
                            Assign Override
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
