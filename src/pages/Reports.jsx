import { useMemo, useState } from 'react';
import { FileText, ArrowDownToLine, FileDown, ShieldCheck } from 'lucide-react';
import { Badge, Button, EmptyState, PageHeader } from '../components/ui';
import { getHistory, formatTime, tierMeta, OPERATION_LABELS } from '../lib/store';
import AuditReport from '../components/AuditReport';
import ThreatReport from '../components/operations/ThreatReport';
import { useT } from '../i18n';

export default function Reports() {
  const { t } = useT();
  const records = useMemo(() => getHistory(), []);
  const [selected, setSelected] = useState(null);

  return (
    <div className="workspace">
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          eyebrow={t('nav_reports')}
          title={t('reports_title')}
          subtitle={t('reports_note')}
          accent="analytics"
          icon={FileText}
          actions={
            <Button variant="secondary" onClick={() => window.print()} disabled={records.length === 0}>
              <FileDown className="h-4 w-4" /> {t('print')}
            </Button>
          }
        />

        {records.length === 0 ? (
          <EmptyState icon={<FileText className="h-8 w-8 text-slate-300" />} title={t('no_reports')}
            hint={t('no_reports_hint')} />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {records.map((r) => {
              const meta = tierMeta(r.riskTier);
              const audit = r.full?.audit_report || {};
              const kind = r.operationType ? (OPERATION_LABELS[r.operationType] || r.operationType) : 'Document & Identity Screening';
              return (
                <div key={r.id} className="flex flex-col rounded-md border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-navy-700" aria-hidden="true" />
                        <span className="font-mono text-xs font-bold text-navy-800">{audit.audit_id || r.id}</span>
                      </div>
                      <div className="mt-0.5 truncate text-sm font-semibold text-slate-900">{r.person}</div>
                      <div className="truncate text-xs text-slate-400">{r.documentNumber || kind} · {formatTime(r.ts)}</div>
                    </div>
                    <Badge color={meta.color}>{t('tier_' + r.riskTier)}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">{r.decision} · <strong className="tabular-nums">{r.riskScore}%</strong></span>
                    <Button variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => setSelected(r)}>
                      <ArrowDownToLine className="h-3.5 w-3.5" /> {t('open_report')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (selected.operationType
        ? <ThreatReport record={selected} onClose={() => setSelected(null)} />
        : selected.full && <AuditReport screening={selected.full} onClose={() => setSelected(null)} />)}
    </div>
  );
}