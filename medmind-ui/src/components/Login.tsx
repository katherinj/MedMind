import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type Mode = "login" | "signup";

export const Login = () => {
  const { login, signup, error } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch {
      // error is set by useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Background blobs */}
      <div className="fixed top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 -right-20 w-80 h-80 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo / branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl pill-gradient mb-4 shadow-lg shadow-primary/20">
            <span className="text-white font-headline font-black text-2xl">
              M
            </span>
          </div>
          <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">
            MedMind
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {mode === "login"
              ? "Welcome back. Keep studying."
              : "Start your PTCB journey."}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-surface-container rounded-2xl p-1 mb-8">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 capitalize ${
                mode === m
                  ? "pill-gradient text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === "signup"}
                    className="w-full pl-11 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              size={18}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
              size={18}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-4 bg-surface-container-lowest border border-outline-variant rounded-2xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-error-container text-error px-4 py-3 rounded-xl text-sm font-medium"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full pill-gradient text-white py-4 rounded-2xl font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />{" "}
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-center text-on-surface-variant/50 text-xs mt-8 leading-relaxed">
          MedMind is a study aid only. Content does not constitute medical
          advice and is not affiliated with or endorsed by PTCB.
        </p>
      </motion.div>
    </div>
  );
};
