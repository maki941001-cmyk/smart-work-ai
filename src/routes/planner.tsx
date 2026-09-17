import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { RefreshCw, Sparkles, Plus, X } from "lucide-react";
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
import { planTasks, type PlanItem } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content: "Paste your real tasks and get an ordered daily or weekly schedule with times and priorities.",
      },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "An ordered schedule built from the tasks you actually have." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const RANGES = ["Daily", "Weekly"] as const;
const PRIORITIES = ["High", "Medium", "Low"] as const;

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [notes, setNotes] = useState("");
  const [range, setRange] = useState<(typeof RANGES)[number]>("Daily");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("High");

  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    if (tasks.trim().length < 3) {
      setError("Add at least one task before generating a schedule.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { tasks, range, priority, notes: notes.trim() || undefined } });
      setPlan(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function update(index: number, patch: Partial<PlanItem>) {
    setPlan((current) => current?.map((item, i) => (i === index ? { ...item, ...patch } : item)) ?? current);
  }

  function remove(index: number) {
    setPlan((current) => current?.filter((_, i) => i !== index) ?? current);
  }

  function addRow() {
    setPlan((current) => [
      ...(current ?? []),
      { task: "", priority: "Medium", time: "", order: (current?.length ?? 0) + 1, reasoning: "" },
    ]);
  }

  return (
    <AppShell title="AI Task Planner" description="Your tasks, ordered into a workable schedule.">
      <div className="mx-auto max-w-6xl space-y-6">
        <Panel title="Your tasks" subtitle="Everything below is written by you.">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Field label="Tasks" hint="One task per line.">
              <textarea
                className={`${inputClass} min-h-44 resize-y`}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"Finish Q3 budget review\nCall supplier about delayed order\nPrepare slides for Friday's board update"}
              />
            </Field>
            <div className="space-y-4">
              <Field label="Schedule">
                <SegmentedControl options={RANGES} value={range} onChange={setRange} />
              </Field>
              <Field label="Priority focus">
                <SegmentedControl options={PRIORITIES} value={priority} onChange={setPriority} />
              </Field>
              <Field label="Constraints (optional)">
                <input
                  className={inputClass}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Meetings 10–12, finish by 16:00"
                />
              </Field>
            </div>
          </div>
          {error && <div className="mt-4">{<ErrorNote message={error} />}</div>}
          <button className={`${btnPrimary} mt-4`} onClick={generate} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Planning…" : plan ? "Plan again" : "Generate schedule"}
          </button>
        </Panel>

        <Panel
          tone="output"
          title="AI-generated schedule"
          subtitle="Every field is editable."
          actions={
            plan && !loading ? (
              <>
                <button className={btnGhost} onClick={addRow}>
                  <Plus className="size-3.5" /> Add task
                </button>
                <button className={btnGhost} onClick={generate}>
                  <RefreshCw className="size-3.5" /> Regenerate
                </button>
              </>
            ) : null
          }
        >
          {loading ? (
            <Loading label="Building your schedule…" />
          ) : plan && plan.length > 0 ? (
            <div className="space-y-3">
              {plan.map((item, index) => (
                <div key={index} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div className="grid flex-1 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                      <input
                        className={inputClass}
                        value={item.task}
                        onChange={(e) => update(index, { task: e.target.value })}
                        placeholder="Task"
                      />
                      <input
                        className={inputClass}
                        value={item.time}
                        onChange={(e) => update(index, { time: e.target.value })}
                        placeholder="Suggested time"
                      />
                      <select
                        className={inputClass}
                        value={PRIORITIES.includes(item.priority as never) ? item.priority : "Medium"}
                        onChange={(e) => update(index, { priority: e.target.value })}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {p} priority
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() => remove(index)}
                      aria-label="Remove task"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <textarea
                    className={`${inputClass} mt-3 min-h-16 resize-y text-xs`}
                    value={item.reasoning}
                    onChange={(e) => update(index, { reasoning: e.target.value })}
                    placeholder="Why this slot"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-12 text-center text-sm text-muted-foreground">
              Your generated schedule will appear here.
            </p>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
