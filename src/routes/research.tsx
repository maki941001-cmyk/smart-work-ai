import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { RefreshCw, Sparkles, Copy, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  Panel,
  Loading,
  ErrorNote,
  Field,
  inputClass,
  btnPrimary,
  btnGhost,
  SegmentedControl,
} from "@/components/ai-ui";
import { runResearch, type ResearchResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content: "Summarise any topic or public article link into insights, findings and practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Insights, findings and recommendations from your topic or link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const MODES = ["Topic", "Link"] as const;

type Editable = {
  title: string;
  summary: string;
  insights: string;
  findings: string;
  recommendations: string;
  source: string;
};

function toEditable(result: ResearchResult): Editable {
  return {
    title: result.title,
    summary: result.summary,
    insights: result.insights.join("\n"),
    findings: result.findings.join("\n"),
    recommendations: result.recommendations.join("\n"),
    source: result.source,
  };
}

function asText(value: Editable) {
  return [
    value.title,
    "",
    value.summary,
    "",
    "Key insights:",
    value.insights,
    "",
    "Important findings:",
    value.findings,
    "",
    "Recommendations:",
    value.recommendations,
  ].join("\n");
}

function ResearchPage() {
  const run = useServerFn(runResearch);
  const [mode, setMode] = useState<(typeof MODES)[number]>("Topic");
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Editable | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setError(null);
    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setError(mode === "Link" ? "Paste a link to a public web page." : "Enter a topic or question to research.");
      return;
    }
    if (mode === "Link" && !/^https?:\/\/\S+\.\S+/i.test(trimmed)) {
      setError("That does not look like a valid link. It should start with http:// or https://");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { mode: mode === "Link" ? "url" : "topic", value: trimmed } });
      setResult(toEditable(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(asText(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copying isn't available in this browser. Select the text and copy manually.");
    }
  }

  function patch(part: Partial<Editable>) {
    setResult((current) => (current ? { ...current, ...part } : current));
  }

  return (
    <AppShell title="AI Research Assistant" description="Research a topic or break down an article you link to.">
      <div className="mx-auto max-w-5xl space-y-6">
        <Panel title="Your input" subtitle="Everything below is written by you.">
          <div className="space-y-4">
            <Field label="Source">
              <SegmentedControl
                options={MODES}
                value={mode}
                onChange={(next) => {
                  setMode(next);
                  setError(null);
                }}
              />
            </Field>
            <Field
              label={mode === "Link" ? "Article link" : "Topic or question"}
              hint={
                mode === "Link"
                  ? "Must be a publicly accessible page — pages behind a login can't be read."
                  : "Be as specific as you can for sharper results."
              }
            >
              {mode === "Link" ? (
                <input
                  className={inputClass}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://example.com/article"
                />
              ) : (
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="How are mid-sized South African retailers using AI for stock forecasting?"
                />
              )}
            </Field>
            {error && <ErrorNote message={error} />}
            <button className={btnPrimary} onClick={generate} disabled={loading}>
              <Sparkles className="size-4" />
              {loading ? "Researching…" : result ? "Research again" : "Run research"}
            </button>
          </div>
        </Panel>

        <Panel
          tone="output"
          title="AI-generated research"
          subtitle={result ? `Based on: ${result.source}` : "Edit anything before you use it."}
          actions={
            result && !loading ? (
              <>
                <button className={btnGhost} onClick={copy}>
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button className={btnGhost} onClick={generate}>
                  <RefreshCw className="size-3.5" /> Regenerate
                </button>
              </>
            ) : null
          }
        >
          {loading ? (
            <Loading label={mode === "Link" ? "Reading the page and analysing it…" : "Researching your topic…"} />
          ) : result ? (
            <div className="space-y-5">
              <Field label="Title">
                <input className={inputClass} value={result.title} onChange={(e) => patch({ title: e.target.value })} />
              </Field>
              <Field label="Summary">
                <textarea
                  className={`${inputClass} min-h-48 resize-y bg-card leading-relaxed`}
                  value={result.summary}
                  onChange={(e) => patch({ summary: e.target.value })}
                />
              </Field>
              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Key insights" hint="One per line.">
                  <textarea
                    className={`${inputClass} min-h-40 resize-y bg-card`}
                    value={result.insights}
                    onChange={(e) => patch({ insights: e.target.value })}
                  />
                </Field>
                <Field label="Important findings" hint="One per line.">
                  <textarea
                    className={`${inputClass} min-h-40 resize-y bg-card`}
                    value={result.findings}
                    onChange={(e) => patch({ findings: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Practical recommendations" hint="One per line.">
                <textarea
                  className={`${inputClass} min-h-40 resize-y bg-card`}
                  value={result.recommendations}
                  onChange={(e) => patch({ recommendations: e.target.value })}
                />
              </Field>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-12 text-center text-sm text-muted-foreground">
              Your research output will appear here.
            </p>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
