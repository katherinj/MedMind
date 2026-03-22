import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type Mode = "login" | "signup";

export const Login = () => {
  const { login, signup, loginWithGoogle, error } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      // error is set by useAuth
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="fixed top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 -right-20 w-80 h-80 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
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

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant py-4 rounded-2xl font-bold text-on-surface hover:bg-surface-container transition-all active:scale-[0.98] mb-6 disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 size={20} className="animate-spin text-primary" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-outline-variant/40" />
          <span className="text-outline text-xs font-bold uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-outline-variant/40" />
        </div>

        {/* Mode toggle */}
        <div className="flex bg-surface-container rounded-2xl p-1 mb-6">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                mode === m
                  ? "pill-gradient text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Email/password form */}
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
            className="w-full pill-gradient text-white py-4 rounded-2xl font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <p className="text-center text-on-surface-variant/50 text-xs mt-8 leading-relaxed">
          MedMind is a study aid only. Content does not constitute medical
          advice and is not affiliated with or endorsed by PTCB.
        </p>
      </motion.div>
    </div>
  );
};
