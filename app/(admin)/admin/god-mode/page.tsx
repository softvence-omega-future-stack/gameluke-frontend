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
    Layout,
    Clock,
    RotateCcw,
    CheckCircle
} from "lucide-react";
import {
    useGetGodModeSessionsQuery,
    useAssignGroupMutation,
    usePauseSessionMutation,
    useResumeSessionMutation,
    useForceEndSessionMutation
} from "@/redux/api/admin/godModeApi";
import { useGetStudiosQuery } from "@/redux/api/admin/studiosApi";
import { useGetGroupsQuery } from "@/redux/api/admin/groupsApi";
import { cn } from "@/lib/utils";
import { format, differenceInSeconds, parseISO } from "date-fns";
import { useEffect } from "react";

const GodModeSkeleton = () => (
    <div className="min-h-screen text-white animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-zinc-800 rounded" />
                <div className="h-4 w-96 bg-zinc-800 rounded" />
            </div>
            <div className="h-10 w-32 bg-zinc-800 rounded-lg" />
        </div>
        <div className="h-24 w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl mb-8" />
        <div className="bg-[#141414] border border-zinc-800 p-6 mb-8 rounded-xl">
            <div className="flex items-center justify-between mb-8">
                <div className="h-6 w-48 bg-zinc-800 rounded" />
                <div className="h-5 w-16 bg-zinc-800 rounded" />
            </div>
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="h-40 w-full bg-zinc-900 border border-zinc-800 rounded-xl" />
                ))}
            </div>
        </div>
    </div>
);

import { CustomDropdown } from "@/components/ui/CustomDropdown";

interface SessionCardProps {
    teamName: string;
    studio: string;
    players: number;
    timeRemaining: string;
    isPaused: boolean;
    groupId: string;
    onTogglePause: (groupId: string, currentPaused: boolean) => Promise<void>;
    onForceEnd: (groupId: string) => Promise<void>;
}

const SessionCard = ({ teamName, studio, players, timeRemaining, isPaused, groupId, onTogglePause, onForceEnd }: SessionCardProps) => {
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isEndingLoading, setIsEndingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async () => {
        setError(null);
        setIsActionLoading(true);
        try {
            await onTogglePause(groupId, isPaused);
        } catch (err: any) {
            setError(err?.data?.message || "Action failed");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleForceEnd = async () => {
        if (!confirm(`Are you sure you want to FORCE END the session for ${teamName}? This action cannot be undone.`)) return;

        setError(null);
        setIsEndingLoading(true);
        try {
            await onForceEnd(groupId);
        } catch (err: any) {
            setError(err?.data?.message || "Termination failed");
        } finally {
            setIsEndingLoading(false);
        }
    };

    return (
        <div className="bg-bg-card border-border p-5 mb-4 transition-all duration-300 hover:border-[#ec2c8a]/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border transition-all",
                        isPaused
                            ? "bg-amber-500/20 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                            : "bg-[#ec2c8a]/20 border-[#ec2c8a]/30 shadow-[0_0_15px_rgba(236,44,138,0.1)]"
                    )}>
                        {isPaused ? (
                            <Pause className="text-amber-500 fill-amber-500" size={20} />
                        ) : (
                            <Play className="text-[#ec2c8a] fill-[#ec2c8a]" size={20} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-base font-bold text-white">{teamName}</h3>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border",
                                isPaused
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    : "bg-brand-success/10 text-brand-success border-brand-success/20"
                            )}>
                                {isPaused ? "RESUME" : "PLAYING"}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">{studio} • {players} players</p>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end w-full md:w-auto">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-1">Live Clock</p>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
                        isPaused
                            ? "bg-zinc-900 border-zinc-800"
                            : "bg-[#ec2c8a]/10 border-[#ec2c8a]/20"
                    )}>
                        <Clock size={14} className={isPaused ? "text-zinc-600" : "text-[#ec2c8a]"} />
                        <p className={cn(
                            "text-xl font-mono font-black",
                            isPaused ? "text-zinc-500" : "text-white"
                        )}>{timeRemaining}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 flex items-center gap-2 text-brand-error text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                    <AlertTriangle size={14} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <button
                    onClick={handleToggle}
                    disabled={isActionLoading}
                    className="flex cursor-pointer items-center justify-center gap-2 py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-[#fff200] hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isActionLoading ? (
                        <RotateCcw size={16} className="animate-spin" />
                    ) : isPaused ? (
                        <>
                            <Play size={16} fill="currentColor" />
                            Resume Session
                        </>
                    ) : (
                        <>
                            <Pause size={16} fill="currentColor" />
                            Pause Session
                        </>
                    )}
                </button>
                <button
                    onClick={handleForceEnd}
                    disabled={isEndingLoading}
                    className="flex cursor-pointer items-center justify-center gap-2 py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-[#ff4842] hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEndingLoading ? (
                        <RotateCcw size={16} className="animate-spin" />
                    ) : (
                        <>
                            <Square size={16} fill="currentColor" />
                            Force End Session
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const studioOptions = [
    { value: "studio1", label: "Studio 1" },
    { value: "studio2", label: "Studio 2" },
    { value: "studio3", label: "Studio 3" },
    { value: "studio4", label: "Studio 4" },
];

export default function GodModePage() {
    const { data: godModeData, isLoading: isGodModeLoading, isError: isGodModeError, refetch: refetchGodMode } = useGetGodModeSessionsQuery(undefined, {
        pollingInterval: 30000,
    });
    const { data: studiosData, isLoading: isStudiosLoading } = useGetStudiosQuery();
    const { data: groupsData, isLoading: isGroupsLoading } = useGetGroupsQuery();

    const [pauseSession] = usePauseSessionMutation();
    const [resumeSession] = useResumeSessionMutation();
    const [forceEndSession] = useForceEndSessionMutation();
    const [assignGroup, { isLoading: isAssigning }] = useAssignGroupMutation();

    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedStudio, setSelectedStudio] = useState("");
    const [now, setNow] = useState(new Date());
    const [assignError, setAssignError] = useState<string | null>(null);
    const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTogglePause = async (groupId: string, currentPaused: boolean) => {
        if (currentPaused) {
            await resumeSession({ groupId }).unwrap();
        } else {
            await pauseSession({ groupId }).unwrap();
        }
    };

    const handleForceEnd = async (groupId: string) => {
        await forceEndSession({ groupId }).unwrap();
    };

    const handleManualAssign = async () => {
        if (!selectedGroup || !selectedStudio) return;

        setAssignError(null);
        setAssignSuccess(null);

        try {
            await assignGroup({
                groupId: selectedGroup,
                studioNumber: parseInt(selectedStudio)
            }).unwrap();

            setAssignSuccess("Group assigned and session activated!");
            setSelectedGroup("");
            setSelectedStudio("");

            // Clear success message after 5 seconds
            setTimeout(() => setAssignSuccess(null), 5000);
        } catch (err: any) {
            setAssignError(err?.data?.message || "Failed to assign group");
        }
    };

    const calculateTimeRemaining = (startTime: string, durationMin: number) => {
        const start = parseISO(startTime);
        const end = new Date(start.getTime() + durationMin * 60000);
        const diff = differenceInSeconds(end, now);

        if (diff <= 0) return "00:00";

        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    if (isGodModeLoading || isStudiosLoading || isGroupsLoading) return <GodModeSkeleton />;

    if (isGodModeError) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Connection Lost</h3>
                <p className="text-gray-400 max-w-md mb-8">
                    Unable to synchronize with God Mode control servers. Please ensure you have administrative clearance and a stable connection.
                </p>
                <button
                    onClick={() => refetchGodMode()}
                    className="bg-[#fff200] text-black font-bold py-3 px-8 rounded-2xl hover:bg-[#e6d800] transition-all flex items-center gap-2"
                >
                    <RotateCcw size={18} />
                    Try Reconnect
                </button>
            </div>
        );
    }
    console.log(godModeData)

    const activeGroups = godModeData?.data?.activeGroups?.filter(g => g.status === "PLAYING") || [];
    const mainSession = godModeData?.data?.activeSessions?.[0];

    const groupOptions = groupsData?.data
        ?.filter((g: any) => g.status === "WAITING")
        .map((g: any) => ({
            value: g.id,
            label: g.name
        })) || [];

    const studioOptions = studiosData?.data?.map(s => ({
        value: s.studioNumber.toString(),
        label: s.name
    })) || [];


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
                    <span className="px-2 py-1 bg-[#10b98126] text-[#10b981] text-[10px] font-bold rounded-md text-nowrap">
                        {activeGroups.length} Active {activeGroups.length === 1 ? "Session" : "Sessions"}
                    </span>
                </div>

                <div className="space-y-4">
                    {activeGroups.length > 0 ? (
                        activeGroups.map((group) => (
                            <SessionCard
                                key={group.groupId}
                                groupId={group.groupId}
                                teamName={group.groupName}
                                studio={group.assignments?.[0]?.studioName || "Unassigned"}
                                players={group.playerCount}
                                isPaused={group.isPaused || false}
                                onTogglePause={handleTogglePause}
                                onForceEnd={handleForceEnd}
                                timeRemaining={mainSession ? calculateTimeRemaining(mainSession.startTime, mainSession.durationMin) : "--:--"}
                            />
                        ))
                    ) : (
                        <div className="border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
                            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-30" />
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No Active Sessions Detected</p>
                        </div>
                    )}
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
                            label="Assign to Studio"
                            options={studioOptions}
                            value={selectedStudio}
                            onChange={setSelectedStudio}
                            placeholder="Select Studio name"
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <button
                            onClick={handleManualAssign}
                            disabled={!selectedGroup || !selectedStudio || isAssigning}
                            className="w-full bg-[#fff200] cursor-pointer text-black font-bold py-3.5 px-6 rounded-2xl hover:bg-[#e6d800] transition-colors shadow-[0_0_15px_rgba(255,242,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAssigning ? (
                                <RotateCcw size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <Zap size={16} fill="currentColor" />
                                    Assign & Activate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {(assignError || assignSuccess) && (
                    <div className="mt-4 flex flex-col gap-2">
                        {assignError && (
                            <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in slide-in-from-top-1 duration-200">
                                <AlertTriangle size={14} />
                                {assignError}
                            </div>
                        )}
                        {assignSuccess && (
                            <div className="flex items-center gap-2 text-brand-success text-xs font-bold animate-in slide-in-from-top-1 duration-200">
                                <CheckCircle size={14} />
                                {assignSuccess}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
