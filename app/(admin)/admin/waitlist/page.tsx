"use client"
import {
    History,
    Users,
    Timer,
    CheckCircle2,
    PencilLine,
    Trash2,
    Play,
    Info,
    AlertTriangle,
    RefreshCcw,
    Layout,
    X,
    MapPin,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetWaitlistQuery, WaitlistGroup, useStartAllWaitlistMutation } from "@/redux/api/admin/groupsApi";
import { useGetStudiosQuery, Studio } from "@/redux/api/admin/studiosApi";
import { useAssignGroupMutation } from "@/redux/api/admin/godModeApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { startTimer } from "@/redux/features/timerSlice";

const WaitlistSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-6 w-full">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-lg" />
                    <div className="space-y-3 flex-1">
                        <div className="h-5 bg-zinc-800/50 rounded w-1/3" />
                        <div className="flex gap-4">
                            <div className="h-3 bg-zinc-800/50 rounded w-20" />
                            <div className="h-3 bg-zinc-800/50 rounded w-20" />
                        </div>
                    </div>
                </div>
                <div className="w-32 h-10 bg-zinc-800/50 rounded-lg" />
            </div>
        ))}
    </div>
);

const StatSkeleton = () => (
    <div className="bg-bg-card border border-border p-6 flex items-center justify-between animate-pulse">
        <div className="space-y-2">
            <div className="h-3 bg-zinc-800/50 rounded w-20" />
            <div className="h-8 bg-zinc-800/50 rounded w-12" />
        </div>
        <div className="w-12 h-12 bg-zinc-800/50 rounded-lg" />
    </div>
);

const StudioItemSkeleton = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg" />
            <div className="space-y-2">
                <div className="h-4 w-32 bg-zinc-800 rounded" />
                <div className="h-3 w-24 bg-zinc-800 rounded" />
            </div>
        </div>
        <div className="h-8 w-20 bg-zinc-800 rounded-lg" />
    </div>
);

interface StudioAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: WaitlistGroup | null;
}

const StudioAssignmentModal = ({ isOpen, onClose, group }: StudioAssignmentModalProps) => {
    const { data: studiosData, isLoading, isError, refetch } = useGetStudiosQuery();
    const [assignGroup, { isLoading: isAssigning }] = useAssignGroupMutation();
    const [assignError, setAssignError] = useState<string | null>(null);

    const studios = studiosData?.data || [];

    const handleAssign = async (studioNumber: number) => {
        if (!group) return;
        setAssignError(null);

        try {
            const result = await assignGroup({
                groupId: group.id,
                studioNumber: studioNumber
            }).unwrap();

            if (result.success) {
                onClose();
            }
        } catch (err: any) {
            setAssignError(err?.data?.message || "Failed to assign group. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-secondary/10 rounded-2xl flex items-center justify-center border border-brand-secondary/20">
                            <Layout className="text-brand-secondary w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Assign Studio</h2>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-0.5">
                                Select target for <span className="text-brand-secondary">{group?.name}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {assignError && (
                        <div className="mb-4 bg-brand-error/10 border border-brand-error/20 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle className="text-brand-error w-5 h-5 shrink-0" />
                            <p className="text-brand-error text-sm font-bold">{assignError}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => <StudioItemSkeleton key={i} />)}
                        </div>
                    ) : isError ? (
                        <div className="py-12 flex flex-col items-center text-center gap-4">
                            <AlertCircle className="text-brand-error w-12 h-12 opacity-50" />
                            <div>
                                <h4 className="text-white font-bold">Failed to load studios</h4>
                                <button onClick={() => refetch()} className="text-brand-secondary text-sm font-bold mt-2 hover:underline">Retry Connection</button>
                            </div>
                        </div>
                    ) : studios.length === 0 ? (
                        <div className="py-12 flex flex-col items-center text-center gap-4 text-zinc-600">
                            <Layout className="w-12 h-12 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-xs">No Studios Configured</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {studios.map((studio) => (
                                <div
                                    key={studio.id}
                                    className={cn(
                                        "group border p-4 rounded-2xl flex items-center justify-between transition-all duration-300",
                                        studio.status === "AVAILABLE"
                                            ? "bg-zinc-900/50 border-zinc-800 hover:border-brand-secondary/50 hover:bg-brand-secondary/[0.02]"
                                            : "bg-zinc-900/20 border-zinc-900 opacity-60 grayscale cursor-not-allowed"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center border transition-colors",
                                            studio.status === "AVAILABLE" ? "bg-zinc-800 border-zinc-700 group-hover:bg-brand-secondary/20 group-hover:border-brand-secondary/30" : "bg-zinc-900 border-zinc-800"
                                        )}>
                                            <MapPin className={cn(
                                                "w-5 h-5",
                                                studio.status === "AVAILABLE" ? "text-brand-secondary" : "text-zinc-700"
                                            )} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm sm:text-base">{studio.name}</h4>
                                            <p className="text-zinc-500 text-xs">{studio.gameName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-md border",
                                            studio.status === "AVAILABLE"
                                                ? "bg-brand-success/10 text-brand-success border-brand-success/20"
                                                : "bg-brand-error/10 text-brand-error border-brand-error/20"
                                        )}>
                                            {studio.status}
                                        </span>
                                        {studio.status === "AVAILABLE" && (
                                            <button
                                                onClick={() => handleAssign(studio.studioNumber)}
                                                disabled={isAssigning}
                                                className="bg-brand-secondary text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-secondary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isAssigning ? "Assigning..." : "Assign"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 flex justify-end">
                    <button onClick={onClose} className="px-6 py-3 bg-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-700 transition-all">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function WaitlistPage() {
    const dispatch = useDispatch();
    const { data: waitlistData, isLoading, isError, refetch } = useGetWaitlistQuery();
    const [startAll, { isLoading: isStartingAll }] = useStartAllWaitlistMutation();
    const [selectedGroup, setSelectedGroup] = useState<WaitlistGroup | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const waitlist = waitlistData?.data || [];

    const handleStartAll = async () => {
        try {
            await startAll().unwrap();
            dispatch(startTimer(12));
        } catch (err) {
            console.error("Failed to start all:", err);
        }
    };

    const totalPlayers = waitlist.reduce((acc: number, group: WaitlistGroup) => acc + group.totalPlayers, 0);

    const formatWaitTime = (createdAt: string) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = Math.max(0, now.getTime() - created.getTime());
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        return `${diffMins}m ${diffSecs}s`;
    };

    const longestWait = waitlist.length > 0
        ? formatWaitTime(waitlist[0].createdAt)
        : "0m 0s";

    const stats = [
        {
            label: "Groups Waiting",
            value: isLoading ? "..." : String(waitlist.length).padStart(2, '0'),
            Icon: CheckCircle2,
            iconBg: "bg-brand-info/20",
            iconColor: "text-brand-info",
        },
        {
            label: "Total Players",
            value: isLoading ? "..." : String(totalPlayers).padStart(2, '0'),
            Icon: Users,
            iconBg: "bg-brand-warning/20",
            iconColor: "text-brand-warning",
        },
        {
            label: "Longest Wait",
            value: isLoading ? "..." : longestWait,
            Icon: History,
            iconBg: "bg-brand-accent/20",
            iconColor: "text-brand-accent",
        }
    ];

    return (
        <div className="space-y-8 max-w-8xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-secondary text-nowrap">Waitlist Management</h1>
                    <p className="text-brand-success mt-1 text-sm tracking-wider">Manage group queue and priority settings</p>
                </div>
                {waitlist.length > 0 && (
                    <button
                        onClick={handleStartAll}
                        disabled={isStartingAll}
                        className="w-full sm:w-auto bg-[#fff200] text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e6d800] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#fff200]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-black" strokeWidth={3} />
                        {isStartingAll ? "Starting..." : "Start All Groups"}
                    </button>
                )}
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
                ) : (
                    stats.map((item, index) => (
                        <div key={index} className="bg-bg-card border border-border p-4 sm:p-6 flex items-center justify-between group transition-all duration-300 hover:border-zinc-700">
                            <div>
                                <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{item.value}</h2>
                            </div>
                            <div className={cn("p-2.5 sm:p-3 rounded-lg transition-transform group-hover:scale-110", item.iconBg)}>
                                <item.Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", item.iconColor)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Queue Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Current Queue</h3>
                    {isError && (
                        <button
                            onClick={() => refetch()}
                            className="bg-brand-error/10 text-brand-error px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-error/20 transition-all"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Retry
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <WaitlistSkeleton />
                    ) : isError ? (
                        <div className="bg-bg-card border border-brand-error/20 rounded-2xl p-12 flex flex-col items-center text-center gap-4">
                            <AlertTriangle className="text-brand-error w-12 h-12 opacity-50" />
                            <div>
                                <h4 className="text-white font-bold">Failed to load waitlist</h4>
                                <p className="text-zinc-500 text-sm mt-1">Check your connection and try again.</p>
                            </div>
                        </div>
                    ) : waitlist.length === 0 ? (
                        <div className="bg-bg-card border border-border rounded-2xl p-16 flex flex-col items-center text-center gap-5">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                                <Users className="text-zinc-600 w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Queue is Empty</h4>
                                <p className="text-zinc-500 text-sm mt-1">There are no groups currently waiting for a studio.</p>
                            </div>
                        </div>
                    ) : (
                        waitlist.map((group: WaitlistGroup, index: number) => (
                            <div key={group.id} className="bg-bg-card border border-border p-3 sm:p-4 sm:rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 group transition-all hover:border-zinc-700">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
                                    <div className="flex flex-col items-center justify-center min-w-14 sm:min-w-16">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-800 border border-zinc-700 group-hover:bg-brand-secondary group-hover:border-brand-secondary group-hover:text-black rounded-lg flex items-center justify-center text-white text-lg sm:text-xl font-bold mb-1 transition-all">
                                            #{index + 1}
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">Position</span>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                                            <h4 className="text-base sm:text-lg font-bold text-white truncate max-w-50 sm:max-w-none">{group.name}</h4>
                                            {index === 0 && (
                                                <span className="bg-brand-warning/20 text-brand-warning px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap animate-pulse">Next up</span>
                                            )}
                                            {group.childFriendly && (
                                                <span className="bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap">Child Friendly</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-zinc-400 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                                                <span>{group.totalPlayers} players</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                                                <span>Waiting for {formatWaitTime(group.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">Status: {group.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(group);
                                            setIsModalOpen(true);
                                        }}
                                        disabled={group.totalPlayers === 0}
                                        className="flex-1 cursor-pointer md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-2 bg-brand-secondary text-black rounded-lg font-bold hover:bg-brand-secondary/90 transition-all whitespace-nowrap text-sm sm:text-base disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" strokeWidth={3} />
                                        Assign Studio
                                    </button>
                                    <button className="p-2.5 cursor-pointer sm:p-2 text-zinc-500 border border-zinc-800 rounded-lg hover:bg-brand-error/20 hover:text-brand-error hover:border-brand-error/50 transition-all shrink-0">
                                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Notification Bar */}
            <div className="bg-bg-dark/40 border border-brand-info/20 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                <div className="p-2 rounded-xl bg-brand-info/10">
                    <Info className="w-6 h-6 text-brand-info" />
                </div>
                <div>
                    <h5 className="text-brand-info text-sm sm:text-base font-bold uppercase tracking-wider">FIFO Priority Enabled</h5>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1 leading-relaxed">
                        The queue follows the First In First Out order. You can manually promote a group by assigning it to an available studio from the actions menu above.
                    </p>
                </div>
            </div>

            <StudioAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                group={selectedGroup}
            />
        </div>
    );
}
