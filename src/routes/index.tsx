import { createFileRoute, Link } from "@tanstack/react-router";
import heroCar from "@/assets/hero-car.jpg";
import { ArrowRight, Sparkles, ShieldCheck, Database, Cpu } from "lucide-react";
import ParticleField from "@/components/drive-wise/ParticleField";
import Footer from "@/components/drive-wise/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Drive Wise — Brochure-grounded automotive AI" },
      { name: "description", content: "Choose a brand and model, then chat with an AI that answers only from the official brochure, with cited sources." },
    ],
  }),
  component: Landing,
});

function Landing() {
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

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <ParticleField />
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
              Metadata-Aware · Brochure Grounded · Source Attributed
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]">
              Drive <span className="gradient-text">Wise</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Helping users make informed car decisions through a
              <span className="text-foreground"> brochure-grounded AI assistant.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/app"
                className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition animate-glow-pulse"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a href="#how" className="rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-secondary/50 transition">
                See how it works
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "4", l: "Brands" },
                { n: "11", l: "Models" },
                { n: "100%", l: "Cited" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-3xl font-display font-bold gradient-text">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative animate-scale-in">
            <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden gradient-border animate-float-slow">
              <img
                src={heroCar}
                alt="Premium concept SUV under blue studio light"
                width={1600}
                height={1000}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-4 flex items-center gap-3 animate-float">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Grounded answers</div>
                <div className="text-xs text-muted-foreground">Every reply cites the brochure page</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
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
