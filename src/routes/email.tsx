import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, RefreshCw, Sparkles, Check } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content: "Generate a complete, personalised professional email from your purpose, recipient and key points.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Personalised professional emails written from your own notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");

  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setError(null);
    if (!purpose.trim() || !recipient.trim() || !keyPoints.trim()) {
      setError("Please fill in the purpose, the recipient and at least one key point.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { purpose, recipient, keyPoints, tone } });
      setDraft(result.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copying isn't available in this browser. Select the text and copy manually.");
    }
  }

  return (
    <AppShell title="Smart Email Generator" description="Describe the email — the assistant writes it for you.">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Panel title="Your input" subtitle="Everything below is written by you.">
          <div className="space-y-4">
            <Field label="Email purpose">
              <input
                className={inputClass}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Request a two-week deadline extension on the Q3 report"
              />
            </Field>
            <Field label="Recipient" hint="Name, role or relationship helps the tone land right.">
              <input
                className={inputClass}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Thabo Nkosi, my line manager"
              />
            </Field>
            <Field label="Key points" hint="One per line works best.">
              <textarea
                className={`${inputClass} min-h-40 resize-y`}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={"Data collection took longer than planned\nDraft is 70% complete\nPropose new date: 14 October"}
              />
            </Field>
            <Field label="Tone">
              <SegmentedControl options={TONES} value={tone} onChange={setTone} />
            </Field>
            {error && <ErrorNote message={error} />}
            <button className={btnPrimary} onClick={generate} disabled={loading}>
              <Sparkles className="size-4" />
              {loading ? "Generating…" : draft ? "Generate again" : "Generate email"}
            </button>
          </div>
        </Panel>

        <Panel
          tone="output"
          title="AI-generated email"
          subtitle="Edit freely before you send."
          actions={
            draft && !loading ? (
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
            <Loading label="Writing your email…" />
          ) : draft ? (
            <textarea
              className={`${inputClass} min-h-[28rem] resize-y bg-card font-mono text-[13px] leading-relaxed`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-12 text-center text-sm text-muted-foreground">
              Your generated email will appear here.
            </p>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
