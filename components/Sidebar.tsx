"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Monitor,
    Settings,
    BarChart2,
    Layout,
    Shield,
    LogOut,
    BarChart3,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Live Monitoring",
        icon: Monitor,
        href: "/admin/live-monitoring",
    },
    {
        title: "Room Management",
        icon: Settings,
        href: "/admin/room-management",
    },
    {
        title: "Waitlist",
        icon: BarChart3,
        href: "/admin/waitlist",
    },
    {
        title: "Score Management",
        icon: Layout,
        href: "/admin/score-management",
    },
    {
        title: "Analytics",
        icon: BarChart2,
        href: "/admin/analytis",
    },
    {
        title: "God Mode",
        icon: Shield,
        href: "/admin/god-mode",
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <div
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-bg-deep border-r border-zinc-800/50 flex flex-col transition-transform lg:transition-none duration-300 transform lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm sm:text-base leading-none">Admin Panel</h1>
                            <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 font-bold uppercase tracking-wider">GameArena Control</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 mt-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                    // Close sidebar on link click (mobile)
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                                    isActive
                                        ? "bg-brand-secondary text-black font-semibold"
                                        : "hover:bg-zinc-800/50 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-black" : "text-zinc-500")} />
                                <span className="text-sm sm:text-base">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <button className="flex items-center gap-2 w-full py-2.5 px-4 text-xs font-medium text-white bg-zinc-800/50 border border-red-900/30 rounded-lg hover:bg-zinc-800 transition-colors">
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
