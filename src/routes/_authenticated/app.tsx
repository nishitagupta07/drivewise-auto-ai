import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BRANDS, getBrand, getModel, type Brand, type Model } from "@/lib/brochures";
import { askQuestion, listThreads, getThreadMessages, deleteThread, type SourceRef } from "@/lib/chat.functions";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, MessageCircle, X, Send, Loader2, Sparkles,
  Car, Shield, Gauge, Cpu, Palette, Camera, Cog, LogOut, ChevronRight,
  PanelLeftOpen, PanelLeftClose, Info, FileText, Wrench, Layers,
  Zap, Fuel, Users, Wind, Sun, Music, Smartphone, ChevronDown, Trash2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Drive Wise — Explore" }, { name: "robots", content: "noindex" }] }),
  component: AppPage,
});

type Step = "brand" | "model" | "brochure";

function AppPage() {
  const [step, setStep] = useState<Step>("brand");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const brand: Brand | null = brandId ? (getBrand(brandId) ?? null) : null;
  const model: Model | null = brand && modelId ? (getModel(brand.id, modelId) ?? null) : null;

  return (
    <div className="min-h-screen relative">
      <AppHeader
        onOpenHistory={() => setSidebarOpen(true)}
      />

      <HistorySidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeThreadId={activeThreadId}
        onSelect={(t) => {
          setBrandId(BRANDS.find((b) => b.name === t.brand)?.id ?? null);
          const b = BRANDS.find((b) => b.name === t.brand);
          const m = b?.models.find((m) => m.name === t.model);
          setModelId(m?.id ?? null);
          setActiveThreadId(t.id);
          setStep(m ? "brochure" : "brand");
          setChatOpen(true);
          setSidebarOpen(false);
        }}
      />

      <main className="pt-20 pb-24">
        {step === "brand" && (
          <BrandStep
            onPick={(b) => { setBrandId(b.id); setStep("model"); setModelId(null); setActiveThreadId(null); }}
          />
        )}
        {step === "model" && brand && (
          <ModelStep
            brand={brand}
            onBack={() => { setStep("brand"); setBrandId(null); }}
            onPick={(m) => { setModelId(m.id); setStep("brochure"); setActiveThreadId(null); }}
          />
        )}
        {step === "brochure" && brand && model && (
          <BrochureView
            brand={brand}
            model={model}
            onBack={() => setStep("model")}
            onOpenChat={() => setChatOpen(true)}
          />
        )}
      </main>

      {/* Floating chat button — always available */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition animate-glow-pulse"
          aria-label="Open assistant"
        >
          <MessageCircle className="h-4 w-4" />
          {brand && model ? `Ask about ${model.name}` : "Ask Drive Wise"}
        </button>
      )}

      {chatOpen && (
        <ChatDock
          brand={brand}
          model={model}
          threadId={activeThreadId}
          onThreadId={setActiveThreadId}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

/* -------------------- Header -------------------- */

function AppHeader({ onOpenHistory }: { onOpenHistory: () => void }) {
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }
  return (
    <header className="fixed top-0 inset-x-0 z-30 glass border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onOpenHistory} className="rounded-lg p-2 hover:bg-secondary/60 transition" aria-label="Open history">
            <PanelLeftOpen className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <span className="font-display font-semibold truncate">Drive Wise</span>
          </div>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

/* -------------------- History sidebar -------------------- */

function HistorySidebar({
  open, onClose, activeThreadId, onSelect,
}: {
  open: boolean;
  onClose: () => void;
  activeThreadId: string | null;
  onSelect: (t: { id: string; brand: string; model: string; title: string; updated_at: string }) => void;
}) {
  const list = useServerFn(listThreads);
  const del = useServerFn(deleteThread);
  const qc = useQueryClient();
  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["threads"], queryFn: () => list(), enabled: open,
  });

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <aside className={`fixed left-0 top-0 z-50 h-full w-[85vw] max-w-sm glass-strong border-r border-border/60 transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary" /> Query History</div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary/60"><PanelLeftClose className="h-4 w-4" /></button>
        </div>
        <div className="p-2 overflow-y-auto h-[calc(100%-56px)]">
          {isLoading && <div className="p-6 text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && threads.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No conversations yet. Start chatting about a model.</div>
          )}
          {threads.map((t) => (
            <div key={t.id} className={`group rounded-xl p-3 mb-1 cursor-pointer transition ${activeThreadId === t.id ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/50"}`}>
              <div className="flex items-start gap-2" onClick={() => onSelect(t)}>
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 shrink-0">
                  <Car className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground truncate">{t.brand} · {t.model}</div>
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(t.updated_at).toLocaleString()}</div>
                </div>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await del({ data: { threadId: t.id } });
                    qc.invalidateQueries({ queryKey: ["threads"] });
                    toast.success("Conversation deleted");
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

/* -------------------- Brand step -------------------- */

function BrandStep({ onPick }: { onPick: (b: Brand) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-14 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
          Step 1 of 3
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Choose your <span className="gradient-text">brand</span></h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Every brochure is scoped by metadata so answers stay narrow and precise.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BRANDS.map((b, i) => (
          <button
            key={b.id}
            onClick={() => onPick(b)}
            className="group relative text-left glass rounded-2xl p-6 h-52 hover-lift gradient-border animate-scale-in overflow-hidden"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl transition-all duration-500 group-hover:opacity-60"
              style={{ backgroundColor: b.accent }} />
            <div className="relative flex flex-col justify-between h-full">
              <div className="grid h-14 w-14 place-items-center rounded-xl glass border border-border/60 group-hover:animate-glow-pulse">
                <span className="font-display font-bold text-lg gradient-text">{b.name[0]}</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{b.tagline}</div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-xl font-display font-semibold">{b.name}</div>
                  <ChevronRight className="h-5 w-5 text-primary transition group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Model step -------------------- */

function ModelStep({ brand, onBack, onPick }: { brand: Brand; onBack: () => void; onPick: (m: Model) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Change brand
      </button>
      <div className="mb-10 animate-fade-up">
        <div className="text-sm text-primary uppercase tracking-widest">{brand.name} · Step 2 of 3</div>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mt-2">
          Pick a <span className="gradient-text">model</span>
        </h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {brand.models.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onPick(m)}
            className="group text-left glass rounded-2xl overflow-hidden hover-lift gradient-border animate-scale-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="relative h-44 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${m.colors[0].hex}22, ${brand.accent}44)` }}>
              <div className="absolute inset-0 grid place-items-center">
                <Car className="h-24 w-24 text-primary/70 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.25} />
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] uppercase tracking-widest glass px-2 py-1 rounded-md text-muted-foreground">
                {m.specs.fuel}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="font-display text-xl font-semibold">{m.name}</div>
                <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{m.tagline}</div>
              <div className="mt-4 flex gap-2 text-[10px] text-muted-foreground">
                <span className="rounded-md bg-secondary/60 px-2 py-1">{m.specs.power}</span>
                <span className="rounded-md bg-secondary/60 px-2 py-1">{m.specs.mileage}</span>
                <span className="rounded-md bg-secondary/60 px-2 py-1">{m.specs.seating} seats</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Brochure view -------------------- */

function BrochureView({ brand, model, onBack, onOpenChat }: {
  brand: Brand; model: Model; onBack: () => void; onOpenChat: () => void;
}) {
  const [color, setColor] = useState(model.colors[0]);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const galleryLabels = ["Front", "Rear", "Side", "Alloy wheels"];
  const interiorHotspots = ["Dashboard", "Steering", "Seats", "Infotainment", "Sunroof", "Ambient lighting"];
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      {/* Back + title */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to models
      </button>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden glass-strong gradient-border p-8 md:p-14 mb-14 animate-fade-up">
        <div className="absolute inset-0 -z-0 opacity-40 transition-colors duration-700"
          style={{ background: `radial-gradient(ellipse at center, ${color.hex}55, transparent 70%)` }} />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary">{brand.name}</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mt-2">{model.name}</h1>
            <p className="mt-3 text-muted-foreground text-lg">{model.tagline}</p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              {[
                { l: "Power", v: model.specs.power, i: Zap },
                { l: "Torque", v: model.specs.torque, i: Cog },
                { l: "Mileage", v: model.specs.mileage, i: Fuel },
              ].map((s) => (
                <div key={s.l} className="rounded-xl glass p-3">
                  <s.i className="h-4 w-4 text-primary mb-1" />
                  <div className="text-[10px] uppercase text-muted-foreground">{s.l}</div>
                  <div className="text-sm font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-64 md:h-80 grid place-items-center">
            <div className="absolute h-52 w-52 rounded-full blur-3xl opacity-70 animate-glow-pulse"
              style={{ backgroundColor: color.hex + "66" }} />
            <div className="relative animate-float">
              <Car className="h-56 w-56 md:h-72 md:w-72 transition-colors duration-700"
                style={{ color: color.hex }} strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Color selector */}
      <SectionHeader icon={Palette} title="Colors" caption="Tap a shade to preview" />
      <div className="flex flex-wrap gap-3 mb-16">
        {model.colors.map((c) => (
          <button
            key={c.name}
            onClick={() => setColor(c)}
            className={`group rounded-2xl px-3 py-2 flex items-center gap-3 glass transition ${color.name === c.name ? "ring-2 ring-primary" : "hover:bg-secondary/50"}`}
          >
            <span className="h-6 w-6 rounded-full ring-1 ring-border" style={{ backgroundColor: c.hex }} />
            <span className="text-sm">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Engine */}
      <SectionHeader icon={Cog} title="Engine" caption="Under the hood" />
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="glass rounded-2xl p-8 flex items-center justify-center h-72 gradient-border">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl bg-primary/40" />
            <Cog className="h-40 w-40 text-primary animate-spin relative" style={{ animationDuration: "12s" }} strokeWidth={1} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: "Power", v: model.specs.power },
            { l: "Torque", v: model.specs.torque },
            { l: "Fuel", v: model.specs.fuel },
            { l: "Transmission", v: model.specs.transmission },
          ].map((s, i) => (
            <div key={s.l} className="glass rounded-2xl p-5 hover-lift animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="text-xs text-muted-foreground uppercase">{s.l}</div>
              <div className="mt-1 font-display text-2xl font-bold gradient-text">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exterior gallery */}
      <SectionHeader icon={Camera} title="Exterior" caption="Angles that define character" />
      <div className="glass rounded-3xl p-6 md:p-10 mb-16 gradient-border">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="relative h-72 grid place-items-center rounded-2xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${color.hex}22, ${brand.accent}44)` }}>
            <Car className="h-52 w-52 transition-transform duration-700" style={{ color: color.hex, transform: `scale(${1 + galleryIdx * 0.05}) rotate(${galleryIdx * -6}deg)` }} strokeWidth={1} />
            <div className="absolute top-3 left-3 text-xs glass px-2 py-1 rounded-md">{galleryLabels[galleryIdx]}</div>
          </div>
          <div className="flex md:flex-col gap-2">
            {galleryLabels.map((g, i) => (
              <button key={g} onClick={() => setGalleryIdx(i)}
                className={`text-xs rounded-lg px-3 py-2 transition ${galleryIdx === i ? "bg-primary text-primary-foreground" : "glass hover:bg-secondary/60"}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interior */}
      <SectionHeader icon={Sun} title="Interior" caption="Tap a hotspot to explore" />
      <div className="glass rounded-3xl p-6 md:p-10 mb-16 gradient-border">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative rounded-2xl h-72 md:h-80 grid place-items-center" style={{ background: "radial-gradient(ellipse at center, oklch(0.28 0.05 240 / 0.6), transparent 70%)" }}>
            {interiorHotspots.map((h, i) => {
              const angle = (i / interiorHotspots.length) * Math.PI * 2;
              const r = 120;
              const x = 50 + (Math.cos(angle) * r) / 4;
              const y = 50 + (Math.sin(angle) * r) / 4;
              return (
                <button key={h}
                  onClick={() => setActiveHotspot(h)}
                  className={`absolute h-4 w-4 rounded-full ring-4 ring-primary/30 transition ${activeHotspot === h ? "bg-primary scale-125" : "bg-primary/70 hover:scale-110"} animate-glow-pulse`}
                  style={{ left: `${x}%`, top: `${y}%` }} aria-label={h} />
              );
            })}
            <Car className="h-40 w-40 text-primary/40" strokeWidth={1} />
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            {interiorHotspots.map((h) => (
              <button key={h} onClick={() => setActiveHotspot(h)}
                className={`glass rounded-xl p-4 text-left hover-lift ${activeHotspot === h ? "ring-1 ring-primary" : ""}`}>
                <div className="text-xs text-muted-foreground">Interior</div>
                <div className="font-semibold text-sm mt-0.5">{h}</div>
              </button>
            ))}
            {activeHotspot && (
              <div className="col-span-2 glass-strong rounded-xl p-4 animate-fade-up">
                <div className="text-xs text-primary uppercase tracking-widest">{activeHotspot}</div>
                <div className="text-sm mt-1 text-muted-foreground">
                  {model.interior.find((i) => i.toLowerCase().includes(activeHotspot.toLowerCase().split(" ")[0])) || "Premium finish with attention to detail across the cabin."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety */}
      <SectionHeader icon={Shield} title="Safety" caption="Engineered to protect" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
        {model.safety.map((s, i) => (
          <div key={s} className="glass rounded-2xl p-4 text-center hover-lift animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="grid h-10 w-10 mx-auto place-items-center rounded-xl bg-primary/15">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2 text-xs font-medium">{s}</div>
          </div>
        ))}
      </div>

      {/* Performance */}
      <SectionHeader icon={Gauge} title="Performance" caption="Numbers that move you" />
      <div className="grid md:grid-cols-4 gap-3 mb-16">
        {[
          { l: "Power", v: model.specs.power, pct: 82 },
          { l: "Torque", v: model.specs.torque, pct: 74 },
          { l: "Mileage", v: model.specs.mileage, pct: 68 },
          { l: "Seating", v: model.specs.seating, pct: 90 },
        ].map((s, i) => (
          <div key={s.l} className="glass rounded-2xl p-5 gradient-border animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="text-xs text-muted-foreground uppercase">{s.l}</div>
            <div className="mt-1 font-display text-2xl font-bold">{s.v}</div>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-700"
                style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Technology */}
      <SectionHeader icon={Cpu} title="Technology" caption="Connected. Intuitive. Always on." />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-16">
        {model.tech.map((t, i) => {
          const I = /android|apple|smartphone|touch/i.test(t) ? Smartphone : /sound|bose|jbl|sony/i.test(t) ? Music : /voice/i.test(t) ? MessageCircle : /wireless/i.test(t) ? Wind : Cpu;
          return (
            <div key={t} className="glass rounded-2xl p-4 flex items-center gap-3 hover-lift animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 shrink-0">
                <I className="h-5 w-5 text-primary" />
              </div>
              <div className="text-sm font-medium">{t}</div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="glass-strong rounded-3xl p-8 md:p-10 gradient-border mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs text-primary uppercase tracking-widest">Ready to decide?</div>
          <h3 className="mt-1 font-display text-2xl md:text-3xl font-bold">Ask anything about the {model.name}.</h3>
          <p className="mt-1 text-sm text-muted-foreground">Every answer is grounded in the official brochure and cites its source.</p>
        </div>
        <button onClick={onOpenChat} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition">
          <MessageCircle className="h-4 w-4" /> Open assistant
        </button>
      </div>
    </section>
  );
}

function SectionHeader({ icon: Icon, title, caption }: { icon: React.ComponentType<{ className?: string }>; title: string; caption: string }) {
  return (
    <div className="flex items-end justify-between mb-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl glass border border-border/60">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest">{caption}</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Chat dock -------------------- */

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  metadata?: Record<string, unknown>;
  createdAt: string;
};

const PIPELINE_STEPS = [
  "Filtering brochure metadata…",
  "Searching vector database…",
  "Re-ranking brochure sections…",
  "Generating response…",
  "Finalizing answer…",
];

function ChatDock({ brand, model, threadId, onThreadId, onClose }: {
  brand: Brand | null; model: Model | null; threadId: string | null; onThreadId: (id: string | null) => void; onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showPipeline, setShowPipeline] = useState(true);
  const ask = useServerFn(askQuestion);
  const getMsgs = useServerFn(getThreadMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load thread messages when threadId changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!threadId) { setMessages([]); return; }
      try {
        const rows = await getMsgs({ data: { threadId } });
        if (cancelled) return;
        setMessages(rows.map((r) => ({
          id: r.id, role: r.role as "user" | "assistant", content: r.content,
          sources: (r.sources as SourceRef[] | null) ?? undefined,
          metadata: (r.metadata as Record<string, unknown> | null) ?? undefined,
          createdAt: r.created_at,
        })));
      } catch (e) { console.error(e); }
    }
    load();
    return () => { cancelled = true; };
  }, [threadId, getMsgs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loadingStep]);

  useEffect(() => { inputRef.current?.focus(); }, [threadId]);

  const mut = useMutation({
    mutationFn: async (q: string) => {
      if (!brand || !model) {
        // Local guard response — no server call until brand/model selected
        await new Promise((r) => setTimeout(r, 200));
        return {
          threadId: null as string | null,
          answer: "Please select a car brand and model first so I can answer using the correct brochure.",
          sources: [] as SourceRef[],
          metadata: undefined as Record<string, unknown> | undefined,
          _local: true as const,
        };
      }
      // Animate pipeline steps
      for (let i = 0; i < PIPELINE_STEPS.length - 1; i++) {
        setLoadingStep(i);
        await new Promise((r) => setTimeout(r, 380));
      }
      setLoadingStep(PIPELINE_STEPS.length - 1);
      const res = await ask({
        data: {
          threadId,
          brand: brand.name, brandId: brand.id,
          model: model.name, modelId: model.id,
          question: q,
        },
      });
      return { ...res, _local: false as const };
    },
    onSuccess: (res) => {
      if (!res._local && res.threadId && !threadId) onThreadId(res.threadId);
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant", content: res.answer,
        sources: res.sources, metadata: res.metadata, createdAt: new Date().toISOString(),
      }]);
      setLoadingStep(-1);
      if (!res._local) qc.invalidateQueries({ queryKey: ["threads"] });
      inputRef.current?.focus();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to get answer");
      setLoadingStep(-1);
    },
  });

  function send() {
    const q = input.trim();
    if (!q || mut.isPending) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: q, createdAt: new Date().toISOString() }]);
    setInput("");
    mut.mutate(q);
  }

  const suggestions = useMemo(() => model ? [
    "Does this car have ADAS?",
    `What is the mileage of the ${model.name}?`,
    "How many airbags are there?",
    "Does it support Android Auto?",
    "What engine does it use?",
  ] : [
    "What can you help me with?",
    "How does Drive Wise work?",
    "Which brands are supported?",
  ], [model]);

  const lastMetadata = [...messages].reverse().find((m) => m.role === "assistant" && m.metadata)?.metadata;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-2 md:p-4 pointer-events-none">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <aside className="relative pointer-events-auto w-full md:w-[520px] lg:w-[600px] h-full glass-strong rounded-2xl border border-border/60 flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 shrink-0 animate-glow-pulse">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground uppercase tracking-widest">{brand?.name ?? "Drive Wise"}</div>
              <div className="font-display font-semibold truncate">{model ? `${model.name} · Assistant` : "AI Assistant"}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary/60" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Pipeline */}
        <div className="px-4 py-2 border-b border-border/60 shrink-0">
          <button onClick={() => setShowPipeline((s) => !s)} className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition">
            <span className="inline-flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Retrieval pipeline</span>
            <ChevronDown className={`h-3.5 w-3.5 transition ${showPipeline ? "rotate-180" : ""}`} />
          </button>
          {showPipeline && (
            <div className="mt-2 flex items-center gap-1 overflow-x-auto scrollbar-hidden pb-1">
              {["Question", "Metadata", "Vector", "Rerank", "Context", "LLM", "Answer"].map((s, i, a) => (
                <div key={s} className="flex items-center gap-1 shrink-0">
                  <div className={`text-[10px] px-2 py-1 rounded-full border transition ${loadingStep >= 0 && loadingStep >= Math.floor((i / a.length) * PIPELINE_STEPS.length) ? "border-primary text-primary bg-primary/10 animate-glow-pulse" : "border-border/60 text-muted-foreground"}`}>
                    {s}
                  </div>
                  {i < a.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="animate-fade-up">
              <div className="text-sm text-muted-foreground mb-3">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    className="text-xs rounded-full glass px-3 py-1.5 hover:bg-secondary/60 transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`animate-fade-up ${m.role === "user" ? "flex justify-end" : ""}`}>
              {m.role === "user" ? (
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm">
                  {m.content}
                  <div className="text-[10px] mt-1 opacity-70">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              ) : (
                <div className="max-w-[95%]">
                  <div className="text-sm leading-relaxed prose prose-invert prose-p:my-2 prose-strong:text-foreground max-w-none">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sources</div>
                      {m.sources.map((s) => (
                        <div key={s.chunkId} className="rounded-xl glass p-3 flex items-start gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 shrink-0">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="min-w-0 text-xs">
                            <div className="font-medium truncate">Brochure: {s.brand} {s.model}</div>
                            <div className="text-muted-foreground">Section: {s.section} · Page {s.page}</div>
                            <div className="text-muted-foreground/70 font-mono text-[10px] truncate">{s.chunkId}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loadingStep >= 0 && (
            <div className="glass rounded-2xl p-4 animate-fade-up">
              <div className="flex items-center gap-2 text-xs text-primary mb-3">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Working…
              </div>
              <div className="space-y-2">
                {PIPELINE_STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-2 text-xs transition ${i <= loadingStep ? "text-foreground" : "text-muted-foreground/50"}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${i < loadingStep ? "bg-primary" : i === loadingStep ? "bg-primary animate-glow-pulse" : "bg-border"}`} />
                    <span>{s}</span>
                    {i === loadingStep && (
                      <span className="ml-auto flex gap-0.5">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-1 w-1 rounded-full bg-primary" style={{ animation: `typing 1s ${d * 0.15}s infinite` }} />
                        ))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata panel */}
        <div className="border-t border-border/60 px-4 py-2 shrink-0">
          <button onClick={() => setShowMetadata((s) => !s)} className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition">
            <span className="inline-flex items-center gap-1.5"><Info className="h-3.5 w-3.5" /> Retrieval metadata (developer)</span>
            <ChevronDown className={`h-3.5 w-3.5 transition ${showMetadata ? "rotate-180" : ""}`} />
          </button>
          {showMetadata && (
            <div className="mt-2 text-[11px] grid grid-cols-2 gap-2">
              <MetaRow k="Brand" v={brand?.name ?? "—"} />
              <MetaRow k="Model" v={model?.name ?? "—"} />
              <MetaRow k="Version" v="2025" />
              <MetaRow k="Retrieved chunks" v={String((lastMetadata as { retrievedChunks?: number } | undefined)?.retrievedChunks ?? "—")} />
              <MetaRow k="Sections" v={(lastMetadata as { sections?: string[] } | undefined)?.sections?.join(", ") ?? "—"} full />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/60 shrink-0">
          <div className="glass rounded-2xl p-2 flex items-end gap-2 gradient-border">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              rows={1}
              placeholder={model ? `Ask about the ${model.name}…` : "Ask anything — select a brand & model for brochure-grounded answers…"}
              className="flex-1 bg-transparent outline-none resize-none text-sm px-2 py-2 max-h-32"
            />
            <button onClick={send} disabled={mut.isPending || !input.trim()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:scale-105 transition">
              {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MetaRow({ k, v, full }: { k: string; v: string; full?: boolean }) {
  return (
    <div className={`rounded-lg bg-secondary/40 px-2 py-1.5 ${full ? "col-span-2" : ""}`}>
      <div className="text-muted-foreground uppercase tracking-widest text-[9px]">{k}</div>
      <div className="truncate font-medium">{v}</div>
    </div>
  );
}
