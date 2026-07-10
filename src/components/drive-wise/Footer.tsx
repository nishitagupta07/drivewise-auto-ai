import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-display text-2xl font-bold">
            Drive <span className="gradient-text">Wise</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
            A brochure-grounded automotive AI assistant. Metadata-aware retrieval keeps answers narrow, factual, and always attributable to the source.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Technology</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>React · TanStack Start</li>
            <li>Python · FastAPI</li>
            <li>Vector Database · RAG</li>
            <li>Lovable AI Gateway</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/app" className="hover:text-foreground transition">Launch app</Link></li>
            <li><a href="#features" className="hover:text-foreground transition">Features</a></li>
            <li><a href="#how" className="hover:text-foreground transition">Pipeline</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Drive Wise. Every answer is sourced.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="inline-flex items-center gap-1.5 hover:text-foreground transition">
              <Github className="h-3.5 w-3.5" /> Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
