import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import heroCar from "@/assets/hero-car.jpg";
import { ArrowRight, Sparkles, ShieldCheck, Database, Cpu, ChevronDown } from "lucide-react";
import ParticleField from "@/components/drive-wise/ParticleField";
import Footer from "@/components/drive-wise/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Drive Wise — Official Brochures. Intelligent Answers." },
      { name: "description", content: "Choose a brand and model, then chat with an AI that answers only from the official brochure, with cited sources." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const carRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Subtle mouse parallax for the hero car
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (carRef.current) {
        carRef.current.style.transform =
          `translate3d(${x * 18}px, ${y * 10}px, 0) rotateX(${y * -4}deg) rotateY(${x * 6}deg)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x * 40}px, ${y * 24}px, 0)`;
      }
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl glass gradient-border">
              <Sparkles className="h-5 w-5 text-primary" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Drive Wise</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#stack" className="hover:text-foreground transition">Stack</a>
          </nav>
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Launch <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Full-viewport hero */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-16"
        style={{ perspective: "1400px" }}
      >
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <ParticleField />

        {/* Ambient moving glow */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[640px] w-[640px] rounded-full bg-primary/25 blur-[140px] transition-transform duration-700 ease-out"
        />

        {/* Center stage — clean vertical stack */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
            Metadata-Aware · Brochure Grounded · Source Attributed
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-up">
            Drive <span className="gradient-text">Wise</span>
          </h1>

          <p className="mt-4 text-base md:text-xl text-muted-foreground max-w-2xl animate-fade-up" style={{ animationDelay: "80ms" }}>
            Official Brochures. <span className="text-foreground">Intelligent Answers.</span>
          </p>

          {/* SUV visual */}
          <div
            className="relative mx-auto mt-10 md:mt-12 w-full max-w-3xl animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            <div className="animate-float-slow" style={{ transformStyle: "preserve-3d" }}>
              <div
                ref={carRef}
                className="relative will-change-transform transition-transform duration-[900ms] ease-out"
                style={{ transformStyle: "preserve-3d" }}
              >
              {/* Layered halos for depth */}
              <div className="absolute -inset-10 rounded-[3rem] bg-primary/20 blur-3xl opacity-70" />
              <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/10 blur-2xl" />

              <div className="relative rounded-[2rem] overflow-hidden gradient-border shadow-glow">
                <img
                  src={heroCar}
                  alt="Premium concept SUV under blue studio light"
                  width={1600}
                  height={1000}
                  className="w-full h-auto object-cover"
                />
                {/* Ambient lighting layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-background/70" />
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/12 to-transparent mix-blend-overlay" />
                {/* Slow moving highlight sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-sweep pointer-events-none" />
              </div>

              {/* Ground reflection */}
              <div
                aria-hidden
                className="mx-auto mt-[-8px] h-16 w-[70%] rounded-[50%] bg-primary/30 blur-2xl opacity-70"
              />
            </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <Link
              to="/app"
              className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm md:text-base font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a href="#features" className="rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-secondary/50 transition">
              See how it works
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#features"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/70 hover:text-foreground transition animate-float"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              A showroom experience, <span className="gradient-text">powered by RAG.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Browse brands and models, explore an interactive brochure, and chat with an AI assistant that only speaks in facts from the source.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Database, title: "Metadata filtering", body: "Every question is scoped to the exact brand, model, section and version." },
              { icon: Cpu, title: "Vector retrieval", body: "Top-k brochure chunks are ranked and injected as grounded context." },
              { icon: ShieldCheck, title: "Cited answers", body: "Each reply surfaces the source section, page and chunk ID." },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover-lift gradient-border">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline preview */}
      <section id="how" className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              The <span className="gradient-text">retrieval pipeline.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">Metadata-first RAG that keeps answers narrow, factual, and citable.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8 md:p-10 overflow-x-auto scrollbar-hidden">
            <div className="flex items-stretch gap-3 min-w-[900px]">
              {["User Question", "Metadata Filter", "Vector Search", "Re-ranking", "Context", "LLM", "Answer + Source"].map((s, i, a) => (
                <div key={s} className="flex items-center gap-3 flex-1">
                  <div className="flex-1 rounded-2xl gradient-border glass px-4 py-5 text-center">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Step {i + 1}</div>
                    <div className="text-sm font-semibold">{s}</div>
                  </div>
                  {i < a.length - 1 && (
                    <div className="w-8 h-[2px] rounded bg-gradient-to-r from-primary/60 to-primary/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="stack" />
      <Footer />
    </div>
  );
}
