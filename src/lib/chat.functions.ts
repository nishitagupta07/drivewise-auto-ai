import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText } from "ai";
import { getModel, retrieveChunks, type BrochureChunk } from "./brochures";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const AskInput = z.object({
  threadId: z.string().uuid().nullable(),
  brand: z.string().nullable(),
  brandId: z.string().nullable(),
  model: z.string().nullable(),
  modelId: z.string().nullable(),
  question: z.string().min(1).max(1000),
});

export type SourceRef = {
  brand: string;
  model: string;
  section: string;
  page: number;
  chunkId: string;
};

export const askQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Ensure thread exists
    let threadId = data.threadId;
    if (!threadId) {
      const { data: t, error } = await supabase
        .from("chat_threads")
        .insert({
          user_id: userId,
          brand: data.brand,
          model: data.model,
          title: data.question.slice(0, 80),
        })
        .select("id")
        .single();
      if (error || !t) throw new Error("Failed to create thread");
      threadId = t.id;
    } else {
      await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
    }

    // Persist user message
    await supabase.from("chat_messages").insert({
      thread_id: threadId,
      user_id: userId,
      role: "user",
      content: data.question,
    });

    // --- RAG pipeline ---
    const model = getModel(data.brandId, data.modelId);
    if (!model) throw new Error("Unknown model");
    const chunks: BrochureChunk[] = retrieveChunks(data.brandId, data.modelId, data.question, 4);

    const contextText = chunks
      .map((c, i) => `[${i + 1}] Section: ${c.section} · Page ${c.page}\n${c.text}`)
      .join("\n\n");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const system = `You are Drive Wise, an automotive assistant grounded strictly on the official ${data.brand} ${data.model} brochure excerpts provided.
Answer concisely (max 5 sentences). If information is not present in the excerpts, say you couldn't find it in the brochure.
Never invent specs. Do not add citations inline — a separate source panel is rendered.`;

    const prompt = `Brochure excerpts for ${data.brand} ${data.model}:\n\n${contextText}\n\nUser question: ${data.question}`;

    let answer = "";
    try {
      const { text } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system,
        prompt,
      });
      answer = text.trim();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/402/.test(msg)) {
        answer = "AI credits are exhausted for this workspace. Please add credits to continue.";
      } else if (/429/.test(msg)) {
        answer = "Rate limit hit — please try again in a moment.";
      } else {
        console.error("[ai] generateText failed", err);
        answer = "I couldn't generate a response right now. Please try again.";
      }
    }

    const sources: SourceRef[] = chunks.map((c) => ({
      brand: data.brand,
      model: data.model,
      section: c.section,
      page: c.page,
      chunkId: c.id,
    }));

    const metadata = {
      brand: data.brand,
      model: data.model,
      brandId: data.brandId,
      modelId: data.modelId,
      version: "2025",
      retrievedChunks: chunks.length,
      sections: [...new Set(chunks.map((c) => c.section))],
    };

    await supabase.from("chat_messages").insert({
      thread_id: threadId,
      user_id: userId,
      role: "assistant",
      content: answer,
      sources: sources,
      metadata: metadata,
    });

    return { threadId, answer, sources, metadata };
  });

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, brand, model, title, created_at, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  });

export const getThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ threadId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: msgs, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, content, sources, metadata, created_at")
      .eq("thread_id", data.threadId)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return msgs ?? [];
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ threadId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await context.supabase.from("chat_threads").delete().eq("id", data.threadId).eq("user_id", context.userId);
    return { ok: true };
  });
