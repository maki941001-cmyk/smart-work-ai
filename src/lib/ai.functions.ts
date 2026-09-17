import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAI, extractJson, fetchPageText } from "./ai.server";

const EmailInput = z.object({
  purpose: z.string().trim().min(3, "Describe the purpose of the email."),
  recipient: z.string().trim().min(2, "Tell us who the email is for."),
  keyPoints: z.string().trim().min(3, "Add at least one key point."),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callAI(
      "You are an expert business communication writer. Write complete, ready-to-send emails tailored precisely to the details provided. Never use placeholders like [Name] unless the user gave no name. Return only the email: a 'Subject: ...' line, then a blank line, then the body including a sign-off.",
      `Purpose: ${data.purpose}\nRecipient: ${data.recipient}\nKey points to cover:\n${data.keyPoints}\nTone: ${data.tone}`,
    );
    return { email: text };
  });

const PlannerInput = z.object({
  tasks: z.string().trim().min(3, "Enter at least one task."),
  range: z.enum(["Daily", "Weekly"]),
  priority: z.enum(["High", "Medium", "Low"]),
  notes: z.string().trim().max(500).optional(),
});

export type PlanItem = {
  task: string;
  priority: string;
  time: string;
  order: number;
  reasoning: string;
};

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await callAI(
      'You are a productivity planning expert. Analyse the user\'s actual tasks and build a realistic schedule. Return ONLY a JSON array, no prose, no markdown fences. Each element: {"task": string, "priority": "High"|"Medium"|"Low", "time": string (e.g. "09:00 - 10:30" for daily, or "Mon morning" for weekly), "order": number starting at 1, "reasoning": string (one short sentence, may be empty)}. Every task the user listed must appear. Split vague tasks only when clearly useful.',
      `Tasks:\n${data.tasks}\n\nSchedule type: ${data.range}\nOverall priority focus: ${data.priority}${data.notes ? `\nExtra context: ${data.notes}` : ""}`,
    );
    const parsed = extractJson(raw);
    const items = z
      .array(
        z.object({
          task: z.string(),
          priority: z.string(),
          time: z.string(),
          order: z.number(),
          reasoning: z.string().default(""),
        }),
      )
      .parse(parsed);
    return { items: items.sort((a, b) => a.order - b.order) };
  });

const ResearchInput = z.object({
  mode: z.enum(["topic", "url"]),
  value: z.string().trim().min(3, "Enter a topic or a link."),
});

export type ResearchResult = {
  title: string;
  summary: string;
  insights: string[];
  findings: string[];
  recommendations: string[];
  source: string;
};

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    let userPrompt: string;
    let source: string;

    if (data.mode === "url") {
      const pageText = await fetchPageText(data.value);
      source = data.value;
      userPrompt = `Analyse the following content taken from ${data.value}. Base every statement strictly on this content.\n\n---\n${pageText}\n---`;
    } else {
      source = "Topic entered by the user";
      userPrompt = `Research topic or question: ${data.value}`;
    }

    const raw = await callAI(
      'You are a rigorous research analyst. Respond ONLY with JSON, no markdown fences, shaped as {"title": string, "summary": string (2-4 paragraphs, use \\n\\n between paragraphs), "insights": string[], "findings": string[], "recommendations": string[]}. Every item must be specific to the supplied material or question — never generic filler. If the material is thin, say so honestly in the summary.',
      userPrompt,
    );
    const parsed = extractJson(raw);
    const result = z
      .object({
        title: z.string(),
        summary: z.string(),
        insights: z.array(z.string()).default([]),
        findings: z.array(z.string()).default([]),
        recommendations: z.array(z.string()).default([]),
      })
      .parse(parsed);
    return { ...result, source } satisfies ResearchResult;
  });
