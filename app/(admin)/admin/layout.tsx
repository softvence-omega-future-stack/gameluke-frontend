"use client";

import { useState } from "react";
import { Sidebar } from "../../../components/admin/Sidebar";
import { Navbar } from "../../../components/admin/Navbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isSigninPage = pathname === "/admin/signin";

  if (isSigninPage) {
    return (
      <div className="flex h-screen bg-bg-deep overflow-hidden relative">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-deep overflow-hidden relative">
      {/* Sidebar - Drawer mechanism handled inside component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-10">
          <div className="max-w-8xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
