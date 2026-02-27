"use client";

import { useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Navbar } from "../../../components/Navbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-bg-deep overflow-hidden relative">
            {/* Sidebar - Drawer mechanism handled inside component */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-10">
                    <div className="max-w-8xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}