import { useMemo, useState } from 'react';
import {
  Fingerprint, FileCheck2, ShieldAlert, AlertTriangle, Gauge, CheckCircle2, ScanLine,
  Search, ArrowUpRight
} from 'lucide-react';
import { accent } from '../../components/ui';
import { PageHeading } from '../../components/PublicSite';

const SECTIONS = [
  {
    id: 'identity', icon: Fingerprint, accent: 'identity', title: 'Identity Verification', route: 'screening',
    tagline: 'Confirm who the traveler really is.',
    body: 'The identity layer verifies the person presenting the document. Biometric capture, one-to-one face comparison and liveness detection work against the document portrait, producing a clear match-or-review outcome.',
    checks: ['Face capture & document portrait', '1:1 biometric comparison', 'Liveness & anti-spoofing checks', 'Match confidence score'],
    preview: [
      { label: 'Face match', value: '94.2% — Match', tone: 'text-emerald-700' },
      { label: 'Liveness', value: 'Live', tone: 'text-emerald-700' },
      { label: 'Confidence', value: 'High', tone: 'text-emerald-700' },
    ],
  },
  {
    id: 'document', icon: FileCheck2, accent: 'document', title: 'Document Screening', route: 'screening',
    tagline: 'Authenticate the travel document itself.',
    body: 'The document layer examines the physical and machine-readable structure of the document. MRZ checksum validation, OCR extraction and photo forensics flag forgeries before they reach the desk.',
    checks: ['Document upload & classification', 'ICAO 9303 MRZ checksum validation', 'OCR / VIZ extraction', 'Photo tamper & metadata forensics', 'Expiry & validity checks'],
    preview: [
      { label: 'MRZ checksums', value: 'Valid', tone: 'text-emerald-700' },
      { label: 'Document validity', value: 'Valid', tone: 'text-emerald-700' },
      { label: 'Photo tampering', value: 'None detected', tone: 'text-emerald-700' },
      { label: 'ELA score', value: '86.8%', tone: 'text-amber-700' },
    ],
  },
  {
    id: 'fraud', icon: AlertTriangle, accent: 'fraud', title: 'Fraud Detection', route: 'screening',
    tagline: 'Surface document and identity inconsistencies.',
    body: 'The fraud layer correlates every field in a screening. Cross-field contradictions between the visual inspection zone and the MRZ, manipulation indicators and metadata anomalies raise fraud risk.',
    checks: ['Cross-field discrepancy analysis', 'Visual zone vs MRZ comparison', 'Manipulation indicators', 'Metadata tampering review'],
    preview: [
      { label: 'Cross-field check', value: 'Consistent', tone: 'text-emerald-700' },
      { label: 'VIZ / MRZ cross-validation', value: 'Matched', tone: 'text-emerald-700' },
      { label: 'Manipulation indicators', value: 'None', tone: 'text-emerald-700' },
    ],
  },
  {
    id: 'threat', icon: ShieldAlert, accent: 'threat', title: 'Threat Detection', route: 'screening',
    tagline: 'Catch scams, phishing and fraud attempts.',
    body: 'On-device engines analyze messages, websites, UPI requests, apps and registry matches for scam and social-engineering patterns. Nothing you paste is uploaded unless an operation explicitly requires the backend.',
    checks: ['SMS / WhatsApp scam patterns', 'Phishing & typosquat domain checks', 'UPI & QR request safety', 'APK permission & malware review', 'Scam registry lookups'],
    preview: [
      { label: 'SMS patterns', value: '12 messages', tone: 'text-emerald-700' },
      { label: 'Message scanner', value: '3 risk signals', tone: 'text-amber-700' },
      { label: 'Website checker', value: 'No flags', tone: 'text-emerald-700' },
    ],
  },
  {
    id: 'risk', icon: Gauge, accent: 'risk', title: 'Risk Assessment', route: 'screening',
    tagline: 'A single composite decision.',
    body: 'Every screening produces a composite risk score across identity, document, fraud and threat dimensions, mapped to a clear tier — from verified to critical — with a recommended officer action.',
    checks: ['Composite risk score', 'Identity / document / fraud / threat breakdown', 'Tiered risk labels', 'Recommended decision'],
    preview: [
      { label: 'Composite risk score', value: '13.8/100', tone: 'text-emerald-700' },
      { label: 'Risk tier', value: 'Low — Verified', tone: 'text-emerald-700' },
      { label: 'Recommended decision', value: 'Grant entry', tone: 'text-emerald-700' },
    ],
  },
];

const CATEGORIES = [
  { label: 'Screening', ids: ['identity', 'document', 'fraud', 'threat', 'risk'] },
];

export default function Features({ onNavigate }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter((s) =>
      [s.title, s.tagline, s.body, ...s.checks].join(' ').toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <PageHeading
        eyebrow="Features"
        title="AegisBorder AI Capabilities"
        sub="Integrated screening, analysis and operational intelligence in one platform."
      />

      <div className="mx-auto max-w-6xl px-4 pb-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <nav className="flex flex-wrap gap-2" aria-label="Feature categories">
            {CATEGORIES.map((c) => (
              <a key={c.label} href={`#${c.ids[0]}`} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-navy-300 hover:text-navy-900">
                {c.label}
              </a>
            ))}
          </nav>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features…"
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              aria-label="Search features" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 lg:px-6">
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm font-semibold text-slate-500">No features match "{query}". Try a different term.</p>
        )}
        {filtered.map(({ id, icon: Icon, accent: a, title, tagline, body, checks, preview, route }) => {
          const ac = accent(a);
          const last = filtered[filtered.length - 1].id === id;
          return (
            <section key={id} id={id} className="scroll-mt-20">
              <div className={`grid gap-6 lg:grid-cols-2 lg:items-start ${last ? '' : 'pb-14'}`}>
                <div className="lg:border-r lg:border-slate-200 lg:pr-8">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-md ${ac.soft} ${ac.text}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-navy-900">{title}</h2>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{tagline}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{body}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {checks.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${ac.icon}`} aria-hidden="true" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => onNavigate(route)}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-navy-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-navy-900">
                    Open {title} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className={`rounded-lg border ${ac.border} bg-white shadow-sm`}>
                  <div className={`flex items-center justify-between border-b ${ac.soft} px-4 py-2`}>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Module preview</span>
                    <span className={`flex items-center gap-1 text-[11px] font-bold ${ac.text}`}>
                      <ScanLine className="h-3.5 w-3.5" aria-hidden="true" />
                      {preview ? 'Sample data' : 'Live module'}
                    </span>
                  </div>
                  <div className="p-4">
                    {preview ? (
                      <div className="rounded-md border border-slate-100 bg-white">
                        {preview.map(({ label, value, tone }) => (
                          <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0">
                            <span className="text-xs font-semibold text-slate-500">{label}</span>
                            <span className={`text-xs font-bold ${tone}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-slate-100 bg-white p-4">
                        <p className={`text-xs font-bold ${ac.text}`}>Connected to the live module</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                          This capability opens the actual working feature inside AegisBorder AI — no separate app, no mock workflow.
                        </p>
                        <div className="mt-3 rounded-md bg-slate-50 px-3 py-2">
                          <span className="text-[11px] font-semibold text-slate-500">Destination: </span>
                          <span className="text-[11px] font-bold text-navy-800">
                            {route === 'screening' ? 'New screening (mode selector)' : `AegisBorder AI › ${title}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}