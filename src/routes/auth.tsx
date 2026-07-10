import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Drive Wise" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  async function handleGoogle() {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/app" });
    if (res.error) {
      toast.error(res.error.message || "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (res.redirected) return;
    navigate({ to: "/app" });
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/app" },
        });
        if (error) throw error;
        toast.success("Check your email to confirm the account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/app" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="w-full max-w-md glass-strong rounded-2xl p-8 gradient-border animate-scale-in">
        <div className="flex items-center gap-2 mb-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15">
            <Sparkles className="h-5 w-5 text-primary" />
          </span>
          <span className="font-display text-lg font-semibold">Drive Wise</span>
        </div>
        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to explore brochures and chat." : "Start asking brochure-grounded questions."}
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-black py-2.5 text-sm font-medium hover:bg-white/90 transition disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.4-5 3.4-8.3z"/><path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.7v2.9C3.6 20.6 7.5 23 12 23z"/><path fill="#FBBC05" d="M5.6 13.8c-.2-.7-.4-1.4-.4-2.3s.1-1.6.4-2.3V6.3H1.7C.9 8 .5 9.9.5 12s.4 4 1.2 5.7l3.9-3z"/><path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 2 15.1 1 12 1 7.5 1 3.6 3.4 1.7 6.3l3.9 3C6.5 7.4 9 5.4 12 5.4z"/></svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input type="email" required placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-input/60 border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition" />
          <input type="password" required minLength={6} placeholder="Password (6+ chars)" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-input/60 border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition" />
          <button type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition">
          {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
