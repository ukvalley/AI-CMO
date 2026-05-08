/**
 * 13 sections of SOP 1.7 — Brand Identity Direction
 *
 * Modules:
 *   1  Purpose & Meaning            (7.1)
 *   2  Personality Framework        (7.2)
 *   3  Voice & Tone                 (7.3)
 *   4  Emotional Positioning        (7.4)
 *   5  Visual Direction             (7.5)
 *   6  Differentiation Anchors      (7.6)
 *   7  Consistency Guardrails       (7.7)
 *   8  Internal Alignment           (7.8)
 *   9  Validation & Stress Test     (7.9)
 *  10  Master Document Generator
 *  11  Rules Enforcement Engine
 *  12  Approval Workflow
 *  13  Health Dashboard  (rendered separately as a header)
 */

'use client';

import React from 'react';
import { Input, Textarea } from '@/components/ui';
import {
  AddRowButton,
  ApprovalBar,
  CheckRow,
  Field,
  SectionCard,
  SliderField,
  TagInput,
} from './primitives';
import type { Brand, BrandChecklistItem } from '@/types/entities';
import { CheckCircle2, Download, FileText, ShieldAlert, Trash2 } from 'lucide-react';

type Updater = (patch: Partial<Brand>) => void;
type LogApproval = (entry: {
  role: 'CEO' | 'Brand Strategist' | 'Marketing Head' | 'Product Head' | 'HR Lead';
  approver: string;
  section: string;
  notes?: string;
}) => void;

// =============================================================
// 7.1 PURPOSE & MEANING
// =============================================================
export function PurposeSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const approved = !!brand.purposeApprovedByCEO;
  return (
    <SectionCard
      step="Module 1 · Step 7.1"
      title="Brand Purpose & Meaning Builder"
      description="Define why the brand exists beyond profit — the emotional core."
      approved={approved}
      approvalLabel="CEO Locked"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Why does this brand exist?" required>
          <Textarea
            rows={3}
            value={brand.purposeWhyExists ?? ''}
            onChange={(e) => update({ purposeWhyExists: e.target.value })}
            placeholder="Beyond making money — what change are we creating?"
          />
        </Field>
        <Field label="Emotional problem we solve">
          <Textarea
            rows={3}
            value={brand.purposeEmotionalProblem ?? ''}
            onChange={(e) => update({ purposeEmotionalProblem: e.target.value })}
            placeholder="The frustration or pain our customers feel before us"
          />
        </Field>
        <Field label="Who is the brand for?">
          <Textarea
            rows={3}
            value={brand.purposeForWhom ?? ''}
            onChange={(e) => update({ purposeForWhom: e.target.value })}
          />
        </Field>
        <Field label="Who is the brand NOT for?">
          <Textarea
            rows={3}
            value={brand.purposeNotForWhom ?? ''}
            onChange={(e) => update({ purposeNotForWhom: e.target.value })}
          />
        </Field>
      </div>

      <div>
        <p className="text-sm font-medium text-[#afb6c4] mb-2">Alignment checker</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <CheckRow
            label="Aligns with company vision"
            checked={!!brand.purposeAlignsVision}
            onChange={(v) => update({ purposeAlignsVision: v })}
          />
          <CheckRow
            label="Aligns with value proposition"
            checked={!!brand.purposeAlignsValueProp}
            onChange={(v) => update({ purposeAlignsValueProp: v })}
          />
          <CheckRow
            label="Aligns with market positioning"
            checked={!!brand.purposeAlignsPositioning}
            onChange={(v) => update({ purposeAlignsPositioning: v })}
          />
        </div>
      </div>

      <ApprovalBar
        approved={approved}
        onToggle={() => {
          const next = !approved;
          update({
            purposeApprovedByCEO: next,
            purposeApprovedAt: next ? new Date().toISOString() : undefined,
          });
          if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Purpose & Meaning' });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// 7.2 PERSONALITY FRAMEWORK
// =============================================================
export function PersonalitySection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const approved = !!brand.personalityApprovedByCEO;
  return (
    <SectionCard
      step="Module 2 · Step 7.2"
      title="Brand Personality Framework"
      description="Human traits — how the brand thinks, speaks, and behaves."
      approved={approved}
    >
      <Field label="Primary traits (pick up to 3)" hint="Examples: Bold, Curious, Trustworthy, Witty, Caring">
        <TagInput
          value={brand.personalityPrimary ?? []}
          onChange={(v) => update({ personalityPrimary: v })}
          placeholder="Add a trait + Enter"
          max={3}
        />
      </Field>
      <Field label="Secondary traits (pick up to 2)">
        <TagInput
          value={brand.personalitySecondary ?? []}
          onChange={(v) => update({ personalitySecondary: v })}
          placeholder="Add a trait + Enter"
          max={2}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="How the brand speaks (everyday)">
          <Textarea
            rows={3}
            value={brand.personalitySpeakStyle ?? ''}
            onChange={(e) => update({ personalitySpeakStyle: e.target.value })}
            placeholder="Direct, warm, sentence length, emoji policy, etc."
          />
        </Field>
        <Field label="How the brand reacts under pressure">
          <Textarea
            rows={3}
            value={brand.personalityUnderPressure ?? ''}
            onChange={(e) => update({ personalityUnderPressure: e.target.value })}
            placeholder="During outages, complaints, or PR crises"
          />
        </Field>
      </div>

      <ApprovalBar
        approved={approved}
        onToggle={() => {
          const next = !approved;
          update({ personalityApprovedByCEO: next });
          if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Personality Framework' });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// 7.3 VOICE & TONE
// =============================================================
export function VoiceToneSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const ceoApproved = !!brand.voiceApprovedByCEO;
  const mktApproved = !!brand.voiceApprovedByMarketing;
  return (
    <SectionCard
      step="Module 3 · Step 7.3"
      title="Brand Voice & Tone Guide"
      description="Standardise how the brand communicates across every channel."
      approved={ceoApproved && mktApproved}
      approvalLabel="CEO + Marketing Locked"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Writing style">
          <Textarea
            rows={3}
            value={brand.voiceWritingStyle ?? ''}
            onChange={(e) => update({ voiceWritingStyle: e.target.value })}
            placeholder="Conversational, journalistic, technical..."
          />
        </Field>
        <Field label="Vocabulary preferences">
          <Textarea
            rows={3}
            value={brand.voiceVocabulary ?? ''}
            onChange={(e) => update({ voiceVocabulary: e.target.value })}
            placeholder="Words we love, words we avoid, jargon policy"
          />
        </Field>
        <Field label="Sentence structure rules">
          <Textarea
            rows={3}
            value={brand.voiceSentenceRules ?? ''}
            onChange={(e) => update({ voiceSentenceRules: e.target.value })}
            placeholder="Average length, active voice, emoji limits"
          />
        </Field>
      </div>

      <p className="text-sm font-semibold text-white pt-2">Tone by context</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Website tone">
          <Input
            value={brand.voiceWebsiteTone ?? ''}
            onChange={(e) => update({ voiceWebsiteTone: e.target.value })}
            placeholder="Confident, welcoming"
          />
        </Field>
        <Field label="Support tone">
          <Input
            value={brand.voiceSupportTone ?? ''}
            onChange={(e) => update({ voiceSupportTone: e.target.value })}
            placeholder="Empathetic, calm"
          />
        </Field>
        <Field label="Sales tone">
          <Input
            value={brand.voiceSalesTone ?? ''}
            onChange={(e) => update({ voiceSalesTone: e.target.value })}
            placeholder="Direct, value-led"
          />
        </Field>
        <Field label="Crisis tone">
          <Input
            value={brand.voiceCrisisTone ?? ''}
            onChange={(e) => update({ voiceCrisisTone: e.target.value })}
            placeholder="Honest, transparent, accountable"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Do's" hint="Press Enter after each item">
          <TagInput
            value={brand.voiceDos ?? []}
            onChange={(v) => update({ voiceDos: v })}
            placeholder="e.g. Speak in second person"
          />
        </Field>
        <Field label="Don'ts">
          <TagInput
            value={brand.voiceDonts ?? []}
            onChange={(v) => update({ voiceDonts: v })}
            placeholder="e.g. No corporate jargon"
          />
        </Field>
      </div>

      <Field label="Example phrase library" hint="Real sentences that sound like the brand">
        <Textarea
          rows={4}
          value={brand.voiceExamplePhrases ?? ''}
          onChange={(e) => update({ voiceExamplePhrases: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ApprovalBar
          approved={ceoApproved}
          label="CEO Approval"
          onToggle={() => {
            const next = !ceoApproved;
            update({ voiceApprovedByCEO: next });
            if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Voice & Tone' });
          }}
        />
        <ApprovalBar
          approved={mktApproved}
          label="Marketing Head Approval"
          onToggle={() => {
            const next = !mktApproved;
            update({ voiceApprovedByMarketing: next });
            if (next)
              logApproval({
                role: 'Marketing Head',
                approver: 'Marketing Head',
                section: 'Voice & Tone',
              });
          }}
        />
      </div>
    </SectionCard>
  );
}

// =============================================================
// 7.4 EMOTIONAL POSITIONING & PROMISE
// =============================================================
export function EmotionalSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const approved = !!brand.emotionalApprovedByCEO;
  return (
    <SectionCard
      step="Module 4 · Step 7.4"
      title="Emotional Positioning & Brand Promise"
      description="What the customer feels, and what we commit to deliver."
      approved={approved}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Core emotional benefit">
          <Textarea
            rows={3}
            value={brand.emotionalBenefit ?? ''}
            onChange={(e) => update({ emotionalBenefit: e.target.value })}
            placeholder="The feeling our customers walk away with"
          />
        </Field>
        <Field label="Core brand promise" required>
          <Textarea
            rows={3}
            value={brand.brandPromise ?? ''}
            onChange={(e) => update({ brandPromise: e.target.value })}
            placeholder="One sentence we will always deliver on"
          />
        </Field>
      </div>

      <div>
        <p className="text-sm font-medium text-[#afb6c4] mb-2">Promise validation checklist</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <CheckRow
            label="Believable"
            checked={!!brand.promiseBelievable}
            onChange={(v) => update({ promiseBelievable: v })}
          />
          <CheckRow
            label="Defensible"
            checked={!!brand.promiseDefensible}
            onChange={(v) => update({ promiseDefensible: v })}
          />
          <CheckRow
            label="Deliverable"
            checked={!!brand.promiseDeliverable}
            onChange={(v) => update({ promiseDeliverable: v })}
          />
        </div>
      </div>

      <p className="text-sm font-semibold text-white pt-2">Emotional trigger map</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Trust trigger">
          <Input
            value={brand.triggerTrust ?? ''}
            onChange={(e) => update({ triggerTrust: e.target.value })}
            placeholder="What earns trust?"
          />
        </Field>
        <Field label="Confidence trigger">
          <Input
            value={brand.triggerConfidence ?? ''}
            onChange={(e) => update({ triggerConfidence: e.target.value })}
            placeholder="What builds confidence?"
          />
        </Field>
        <Field label="Relief trigger">
          <Input
            value={brand.triggerRelief ?? ''}
            onChange={(e) => update({ triggerRelief: e.target.value })}
            placeholder="What removes anxiety?"
          />
        </Field>
        <Field label="Empowerment trigger">
          <Input
            value={brand.triggerEmpowerment ?? ''}
            onChange={(e) => update({ triggerEmpowerment: e.target.value })}
            placeholder="What makes them feel capable?"
          />
        </Field>
      </div>

      <ApprovalBar
        approved={approved}
        onToggle={() => {
          const next = !approved;
          update({ emotionalApprovedByCEO: next });
          if (next)
            logApproval({ role: 'CEO', approver: 'CEO', section: 'Emotional Positioning' });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// 7.5 VISUAL DIRECTION (Conceptual)
// =============================================================
export function VisualSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const approved = !!brand.visualApprovedByCEO;
  const themes: Brand['visualTheme'][] = ['minimal', 'bold', 'elegant', 'technical'];
  const eras: Brand['visualEra'][] = ['traditional', 'modern', 'hybrid'];
  return (
    <SectionCard
      step="Module 5 · Step 7.5"
      title="Visual Identity Direction"
      description="Lock the conceptual visual language before any design work begins."
      approved={approved}
    >
      <Field label="Visual theme">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {themes.map((t) => {
            const active = brand.visualTheme === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => update({ visualTheme: t })}
                className={`rounded-lg border px-3 py-2.5 text-sm capitalize transition-all ${
                  active
                    ? 'bg-[#C8FF2E]/15 border-[#C8FF2E]/60 text-primary-300'
                    : 'bg-[#1a1d21] border-white/10 text-[#afb6c4] hover:border-[#C8FF2E]/30'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Era / style">
        <div className="grid grid-cols-3 gap-2">
          {eras.map((e) => {
            const active = brand.visualEra === e;
            return (
              <button
                key={e}
                type="button"
                onClick={() => update({ visualEra: e })}
                className={`rounded-lg border px-3 py-2.5 text-sm capitalize transition-all ${
                  active
                    ? 'bg-[#C8FF2E]/15 border-[#C8FF2E]/60 text-primary-300'
                    : 'bg-[#1a1d21] border-white/10 text-[#afb6c4] hover:border-[#C8FF2E]/30'
                }`}
              >
                {e}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Colour psychology direction">
          <Textarea
            rows={3}
            value={brand.visualColourPsychology ?? ''}
            onChange={(e) => update({ visualColourPsychology: e.target.value })}
            placeholder="Cool/calm, warm/energetic, monochrome..."
          />
        </Field>
        <Field label="Typography personality">
          <Textarea
            rows={3}
            value={brand.visualTypography ?? ''}
            onChange={(e) => update({ visualTypography: e.target.value })}
            placeholder="Geometric, humanist, serif heritage..."
          />
        </Field>
        <Field label="Imagery style">
          <Textarea
            rows={3}
            value={brand.visualImageryStyle ?? ''}
            onChange={(e) => update({ visualImageryStyle: e.target.value })}
            placeholder="Photography, illustration, 3D, abstract..."
          />
        </Field>
        <Field label="Inspiration references" hint="Paste links to mood boards / brands you admire">
          <TagInput
            value={brand.visualInspirationLinks ?? []}
            onChange={(v) => update({ visualInspirationLinks: v })}
            placeholder="https://..."
          />
        </Field>
      </div>

      <ApprovalBar
        approved={approved}
        onToggle={() => {
          const next = !approved;
          update({ visualApprovedByCEO: next });
          if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Visual Direction' });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// 7.6 DIFFERENTIATION ANCHORS
// =============================================================
export function DifferentiationSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const approved = !!brand.diffApprovedByCEO;
  return (
    <SectionCard
      step="Module 6 · Step 7.6"
      title="Brand Differentiation Anchors"
      description="Identify the elements competitors can't easily copy."
      approved={approved}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Competitor visual gap">
          <Textarea
            rows={3}
            value={brand.diffCompetitorVisualGap ?? ''}
            onChange={(e) => update({ diffCompetitorVisualGap: e.target.value })}
            placeholder="Visual territory nobody owns yet"
          />
        </Field>
        <Field label="Competitor messaging gap">
          <Textarea
            rows={3}
            value={brand.diffCompetitorMessagingGap ?? ''}
            onChange={(e) => update({ diffCompetitorMessagingGap: e.target.value })}
            placeholder="Words, frames, narratives nobody is using"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Brand symbols" hint="Iconography, mascots, recurring shapes">
          <TagInput
            value={brand.diffBrandSymbols ?? []}
            onChange={(v) => update({ diffBrandSymbols: v })}
            placeholder="Add a symbol"
          />
        </Field>
        <Field label="Signature expressions" hint="Phrases people associate with you">
          <TagInput
            value={brand.diffSignatureExpressions ?? []}
            onChange={(v) => update({ diffSignatureExpressions: v })}
            placeholder="Add a signature phrase"
          />
        </Field>
        <Field label="Locked unique elements" hint="Cannot be changed without CEO approval">
          <TagInput
            value={brand.diffLockedElements ?? []}
            onChange={(v) => update({ diffLockedElements: v })}
            placeholder="e.g. Logomark, primary colour"
          />
        </Field>
      </div>

      <ApprovalBar
        approved={approved}
        onToggle={() => {
          const next = !approved;
          update({ diffApprovedByCEO: next });
          if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Differentiation' });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// 7.7 CONSISTENCY GUARDRAILS
// =============================================================
export function GuardrailsSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const approved = !!brand.guardApprovedByCEO;
  return (
    <SectionCard
      step="Module 7 · Step 7.7"
      title="Brand Consistency Guardrails"
      description="Prevent brand drift and misuse across teams."
      approved={approved}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="What cannot change">
          <Textarea
            rows={3}
            value={brand.guardCannotChange ?? ''}
            onChange={(e) => update({ guardCannotChange: e.target.value })}
            placeholder="Logo, primary colour, brand promise..."
          />
        </Field>
        <Field label="What can evolve">
          <Textarea
            rows={3}
            value={brand.guardCanEvolve ?? ''}
            onChange={(e) => update({ guardCanEvolve: e.target.value })}
            placeholder="Imagery style, secondary palette, micro-copy..."
          />
        </Field>
        <Field label="Brand misuse examples">
          <Textarea
            rows={3}
            value={brand.guardMisuseExamples ?? ''}
            onChange={(e) => update({ guardMisuseExamples: e.target.value })}
            placeholder="Wrong colour usage, off-tone copy, off-brand imagery"
          />
        </Field>
        <Field label="Approval workflow for branding changes">
          <Textarea
            rows={3}
            value={brand.guardApprovalWorkflow ?? ''}
            onChange={(e) => update({ guardApprovalWorkflow: e.target.value })}
            placeholder="Who approves what, in what order"
          />
        </Field>
      </div>

      <Field label="Alignment with internal culture">
        <Textarea
          rows={3}
          value={brand.guardCultureAlignment ?? ''}
          onChange={(e) => update({ guardCultureAlignment: e.target.value })}
          placeholder="How brand reflects how we work internally"
        />
      </Field>

      <ApprovalBar
        approved={approved}
        onToggle={() => {
          const next = !approved;
          update({ guardApprovedByCEO: next });
          if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Guardrails' });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// 7.8 INTERNAL ALIGNMENT
// =============================================================
export function AlignmentSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const ceo = !!brand.alignApprovedByCEO;
  const hr = !!brand.alignApprovedByHR;
  const onboarding = brand.alignOnboardingChecklist ?? [];
  const leadership = brand.alignLeadershipChecklist ?? [];

  const newItem = (item: string): BrandChecklistItem => ({
    id: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    item,
    done: false,
  });

  return (
    <SectionCard
      step="Module 8 · Step 7.8"
      title="Internal Brand Alignment System"
      description="Embed the brand into people, onboarding, and culture."
      approved={ceo && hr}
      approvalLabel="HR + CEO Locked"
    >
      <Field label="Brand training modules">
        <Textarea
          rows={3}
          value={brand.alignTrainingModules ?? ''}
          onChange={(e) => update({ alignTrainingModules: e.target.value })}
          placeholder="Internal training programmes that teach the brand"
        />
      </Field>

      <ChecklistEditor
        title="Onboarding checklist"
        items={onboarding}
        onChange={(next) => update({ alignOnboardingChecklist: next })}
        addLabel="Add onboarding item"
        defaultText="New checklist item"
      />

      <Field label="Performance metric linkage">
        <Textarea
          rows={3}
          value={brand.alignPerformanceMetrics ?? ''}
          onChange={(e) => update({ alignPerformanceMetrics: e.target.value })}
          placeholder="How brand-aligned behaviour shows up in OKRs / reviews"
        />
      </Field>

      <ChecklistEditor
        title="Leadership embodiment checklist"
        items={leadership}
        onChange={(next) => update({ alignLeadershipChecklist: next })}
        addLabel="Add leadership item"
        defaultText="Leadership behaviour"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ApprovalBar
          approved={hr}
          label="HR / Culture Lead"
          onToggle={() => {
            const next = !hr;
            update({ alignApprovedByHR: next });
            if (next) logApproval({ role: 'HR Lead', approver: 'HR Lead', section: 'Internal Alignment' });
          }}
        />
        <ApprovalBar
          approved={ceo}
          label="CEO Approval"
          onToggle={() => {
            const next = !ceo;
            update({ alignApprovedByCEO: next });
            if (next) logApproval({ role: 'CEO', approver: 'CEO', section: 'Internal Alignment' });
          }}
        />
      </div>
    </SectionCard>
  );
}

function ChecklistEditor({
  title,
  items,
  onChange,
  addLabel,
  defaultText,
}: {
  title: string;
  items: BrandChecklistItem[];
  onChange: (next: BrandChecklistItem[]) => void;
  addLabel: string;
  defaultText: string;
}) {
  const update = (id: string, patch: Partial<BrandChecklistItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-[#afb6c4]">{title}</p>
        <AddRowButton
          label={addLabel}
          onClick={() =>
            onChange([
              ...items,
              {
                id: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                item: defaultText,
                done: false,
              },
            ])
          }
        />
      </div>
      {items.length === 0 && (
        <p className="text-xs text-[#686f7e] italic">No items yet — click {addLabel.toLowerCase()} to begin.</p>
      )}
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1d21]/60 px-3 py-2"
          >
            <input
              type="checkbox"
              checked={it.done}
              onChange={(e) => update(it.id, { done: e.target.checked })}
              className="w-4 h-4 accent-emerald-500"
            />
            <input
              type="text"
              value={it.item}
              onChange={(e) => update(it.id, { item: e.target.value })}
              className="flex-1 bg-transparent text-sm text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((i) => i.id !== it.id))}
              className="text-[#686f7e] hover:text-red-400"
              aria-label="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// =============================================================
// 7.9 VALIDATION & STRESS TEST
// =============================================================
export function ValidationSection({
  brand,
  update,
  logApproval,
}: {
  brand: Brand;
  update: Updater;
  logApproval: LogApproval;
}) {
  const finalLocked = !!brand.validFinalLockByCEO;
  return (
    <SectionCard
      step="Module 9 · Step 7.9"
      title="Brand Validation & Stress Test"
      description="Test the direction with real signal before final lock."
      approved={finalLocked}
      approvalLabel="Brand Locked"
    >
      <p className="text-sm font-semibold text-white">Feedback capture</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Customer feedback">
          <Textarea
            rows={4}
            value={brand.validCustomerFeedback ?? ''}
            onChange={(e) => update({ validCustomerFeedback: e.target.value })}
          />
        </Field>
        <Field label="Internal team feedback">
          <Textarea
            rows={4}
            value={brand.validInternalFeedback ?? ''}
            onChange={(e) => update({ validInternalFeedback: e.target.value })}
          />
        </Field>
        <Field label="Neutral reviewers">
          <Textarea
            rows={4}
            value={brand.validNeutralFeedback ?? ''}
            onChange={(e) => update({ validNeutralFeedback: e.target.value })}
          />
        </Field>
      </div>

      <p className="text-sm font-semibold text-white pt-2">Stress test scoring</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SliderField
          label="Scalability"
          value={brand.validScalability ?? 5}
          onChange={(n) => update({ validScalability: n })}
        />
        <SliderField
          label="Cultural sensitivity"
          value={brand.validCulturalSensitivity ?? 5}
          onChange={(n) => update({ validCulturalSensitivity: n })}
        />
        <SliderField
          label="Longevity"
          value={brand.validLongevity ?? 5}
          onChange={(n) => update({ validLongevity: n })}
        />
      </div>

      <ApprovalBar
        approved={finalLocked}
        label="CEO Final Lock"
        onToggle={() => {
          const next = !finalLocked;
          update({
            validFinalLockByCEO: next,
            validLockedAt: next ? new Date().toISOString() : undefined,
          });
          if (next)
            logApproval({
              role: 'CEO',
              approver: 'CEO',
              section: 'Validation Final Lock',
              notes: 'Brand identity sealed.',
            });
        }}
      />
    </SectionCard>
  );
}

// =============================================================
// MODULE 11 — RULES ENFORCEMENT ENGINE
// =============================================================
export function RulesEngineSection({ brand, update }: { brand: Brand; update: Updater }) {
  const [sample, setSample] = React.useState('');

  const violations = React.useMemo(() => {
    const out: { kind: 'voice' | 'design'; word: string }[] = [];
    if (!sample.trim()) return out;
    const lc = sample.toLowerCase();
    (brand.rulesVoiceForbiddenWords ?? []).forEach((w) => {
      if (w && lc.includes(w.toLowerCase())) out.push({ kind: 'voice', word: w });
    });
    (brand.rulesDesignForbiddenPatterns ?? []).forEach((w) => {
      if (w && lc.includes(w.toLowerCase())) out.push({ kind: 'design', word: w });
    });
    return out;
  }, [sample, brand.rulesVoiceForbiddenWords, brand.rulesDesignForbiddenPatterns]);

  return (
    <SectionCard
      step="Module 11"
      title="Brand Rules Enforcement Engine"
      description="Define non-negotiable rules. Run any draft through the checker before it ships."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Voice — forbidden words / phrases"
          hint="Anything our brand should never say"
        >
          <TagInput
            value={brand.rulesVoiceForbiddenWords ?? []}
            onChange={(v) => update({ rulesVoiceForbiddenWords: v })}
            placeholder="e.g. synergy, cheap, guys"
          />
        </Field>
        <Field
          label="Design — forbidden patterns"
          hint="e.g. light backgrounds, sans + sans pairs, gradient borders"
        >
          <TagInput
            value={brand.rulesDesignForbiddenPatterns ?? []}
            onChange={(v) => update({ rulesDesignForbiddenPatterns: v })}
            placeholder="Add a forbidden pattern"
          />
        </Field>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0d1117]/40 p-4">
        <p className="text-sm font-medium text-[#afb6c4] mb-2">Live consistency checker</p>
        <Textarea
          rows={4}
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          placeholder="Paste any draft copy or design brief here to scan it against brand rules"
        />
        <div className="mt-3">
          {sample.trim().length === 0 ? (
            <p className="text-xs text-[#686f7e]">Awaiting input...</p>
          ) : violations.length === 0 ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Passes brand rules.
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="inline-flex items-center gap-1.5 text-sm text-red-400 font-medium">
                <ShieldAlert className="w-4 h-4" /> {violations.length} violation(s) detected
              </p>
              <ul className="text-xs text-[#afb6c4] space-y-1">
                {violations.map((v, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="rounded bg-red-500/15 text-red-300 px-1.5 py-0.5 font-medium uppercase">
                      {v.kind}
                    </span>
                    <span>“{v.word}”</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

// =============================================================
// MODULE 12 — APPROVAL WORKFLOW LOG
// =============================================================
export function ApprovalLogSection({ brand }: { brand: Brand }) {
  const log = brand.approvalLog ?? [];
  return (
    <SectionCard
      step="Module 12"
      title="Role-Based Approval Workflow"
      description="Every lock above is recorded here with role, approver, and timestamp."
    >
      <div className="rounded-lg border border-white/10 overflow-hidden">
        {log.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#686f7e]">
            No approvals logged yet. Approve any section to start the audit trail.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0d1117]/60 text-[#878e9a] text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-3 py-2 font-medium">When</th>
                <th className="text-left px-3 py-2 font-medium">Role</th>
                <th className="text-left px-3 py-2 font-medium">Approver</th>
                <th className="text-left px-3 py-2 font-medium">Section</th>
                <th className="text-left px-3 py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry) => (
                <tr key={entry.id} className="border-t border-white/10/60 text-[#afb6c4]">
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{entry.role}</td>
                  <td className="px-3 py-2">{entry.approver}</td>
                  <td className="px-3 py-2">{entry.section}</td>
                  <td className="px-3 py-2 text-[#878e9a]">{entry.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
}

// =============================================================
// MODULE 10 — MASTER DOCUMENT GENERATOR
// =============================================================
export function MasterDocumentSection({ brand, update }: { brand: Brand; update: Updater }) {
  const generateMarkdown = (): string => {
    const lines: string[] = [];
    const yn = (b?: boolean) => (b ? '✅' : '⬜');
    lines.push(`# Brand Identity Master Document`);
    lines.push(`*Version ${(brand.masterDocVersion ?? 0) + 1} · generated ${new Date().toISOString()}*`);
    lines.push('');
    lines.push(`## 1. Purpose & Meaning ${yn(brand.purposeApprovedByCEO)}`);
    lines.push(`- **Why we exist:** ${brand.purposeWhyExists ?? '—'}`);
    lines.push(`- **Emotional problem:** ${brand.purposeEmotionalProblem ?? '—'}`);
    lines.push(`- **For:** ${brand.purposeForWhom ?? '—'}`);
    lines.push(`- **Not for:** ${brand.purposeNotForWhom ?? '—'}`);
    lines.push('');
    lines.push(`## 2. Personality ${yn(brand.personalityApprovedByCEO)}`);
    lines.push(`- **Primary traits:** ${(brand.personalityPrimary ?? []).join(', ') || '—'}`);
    lines.push(`- **Secondary traits:** ${(brand.personalitySecondary ?? []).join(', ') || '—'}`);
    lines.push(`- **How we speak:** ${brand.personalitySpeakStyle ?? '—'}`);
    lines.push(`- **Under pressure:** ${brand.personalityUnderPressure ?? '—'}`);
    lines.push('');
    lines.push(
      `## 3. Voice & Tone ${yn(brand.voiceApprovedByCEO)} ${yn(brand.voiceApprovedByMarketing)}`
    );
    lines.push(`- **Writing style:** ${brand.voiceWritingStyle ?? '—'}`);
    lines.push(`- **Vocabulary:** ${brand.voiceVocabulary ?? '—'}`);
    lines.push(`- **Sentence rules:** ${brand.voiceSentenceRules ?? '—'}`);
    lines.push(`- **Tone — website:** ${brand.voiceWebsiteTone ?? '—'}`);
    lines.push(`- **Tone — support:** ${brand.voiceSupportTone ?? '—'}`);
    lines.push(`- **Tone — sales:** ${brand.voiceSalesTone ?? '—'}`);
    lines.push(`- **Tone — crisis:** ${brand.voiceCrisisTone ?? '—'}`);
    lines.push(`- **Do's:** ${(brand.voiceDos ?? []).join('; ') || '—'}`);
    lines.push(`- **Don'ts:** ${(brand.voiceDonts ?? []).join('; ') || '—'}`);
    lines.push('');
    lines.push(`## 4. Emotional Positioning ${yn(brand.emotionalApprovedByCEO)}`);
    lines.push(`- **Emotional benefit:** ${brand.emotionalBenefit ?? '—'}`);
    lines.push(`- **Brand promise:** ${brand.brandPromise ?? '—'}`);
    lines.push(
      `- **Believable / Defensible / Deliverable:** ${yn(brand.promiseBelievable)} ${yn(brand.promiseDefensible)} ${yn(brand.promiseDeliverable)}`
    );
    lines.push(`- **Trust trigger:** ${brand.triggerTrust ?? '—'}`);
    lines.push(`- **Confidence trigger:** ${brand.triggerConfidence ?? '—'}`);
    lines.push(`- **Relief trigger:** ${brand.triggerRelief ?? '—'}`);
    lines.push(`- **Empowerment trigger:** ${brand.triggerEmpowerment ?? '—'}`);
    lines.push('');
    lines.push(`## 5. Visual Direction ${yn(brand.visualApprovedByCEO)}`);
    lines.push(`- **Theme:** ${brand.visualTheme ?? '—'}`);
    lines.push(`- **Era:** ${brand.visualEra ?? '—'}`);
    lines.push(`- **Colour psychology:** ${brand.visualColourPsychology ?? '—'}`);
    lines.push(`- **Typography:** ${brand.visualTypography ?? '—'}`);
    lines.push(`- **Imagery:** ${brand.visualImageryStyle ?? '—'}`);
    lines.push(
      `- **Inspiration:** ${(brand.visualInspirationLinks ?? []).join(', ') || '—'}`
    );
    lines.push('');
    lines.push(`## 6. Differentiation ${yn(brand.diffApprovedByCEO)}`);
    lines.push(`- **Visual gap:** ${brand.diffCompetitorVisualGap ?? '—'}`);
    lines.push(`- **Messaging gap:** ${brand.diffCompetitorMessagingGap ?? '—'}`);
    lines.push(`- **Symbols:** ${(brand.diffBrandSymbols ?? []).join(', ') || '—'}`);
    lines.push(
      `- **Signature expressions:** ${(brand.diffSignatureExpressions ?? []).join(', ') || '—'}`
    );
    lines.push(`- **Locked elements:** ${(brand.diffLockedElements ?? []).join(', ') || '—'}`);
    lines.push('');
    lines.push(`## 7. Guardrails ${yn(brand.guardApprovedByCEO)}`);
    lines.push(`- **Cannot change:** ${brand.guardCannotChange ?? '—'}`);
    lines.push(`- **Can evolve:** ${brand.guardCanEvolve ?? '—'}`);
    lines.push(`- **Misuse examples:** ${brand.guardMisuseExamples ?? '—'}`);
    lines.push(`- **Approval workflow:** ${brand.guardApprovalWorkflow ?? '—'}`);
    lines.push(`- **Culture alignment:** ${brand.guardCultureAlignment ?? '—'}`);
    lines.push('');
    lines.push(
      `## 8. Internal Alignment ${yn(brand.alignApprovedByHR)} ${yn(brand.alignApprovedByCEO)}`
    );
    lines.push(`- **Training modules:** ${brand.alignTrainingModules ?? '—'}`);
    lines.push(
      `- **Onboarding checklist:** ${(brand.alignOnboardingChecklist ?? [])
        .map((i) => `${i.done ? '[x]' : '[ ]'} ${i.item}`)
        .join('; ') || '—'}`
    );
    lines.push(`- **Performance metrics:** ${brand.alignPerformanceMetrics ?? '—'}`);
    lines.push(
      `- **Leadership embodiment:** ${(brand.alignLeadershipChecklist ?? [])
        .map((i) => `${i.done ? '[x]' : '[ ]'} ${i.item}`)
        .join('; ') || '—'}`
    );
    lines.push('');
    lines.push(`## 9. Validation ${yn(brand.validFinalLockByCEO)}`);
    lines.push(`- **Customer feedback:** ${brand.validCustomerFeedback ?? '—'}`);
    lines.push(`- **Internal feedback:** ${brand.validInternalFeedback ?? '—'}`);
    lines.push(`- **Neutral feedback:** ${brand.validNeutralFeedback ?? '—'}`);
    lines.push(`- **Scalability:** ${brand.validScalability}/10`);
    lines.push(`- **Cultural sensitivity:** ${brand.validCulturalSensitivity}/10`);
    lines.push(`- **Longevity:** ${brand.validLongevity}/10`);
    lines.push('');
    lines.push(`## Rules Engine`);
    lines.push(
      `- **Voice forbidden:** ${(brand.rulesVoiceForbiddenWords ?? []).join(', ') || '—'}`
    );
    lines.push(
      `- **Design forbidden:** ${(brand.rulesDesignForbiddenPatterns ?? []).join(', ') || '—'}`
    );
    lines.push('');
    lines.push(`---`);
    lines.push(`Approval log: ${(brand.approvalLog ?? []).length} entries.`);
    return lines.join('\n');
  };

  const downloadFile = (filename: string, content: string, mime = 'text/plain') => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportMd = () => {
    const md = generateMarkdown();
    const v = (brand.masterDocVersion ?? 0) + 1;
    update({ masterDocVersion: v, masterDocLockedAt: new Date().toISOString() });
    downloadFile(`brand-identity-v${v}.md`, md, 'text/markdown');
  };

  const exportJson = () => {
    downloadFile(`brand-identity-v${(brand.masterDocVersion ?? 0) + 1}.json`, JSON.stringify(brand, null, 2), 'application/json');
  };

  const previewMd = generateMarkdown();

  return (
    <SectionCard
      step="Module 10"
      title="Brand Identity Master Document"
      description="Auto-compile every locked decision into a single shareable document."
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={exportMd}
          className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          <Download className="w-4 h-4" /> Download .md
        </button>
        <button
          type="button"
          onClick={exportJson}
          className="inline-flex items-center gap-2 rounded-md bg-[#21262d] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#2d333b]"
        >
          <FileText className="w-4 h-4" /> Download JSON
        </button>
        <span className="text-xs text-[#878e9a] ml-auto">
          Version: <span className="font-mono text-white">v{brand.masterDocVersion ?? 0}</span>
          {brand.masterDocLockedAt && (
            <>
              {' '}
              · Last exported{' '}
              <span className="font-mono text-white">
                {new Date(brand.masterDocLockedAt).toLocaleString()}
              </span>
            </>
          )}
        </span>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0d1117]/60 p-4 max-h-96 overflow-auto">
        <pre className="text-xs text-[#afb6c4] whitespace-pre-wrap font-mono">{previewMd}</pre>
      </div>
    </SectionCard>
  );
}
