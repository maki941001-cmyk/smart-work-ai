import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, BookOpen, ShieldCheck, Zap, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, plan your day and research any topic with AI built for focused workplace productivity.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, plan your day and research any topic with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a purpose, a recipient and a few bullet points into a polished email in your chosen tone.",
  },
  {
    to: "/planner" as const,
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Paste your real tasks and get an ordered daily or weekly schedule with suggested times.",
  },
  {
    to: "/research" as const,
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Summarise a topic or a public article link into insights, findings and next steps.",
  },
];

const FACTS = [
  { icon: Zap, title: "Generated live", body: "Every result is written from what you type — nothing is pre-written." },
  { icon: Lock, title: "Nothing is stored", body: "Your input and results stay in this session only." },
  { icon: ShieldCheck, title: "Always editable", body: "Edit, copy or regenerate any result before you use it." },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard" description="Your AI workspace for writing, planning and research.">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Welcome back</p>
          <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Get the busywork done in a few sentences.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Describe what you need in your own words. The assistant writes the email, builds the schedule or
            breaks down the research — always based on what you entered.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="size-4" /> Write an email
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <CalendarClock className="size-4" /> Plan my tasks
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="font-display mt-4 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-4 inline-block text-sm font-medium text-foreground group-hover:underline">
                Open →
              </span>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {FACTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/50 p-4">
              <Icon className="size-4 text-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
