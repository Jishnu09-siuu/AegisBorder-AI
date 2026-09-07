import {
  Fingerprint, FileSearch, ShieldAlert, AlertTriangle, Gauge, ArrowRight, ArrowDown, CheckCircle2,
  FileCheck2, ScanLine, Crosshair, Landmark, BarChart3
} from 'lucide-react';
import { accent } from '../../components/ui';

const STRIP = [
  { icon: Fingerprint, label: 'Identity', accent: 'identity' },
  { icon: FileSearch, label: 'Documents', accent: 'document' },
  { icon: AlertTriangle, label: 'Fraud', accent: 'fraud' },
  { icon: ShieldAlert, label: 'Threats', accent: 'threat' },
  { icon: Gauge, label: 'Risk', accent: 'risk' },
];

const FEATURES = [
  { icon: Fingerprint, accent: 'identity', title: 'Identity Verification', text: 'Biometric capture, face comparison and liveness checks against the travel document.' },
  { icon: FileCheck2, accent: 'document', title: 'Document Screening', text: 'MRZ validation, OCR extraction, tamper forensics and metadata analysis for travel documents.' },
  { icon: ShieldAlert, accent: 'threat', title: 'Threat Detection', text: 'On-device engines flag scams, phishing, payment fraud, and malware — no data leaves the device.' },
  { icon: AlertTriangle, accent: 'fraud', title: 'Fraud Detection', text: 'Cross-field inconsistencies, manipulation indicators and anomaly review for forged documents.' },
  { icon: Gauge, accent: 'risk', title: 'Risk Assessment', text: 'A composite risk score across identity, document, fraud and threat dimensions with a clear recommendation.' },
  { icon: BarChart3, accent: 'analytics', title: 'Analytics & Reporting', text: 'Screening activity, risk distribution, audit certificates and exportable session reports.' },
];

const PROCESS = [
  { n: '01', title: 'Submit', text: 'Upload a document scan or paste the MRZ string.' },
  { n: '02', title: 'Verify', text: 'Identity verification against the document portrait.' },
  { n: '03', title: 'Screen', text: 'Module-by-module document and fraud screening.' },
  { n: '04', title: 'Assess', text: 'Composite risk scoring with a recommended decision.' },
  { n: '05', title: 'Review', text: 'Structured officer review and audit trail.' },
];

const PILLARS = [
  { title: 'Multi-Layer Screening', text: 'Unified screening across identity, documents, fraud and threats — not a single signal.' },
  { title: 'Risk-Based Analysis', text: 'Prioritise cases that require attention with tiered risk labels.' },
  { title: 'Operational Visibility', text: 'Clear screening results, case history and activity trends in one console.' },
  { title: 'Auditable Workflow', text: 'Structured review with a signed audit certificate for every completed case.' },
];

const PIPELINE = [
  'Document',
  'Identity Verification',
  'Document Analysis',
  'Fraud Detection',
  'Threat Detection',
  'Risk Assessment',
  'Screening Decision',
];

export default function Home({ onNavigate }) {
  const enter = () => onNavigate('dashboard');
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-6 lg:py-20">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-navy-700">
              <ScanLine className="h-3.5 w-3.5" aria-hidden="true" /> Smart border screening platform
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl">
              Secure Border Screening.<br />Intelligent Identity Verification.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              AegisBorder AI brings document screening, identity verification, fraud detection,
              threat assessment and risk analysis into one unified screening platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={enter}
                className="flex items-center gap-2 rounded-md bg-navy-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-navy-900">
                Open Operations <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button onClick={() => onNavigate('features')}
                className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-navy-400 hover:text-navy-900">
                Explore Capabilities
              </button>
            </div>
          </div>

          {/* Hero visual — screening pipeline */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-label="Screening pipeline">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Screening pipeline</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Engine ready
              </span>
            </div>
            <ol className="space-y-0">
              {PIPELINE.map((step, i) => (
                <li key={step}>
                  <div className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50">
                    <div className={i === PIPELINE.length - 1
                      ? 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white'
                      : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white'}>
                      {i === PIPELINE.length - 1
                        ? <Gauge className="h-4 w-4" aria-hidden="true" />
                        : <span className="text-[11px] font-bold">{i + 1}</span>}
                    </div>
                    <span className={i === PIPELINE.length - 1
                      ? 'text-sm font-bold text-red-700'
                      : 'text-sm font-semibold text-slate-700'}>{step}</span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="ml-[2.625rem] py-0.5 text-navy-300" aria-hidden="true"><ArrowDown className="h-3.5 w-3.5" /></div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* TRUST / CAPABILITY STRIP */}
      <section className="border-b border-slate-200 bg-white" aria-label="Capabilities">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-10 sm:grid-cols-3 md:grid-cols-5 lg:px-6">
          {STRIP.map(({ icon: Icon, label, accent: a }) => {
            const ac = accent(a);
            return (
              <div key={label} className="flex items-center gap-2.5">
                <span className={cxBox(ac)}><Icon className="h-4 w-4" aria-hidden="true" /></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <div className="max-w-2xl">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-navy-600">What AegisBorder AI does</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-[26px]">One Platform. Multiple Layers of Screening.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.slice(0, 5).map(({ icon: Icon, accent: a, title, text }) => {
            const ac = accent(a);
            return (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className={cxBox(ac)}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-3 text-sm font-extrabold text-navy-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES PREVIEW */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-navy-600">Screening capabilities</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-[26px]">Six layers. One workflow.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, accent: a, title, text }) => {
              const ac = accent(a);
              return (
                <div key={title} className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className={cxBox(ac)}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="h-1.5 w-10 rounded-full" style={{ background: ac.bar }} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{text}</p>
                  <button onClick={() => onNavigate('features')}
                    className="mt-4 flex items-center gap-1 text-xs font-bold text-navy-700 hover:underline">
                    Learn More <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-navy-600">How it works</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-[26px]">From submission to audited decision.</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map(({ n, title, text }, i) => (
            <li key={n} className="relative">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-2xl font-extrabold text-navy-200">{n}</span>
                <h3 className="mt-1 text-sm font-extrabold uppercase tracking-wide text-navy-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{text}</p>
              </div>
              {i < PROCESS.length - 1 && (
                <ArrowRight className="absolute -right-5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-slate-300 lg:block" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* WHY */}
      <section className="border-y border-slate-200 bg-navy-950">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-navy-300">Why AegisBorder AI</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-[26px]">Built for operational clarity.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ title, text }) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <Crosshair className="h-5 w-5 text-navy-300" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-extrabold text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-6">
        <Landmark className="mx-auto h-8 w-8 text-navy-700" aria-hidden="true" />
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">Ready to begin secure screening?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Enter the operational portal to run document and identity screenings with risk-based decisions.
        </p>
        <button onClick={enter}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy-800 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-navy-900">
          Open Operations <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

function cxBox(ac) {
  const { soft, text } = ac;
  return `flex h-10 w-10 items-center justify-center rounded-md ${soft} ${text}`;
}