"use client";

import { Search, Menu } from "lucide-react";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-4 sm:px-8 bg-bg-dark">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* <div className="flex-1 max-w-md relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-bg-deep border border-zinc-700/50 rounded-lg py-2 pl-10 pr-4 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-brand-secondary transition-colors"
                    />
                </div> */}
            </div>

            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                    <img
                        src="https://i.pravatar.cc/150?u=admin"
                        alt="Admin Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
