import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AppShell, AI_DISCLAIMER } from "@/components/AppShell";
import { Panel, Field, inputClass, btnGhost, SegmentedControl } from "@/components/ai-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Workplace AI" },
      {
        name: "description",
        content: "Set your default writing tone and schedule style, and review how your data is handled.",
      },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Session preferences and data handling for Workplace AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
const RANGES = ["Daily", "Weekly"] as const;

function SettingsPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [range, setRange] = useState<(typeof RANGES)[number]>("Daily");

  return (
    <AppShell title="Settings" description="Session preferences — nothing here is saved after you close the tab.">
      <div className="mx-auto grid max-w-4xl gap-6">
        <Panel title="Profile" subtitle="Used only to shape the tone of what the assistant writes.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name">
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Florence Mosolodi" />
            </Field>
            <Field label="Your role">
              <input className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Operations Manager" />
            </Field>
          </div>
        </Panel>

        <Panel title="Defaults">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Preferred email tone">
              <SegmentedControl options={TONES} value={tone} onChange={setTone} />
            </Field>
            <Field label="Preferred schedule">
              <SegmentedControl options={RANGES} value={range} onChange={setRange} />
            </Field>
          </div>
        </Panel>

        <Panel title="Data & privacy">
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>• There is no account, database or history — nothing you type is saved.</li>
            <li>• Your input is sent to the AI only to produce the result you asked for.</li>
            <li>• Closing or refreshing the tab clears everything.</li>
          </ul>
          <button
            className={`${btnGhost} mt-4`}
            onClick={() => {
              setName("");
              setRole("");
              window.location.reload();
            }}
          >
            <Trash2 className="size-3.5" /> Clear this session
          </button>
        </Panel>

        <Panel title="Responsible AI">
          <p className="text-sm leading-relaxed text-muted-foreground">{AI_DISCLAIMER}</p>
        </Panel>
      </div>
    </AppShell>
  );
}
