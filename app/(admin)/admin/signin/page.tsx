"use client";

import React, { useState } from "react";
import {
  Layout,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock login logic
      console.log("Logging in...", { email, password });

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to dashboard
      router.push("/admin/live-monitoring");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-500/20 mb-4 animate-in zoom-in-95 duration-700">
            <Layout className="text-white w-8 h-8" />
          </div>
          <h1 className="text-white text-2xl sm:text-3xl font-black italic tracking-tighter uppercase mb-2">
            Admin <span className="text-brand-secondary">Panel</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
            GameArena Control
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-bg-card border border-zinc-800 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-secondary to-transparent opacity-50" />

          <div className="mb-8">
            <h2 className="text-white text-xl font-black uppercase italic tracking-tight mb-1">
              Welcome Back
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
              Please enter your credentials to manage the gamearena
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] ml-1 block">
                Email Address
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-600 group-focus-within/input:text-brand-secondary transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gamearena.com"
                  className="w-full bg-bg-deep border border-zinc-700 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-brand-secondary transition-all placeholder:text-zinc-700 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] block">
                  Password
                </label>
                {/* <button
                  type="button"
                  className="text-brand-secondary text-[10px] font-bold uppercase tracking-wider hover:underline transition-all"
                >
                  Forgot Password?
                </button> */}
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-600 group-focus-within/input:text-brand-secondary transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-deep border border-zinc-700 rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-brand-secondary transition-all placeholder:text-zinc-700 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-zinc-600 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-brand-error/10 border border-brand-error/20 rounded-xl p-3 flex items-center gap-3 animate-in fade-in zoom-in-95">
                <div className="w-2 h-2 bg-brand-error rounded-full animate-pulse" />
                <span className="text-brand-error text-[10px] font-bold uppercase tracking-wider">
                  {error}
                </span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 px-6 bg-brand-secondary text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-secondary/90 transition-all shadow-xl shadow-brand-secondary/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2",
                isLoading && "opacity-70 pointer-events-none",
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in to control</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Stats */}
          <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-brand-success rounded-full" />
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-brand-secondary" />
              <span>Secure Access</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          Authorized Personnel Only • IP Logger Enabled
        </p>
      </div>
    </div>
  );
}
