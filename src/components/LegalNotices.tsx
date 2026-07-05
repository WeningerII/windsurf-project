import { ArrowLeft, FileText, Scale, ShieldAlert, Sparkles } from 'lucide-react';

import { legalAttributions } from '../legal/attributions';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

// Verbatim license bodies are fetched from canonical upstreams into
// src/legal/texts/ by `npm run legal:generate` and embedded here as raw strings.
// Importing them with `?raw` keeps this whole view (and the ~26 KB of license
// text) in its own lazily-loaded chunk, off the app's first-paint budget.
import ccByText from '../legal/texts/CC-BY-4.0.txt?raw';
import dpcglText from '../legal/texts/DPCGL-1.0.txt?raw';
import oglText from '../legal/texts/OGL-1.0a.txt?raw';

const licenseTexts: Record<string, string> = {
  'OGL-1.0a': oglText,
  'CC-BY-4.0': ccByText,
  DPCGL: dpcglText,
};

interface LegalNoticesProps {
  onBack: () => void;
}

export function LegalNotices({ onBack }: LegalNoticesProps) {
  const { intro, updated, systems, licenses, disclaimers } = legalAttributions;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Legal &amp; Open-Content Notices</h1>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{intro}</p>
      <p className="text-xs text-muted-foreground">Last reviewed: {updated}</p>

      {/* Per-system attributions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Attributions by game system
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {systems.map((system) => {
            const license = licenses.find((entry) => entry.id === system.licenseId);
            return (
              <div
                key={system.systemLabel}
                className="space-y-2 border-b border-input pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{system.systemLabel}</h3>
                  {license && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {license.name}
                    </span>
                  )}
                  {system.provenanceStatus === 'under-review' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      <ShieldAlert className="h-3 w-3" />
                      Provenance under review
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{system.content}</p>
                <p className="text-sm">{system.attribution}</p>
                {system.section15.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium">Open Game License §15 — Chain of Title:</p>
                    <ul className="ml-4 list-disc space-y-0.5">
                      {system.section15.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {system.provenanceStatus === 'under-review' && system.provenanceNote && (
                  <p className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-300">
                    {system.provenanceNote}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Disclaimers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Affiliation. </span>
            {disclaimers.notAffiliated}
          </p>
          <p>
            <span className="font-medium text-foreground">Trademarks. </span>
            {disclaimers.trademarks}
          </p>
          <p>
            <span className="font-medium text-foreground">AI-generated content. </span>
            {disclaimers.ai}
          </p>
        </CardContent>
      </Card>

      {/* Verbatim license texts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Full license texts &amp; notices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {licenses.map((license) => {
            const text = licenseTexts[license.id];
            if (!text) {
              return null;
            }
            return (
              <section key={license.id} aria-label={license.name} className="space-y-2">
                <h3 className="font-semibold">{license.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Canonical source:{' '}
                  <a
                    href={license.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-foreground"
                  >
                    {license.url}
                  </a>
                </p>
                <pre className="max-h-80 overflow-auto rounded-md border border-input bg-muted/40 p-3 text-[11px] leading-relaxed whitespace-pre-wrap">
                  {text.trimEnd()}
                </pre>
              </section>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
