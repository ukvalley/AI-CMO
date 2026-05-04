'use client';

/**
 * SOP AI Studio
 *
 * UI shell for AI-powered SOP tools. v1 stubs the AI calls with mocked
 * responses; wire to real `/api/ai/...` endpoints when the backend dev
 * adds them.
 */

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Wand2,
  PenLine,
  ListChecks,
  Lightbulb,
  FileText,
  Loader2,
  Save,
  Copy,
  RefreshCw,
  ClipboardPaste,
  Languages,
  Brain,
  Volume2,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { SopSubNav } from '@/components/sop/SopSubNav';
import { useDataStore } from '@/stores';
import type { SOP, SOPContent } from '@/types/entities';
import {
  SOP_CATEGORIES,
  buildDefaultHeader,
  buildDefaultSections,
  slugify,
} from '@/lib/sopConstants';

interface AiTool {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  desc: string;
  badge?: string;
  actionLabel: string;
}

const AI_TOOLS: AiTool[] = [
  {
    id: 'generate-sop',
    icon: Wand2,
    name: 'SOP Generator',
    desc: 'Generate a complete structured SOP from a short topic or description.',
    badge: 'Most popular',
    actionLabel: 'Generate',
  },
  {
    id: 'rewrite',
    icon: PenLine,
    name: 'Content Rewriter',
    desc: 'Improve clarity, tone and structure of an existing SOP section.',
    actionLabel: 'Rewrite',
  },
  {
    id: 'summarise',
    icon: FileText,
    name: 'Summariser',
    desc: 'Create an executive summary or quick-reference for an SOP.',
    actionLabel: 'Summarise',
  },
  {
    id: 'improve',
    icon: Lightbulb,
    name: 'Improvement Suggester',
    desc: 'Get AI recommendations to make an existing SOP more effective.',
    actionLabel: 'Analyse',
  },
  {
    id: 'checklist',
    icon: ListChecks,
    name: 'Checklist Creator',
    desc: 'Convert SOP procedures into an actionable checklist.',
    actionLabel: 'Generate',
  },
  {
    id: 'paste-to-sop',
    icon: ClipboardPaste,
    name: 'Paste-to-SOP',
    desc: 'Paste any document (Notion, Google Doc, plain text) — AI structures it into a 20-section SOP.',
    badge: 'New',
    actionLabel: 'Structure',
  },
  {
    id: 'translate',
    icon: Languages,
    name: 'Translate SOP',
    desc: 'Translate the SOP content to another language for international teams.',
    actionLabel: 'Translate',
  },
  {
    id: 'quiz',
    icon: Brain,
    name: 'Quiz Generator',
    desc: 'Create a 5-question quiz from the SOP to test team understanding.',
    actionLabel: 'Generate',
  },
];

const LANGUAGES = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const TONES = ['Formal', 'Simple', 'Concise', 'Detailed'];

export default function AiStudioRoute() {
  return (
    <Suspense fallback={null}>
      <AiStudioInner />
    </Suspense>
  );
}

function AiStudioInner() {
  const searchParams = useSearchParams();
  const presetTool = searchParams?.get('tool') || null;
  const sopId = searchParams?.get('sopId') || null;

  const [activeTool, setActiveTool] = useState<string | null>(presetTool);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-white">AI Studio</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Generate, rewrite, summarise and improve your SOPs with AI.
          </p>
        </div>

        <SopSubNav active="ai" />

        {!activeTool ? (
          <ToolGrid onSelect={setActiveTool} />
        ) : (
          <ActivePanel toolId={activeTool} sopId={sopId} onBack={() => setActiveTool(null)} />
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================
// TOOL GRID
// ============================================

function ToolGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {AI_TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            className="group relative flex h-full flex-col items-start rounded-xl border border-slate-700 bg-slate-800/50 p-5 text-left transition-colors hover:border-primary-500/60"
          >
            {tool.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-primary-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary-300">
                {tool.badge}
              </span>
            )}
            <div className="mb-3 rounded-lg bg-primary-500/15 p-2.5 text-primary-300">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{tool.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{tool.desc}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-300 group-hover:underline">
              {tool.actionLabel}
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// ACTIVE PANEL — per-tool form + result
// ============================================

function ActivePanel({
  toolId,
  sopId,
  onBack,
}: {
  toolId: string;
  sopId: string | null;
  onBack: () => void;
}) {
  const router = useRouter();
  const { addItem, updateItem, getItems } = useDataStore();
  const tool = AI_TOOLS.find((t) => t.id === toolId);

  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<string>('Operations');
  const [department, setDepartment] = useState('');
  const [tone, setTone] = useState('Simple');
  const [sourceText, setSourceText] = useState('');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState('es');

  // Hydrate sourceText from sopId if provided
  React.useEffect(() => {
    if (!sopId) return;
    const sops = (getItems('sops') as SOP[]) || [];
    const sop = sops.find((s) => s.id === sopId);
    if (!sop) return;
    setTopic(sop.title || sop.name || '');
    if (sop.category) setCategory(sop.category);
    if (sop.department) setDepartment(sop.department);
    const sections = sop.content?.sections || {};
    const text = Object.entries(sections)
      .map(([k, v]) => (typeof v === 'string' ? `# ${k}\n${v}` : ''))
      .filter(Boolean)
      .join('\n\n');
    setSourceText(text);
  }, [sopId, getItems]);

  if (!tool) return null;

  const isGenerator = tool.id === 'generate-sop';

  const handleRun = async () => {
    setGenerating(true);
    setOutput('');
    try {
      // Simulated AI call. Replace with the real /api/ai/<tool> call:
      //   const res = await aiApi.generate({ tool: tool.id, topic, sourceText, tone, category });
      //   setOutput(res.data.output);
      await new Promise((r) => setTimeout(r, 1100));

      if (isGenerator) {
        setOutput(buildMockSopMarkdown(topic, category, department, tone));
      } else if (tool.id === 'checklist') {
        setOutput(buildMockChecklist(sourceText || topic));
      } else if (tool.id === 'summarise') {
        setOutput(buildMockSummary(sourceText || topic));
      } else if (tool.id === 'improve') {
        setOutput(buildMockImprovements(sourceText || topic));
      } else if (tool.id === 'paste-to-sop') {
        setOutput(buildMockPasteToSop(sourceText));
      } else if (tool.id === 'translate') {
        setOutput(buildMockTranslate(sourceText || topic, language));
      } else if (tool.id === 'quiz') {
        setOutput(buildMockQuiz(sourceText || topic));
      } else {
        setOutput(buildMockRewrite(sourceText, tone));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAsSop = () => {
    if (!output.trim()) return;
    const title = topic || `AI-generated SOP — ${new Date().toLocaleDateString()}`;
    const content: SOPContent = {
      header: buildDefaultHeader(department),
      sections: {
        ...(buildDefaultSections() as Record<string, never>),
        purpose: output as never,
      },
    };
    const id = addItem('sops', {
      title,
      slug: slugify(title),
      category: (category as never) || undefined,
      department: (department as never) || undefined,
      status: 'draft',
      priority: 'medium',
      accessLevel: 'internal',
      versionLabel: 'R00',
      content,
    } as Parameters<typeof addItem>[1]);
    router.push(`/sops/${id}/edit`);
  };

  const handleApplyToSop = () => {
    if (!sopId || !output.trim()) return;
    const sops = (getItems('sops') as SOP[]) || [];
    const sop = sops.find((s) => s.id === sopId);
    if (!sop) return;
    const content: SOPContent = sop.content || {
      header: buildDefaultHeader(sop.department),
      sections: buildDefaultSections() as never,
    };
    const newContent: SOPContent = {
      ...content,
      sections: { ...content.sections, purpose: output as never },
    };
    updateItem('sops', sopId, { content: newContent });
    router.push(`/sops/${sopId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[400px_1fr]">
      {/* INPUT PANEL */}
      <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">{tool.name}</h2>
          <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-300">
            ← All tools
          </button>
        </div>

        {isGenerator ? (
          <>
            <Field label="Topic / process to document" required>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Customer refund process"
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              >
                {SOP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Department">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Operations"
                className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
              />
            </Field>
          </>
        ) : (
          <Field
            label={
              tool.id === 'paste-to-sop'
                ? 'Paste any document — we will structure it'
                : 'Source content'
            }
          >
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={tool.id === 'paste-to-sop' ? 14 : 10}
              placeholder={
                tool.id === 'paste-to-sop'
                  ? 'Paste a Notion doc, Google Doc, plain text, or any messy notes here…'
                  : 'Paste the section text or full SOP here…'
              }
              className="w-full resize-y rounded-md border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
            />
          </Field>
        )}

        {tool.id === 'translate' && (
          <Field label="Target language">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-700 bg-slate-900 px-2 text-sm text-slate-200 focus:border-primary-500 focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {tool.id !== 'translate' && tool.id !== 'quiz' && tool.id !== 'paste-to-sop' && (
          <Field label="Tone">
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={
                    'rounded-full border px-2.5 py-1 text-xs transition-colors ' +
                    (tone === t
                      ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700')
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        )}

        <Button onClick={handleRun} disabled={generating} className="w-full">
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Working…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {tool.actionLabel}
            </>
          )}
        </Button>

        <p className="text-[10px] text-slate-500">
          Demo mode — output is mocked. Wire to <code className="text-slate-400">/api/ai</code> for real
          generations.
        </p>
      </div>

      {/* OUTPUT PANEL */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/40">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-slate-400">Output</h3>
          <div className="flex items-center gap-1">
            {output && (
              <>
                <SpeakButton text={output} />
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  title="Copy"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleRun}
                  disabled={generating}
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  title="Regenerate"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="p-4">
          {generating ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : output ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{output}</pre>
          ) : (
            <p className="py-16 text-center text-sm text-slate-500">
              Output will appear here after you run the tool.
            </p>
          )}
        </div>
        {output && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-700 px-4 py-3">
            {sopId ? (
              <Button onClick={handleApplyToSop}>
                <Save className="mr-1.5 h-4 w-4" />
                Apply to SOP
              </Button>
            ) : (
              <Button onClick={handleSaveAsSop}>
                <Save className="mr-1.5 h-4 w-4" />
                Save as new SOP
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">
        {label}
        {required && <span className="ml-0.5 text-rose-400">*</span>}
      </span>
      {children}
    </label>
  );
}

// ============================================
// MOCK GENERATORS
// (Replace with real AI responses once backend wired.)
// ============================================

function buildMockSopMarkdown(topic: string, category: string, department: string, tone: string): string {
  const t = topic || 'this process';
  return `# ${t}

**Category:** ${category}
**Department:** ${department || 'General'}
**Tone:** ${tone}

## Purpose
This SOP defines how ${t.toLowerCase()} is carried out consistently across the organisation, including who is responsible, the exact steps to follow, and how exceptions should be handled.

## Scope
Applies to every team member directly involved in ${t.toLowerCase()}, regardless of department.

## Roles & Responsibilities
- Process Owner: maintains the SOP, runs reviews quarterly.
- Operator: executes the steps day-to-day.
- Approver: signs off exceptions and escalations.

## Procedures
1. Initiation — log the request with relevant context.
2. Validation — confirm prerequisites are met.
3. Execution — follow the standard steps without skipping checks.
4. Verification — confirm the outcome matches the expected result.
5. Documentation — record the activity in the system of record.

## Risks & Mitigation
- Risk: human error during execution. Mitigation: dual review for critical steps.
- Risk: stale information. Mitigation: review every 6 months.

## Review Procedure
Reviewed every 6 months by the Process Owner, or sooner on material change.

> Demo mode — wire AI Studio to /api/ai/generate-sop to replace this with a real generation.`;
}

function buildMockChecklist(text: string): string {
  return `Checklist generated from input:

[ ] Confirm prerequisites met
[ ] Notify stakeholders of start
[ ] Run primary procedure steps
[ ] Verify outcome against acceptance criteria
[ ] Document result in system of record
[ ] Send completion notification
[ ] Schedule retro / review

(Source length: ${text.length} chars)`;
}

function buildMockSummary(text: string): string {
  return `**TL;DR**
This SOP defines a standardised process with clear roles, sequenced steps, and review cadence. Use it as the source of truth and update on every material change.

**Key points**
- Owner is accountable for upkeep
- Operators follow steps without skipping checks
- Reviewed every 6 months

(Summarised from ${text.length} chars of source.)`;
}

function buildMockImprovements(text: string): string {
  return `**Improvement suggestions**
1. Add measurable acceptance criteria to each step.
2. Define clear escalation paths for exceptions.
3. Include a flowchart for complex branches.
4. Add a "common mistakes" section to reduce rework.
5. Set automated reminders for the review cycle.

(Analysed ${text.length} chars.)`;
}

function buildMockRewrite(text: string, tone: string): string {
  if (!text.trim()) return `Paste a section above and click Rewrite.`;
  return `[${tone} rewrite]\n\n${text.replace(/\s+/g, ' ').trim()}\n\n(Demo — wire to /api/ai/rewrite for the real output.)`;
}

function buildMockPasteToSop(text: string): string {
  if (!text.trim()) return 'Paste your existing document above and click Structure.';
  const headings = text
    .split(/\n+/)
    .filter((line) => /^[A-Z][A-Za-z ]{3,}$/.test(line.trim()) || line.trim().startsWith('#'))
    .slice(0, 6)
    .map((line) => `- ${line.replace(/^#+\s*/, '').trim()}`);
  return `**Suggested SOP structure**

Mapped your content into the standard 20-section template:

# Purpose
${text.split('.')[0]}.

# Scope
Applies to all relevant teams.

# Roles & Responsibilities
- Owner: Maintains and reviews this SOP.

# Procedures
${headings.length ? headings.join('\n') : '- Step 1\n- Step 2\n- Step 3'}

(Demo — wire to /api/ai/paste-to-sop. Click "Save as new SOP" to populate the editor.)`;
}

function buildMockTranslate(text: string, lang: string): string {
  const langName = LANGUAGES.find((l) => l.value === lang)?.label || lang;
  if (!text.trim()) return 'Paste a section above and click Translate.';
  return `[Translated to ${langName}]\n\n${text.replace(/\s+/g, ' ').trim()}\n\n(Demo — wire to /api/ai/translate for actual translation.)`;
}

function buildMockQuiz(text: string): string {
  return `Quiz — 5 questions

1. What is the primary purpose of this SOP?
   a) Compliance
   b) Operational consistency
   c) Cost reduction
   d) Marketing

2. Who is responsible for reviewing this SOP?

3. List two key risks identified in this SOP.

4. What are the standard escalation steps?

5. How often should this SOP be reviewed?

(Source length: ${text.length} chars · demo — wire to /api/ai/quiz-json for structured questions.)`;
}

// ============================================
// SPEAK BUTTON (Web Speech API)
// ============================================

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = React.useState(false);

  const speak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      window.alert('Voice narration is not supported in this browser.');
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text.slice(0, 4000));
    utter.rate = 1.0;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <button
      onClick={speak}
      className={
        'rounded p-1.5 transition-colors ' +
        (speaking ? 'text-primary-300' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200')
      }
      title={speaking ? 'Stop narration' : 'Read aloud'}
    >
      <Volume2 className={`h-3.5 w-3.5 ${speaking ? 'animate-pulse' : ''}`} />
    </button>
  );
}
