import { useMemo, useState } from 'react';
import {
  LayoutDashboard, ScanLine, History as HistoryIcon, BellRing, FileText, Activity,
  User, UserCheck, ShieldCheck, AlertTriangle, Fingerprint, Settings as SettingsIcon,
  Search, SortAsc, SortDesc, FileDown, Lock, Globe, Monitor, Trash2, LogOut, Check, Clock, KeyRound
} from 'lucide-react';
import {
  Badge, Button, Card, cx, PageHeader, Pagination, downloadCSV, EmptyState, tierSeverityColor
} from '../components/ui';
import { getHistory, getAlerts, resolveAlert, clearHistory, formatTime, tierMeta, kpisFromHistory, threatCategory } from '../lib/store';
import { AlertCard, RiskBadge, SeverityBadge, DetectionBadge, FilterBar, detectionFor } from '../components/Detection';
import { useT, listLanguages } from '../i18n';
import { toast } from '../components/Toast';

const PAGE_SIZE = 8;

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'screenings', label: 'Screenings', icon: ScanLine },
  { id: 'alerts', label: 'Alerts', icon: BellRing },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'account', label: 'Account', icon: SettingsIcon },
];

const RISK_FILTERS = [
  { id: 'verified', label: 'Verified', match: (t) => tierMeta(t).order === 0 },
  { id: 'review', label: 'Review required', match: (t) => tierMeta(t).order === 1 },
  { id: 'flagged', label: 'Flagged', match: (t) => tierMeta(t).order >= 2 },
  { id: 'critical', label: 'Critical', match: (t) => t === 'CRITICAL' },
];

export default function UserProfile({ onNavigate, officer, health, lang, setLang, tab: initialTab = 'overview' }) {
  const { t } = useT();
  const [tab, setTab] = useState(initialTab);

  const screenings = useMemo(() => getHistory(), []);
  const alerts = useMemo(() => getAlerts(), []);
  const kpis = useMemo(() => kpisFromHistory(), []);

  return (
    <div className="workspace">
      <div className="flex w-full flex-col gap-5">
        <PageHeader
          eyebrow="Personal workspace"
          title="AegisBorder AI · User Profile"
          subtitle="Your screenings, cases, alerts and operational activity in one place."
          accent="system"
          icon={User}
        />

        <ProfileBanner officer={officer} onEdit={() => setTab('account')} health={health} />

        <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Profile sections">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={cx('flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold transition-colors',
                tab === id ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100')}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <Overview {...{ onNavigate, officer, screenings, alerts, kpis }} />}
        {tab === 'screenings' && <ScreeningsTab {...{ onNavigate, screenings, officer }} />}
        {tab === 'alerts' && <AlertsTab {...{ alerts }} />}
        {tab === 'reports' && <ReportsTab {...{ onNavigate, screenings }} />}
        {tab === 'activity' && <ActivityTab {...{ screenings, alerts }} />}
        {tab === 'account' && <AccountTab {...{ onNavigate, officer, lang, setLang, health }} />}
      </div>
    </div>
  );
}

function initials(name) {
  return (name || 'O').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function ProfileBanner({ officer, onEdit, health }) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-navy-900 text-lg font-extrabold text-white" aria-hidden="true">
          {initials(officer.name)}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-extrabold text-navy-900">{officer.name}</h2>
            <Badge color="green">Active</Badge>
          </div>
          <p className="text-xs font-mono text-slate-400">{officer.id}</p>
          <p className="mt-0.5 text-xs text-slate-500">{officer.checkpoint} · Immigration Officer</p>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 lg:hidden xl:flex">
          <ShieldCheck className="h-4 w-4 text-navy-700" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-700">Secure session</span>
          <span className="text-[10px] text-slate-400">· {health?.state === 'online' ? 'Backend online' : 'Session-local mode'}</span>
        </div>
      </div>
      <Button variant="secondary" onClick={onEdit} className="justify-center">
        <SettingsIcon className="h-4 w-4" /> Edit profile &amp; settings
      </Button>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone, hint }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        <Icon className={cx('h-4 w-4', tone)} aria-hidden="true" />
      </div>
      <div className="mt-2 text-2xl font-extrabold tabular-nums text-navy-900">{value}</div>
      {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
    </Card>
  );
}

function Overview({ onNavigate, screenings, alerts, kpis }) {
  const unread = alerts.filter((a) => !a.resolution).length;
  const flagged = screenings.filter((r) => tierMeta(r.riskTier).order >= 2 || r.watchlistFlagged);
  const pending = alerts.filter((a) => !a.resolution).slice(0, 5);
  const recent = screenings.slice(0, 6);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-5">
        <Kpi icon={ScanLine} label="Screenings" value={kpis.screened} tone="text-navy-700" hint="This session" />
        <Kpi icon={UserCheck} label="Verified" value={kpis.cleared} tone="text-emerald-600" hint="Cleared" />
        <Kpi icon={AlertTriangle} label="Pending review" value={kpis.review} tone="text-amber-600" hint="Moderate risk" />
        <Kpi icon={ShieldCheck} label="Flagged cases" value={kpis.alerts} tone="text-red-600" hint="Attention" />
        <Kpi icon={BellRing} label="Unread alerts" value={unread} tone="text-orange-600" hint="In alert center" />
      </div>

      <Card className="p-5 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-900">Recent screenings</h3>
          <button onClick={() => onNavigate('history')} className="text-xs font-bold text-navy-700 hover:underline">View all</button>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={ScanLine} title="No screenings yet" hint="Run a screening to see it here." actionLabel="Start screening" onAction={() => onNavigate('screening')} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 py-2.5">
                <Fingerprint className="h-4 w-4 shrink-0 text-navy-400" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-navy-900">{r.person}</p>
                  <p className="text-[11px] text-slate-400">{r.id} · {formatTime(r.ts)} · {threatCategory(r)}</p>
                </div>
                <RiskBadge tier={r.riskTier} />
                <button onClick={() => onNavigate('history')} className="text-xs font-bold text-navy-700 hover:underline">Open</button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-900">Requires your attention</h3>
          <button onClick={() => onNavigate('alerts')} className="text-xs font-bold text-navy-700 hover:underline">Alerts</button>
        </div>
        {pending.length === 0 ? (
          <EmptyState icon={BellRing} title="All clear" hint="No unhandled alerts." small />
        ) : (
          <ul className="space-y-2">
            {pending.map((a) => (
              <li key={a.id} className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 p-2.5">
                <SeverityBadge severity={a.severity} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-navy-900">{a.title}</p>
                  <p className="text-[11px] text-slate-400">{a.person || a.id}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {flagged.length > 0 && (
          <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-extrabold text-orange-800">{flagged.length} flagged {flagged.length === 1 ? 'case' : 'cases'}</p>
            <button onClick={() => onNavigate('history')} className="mt-1 text-xs font-bold text-orange-800 hover:underline">Review in history</button>
          </div>
        )}
      </Card>

      <Card className="p-5 lg:col-span-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-navy-900">Quick actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onNavigate('screening')}><ScanLine className="h-4 w-4" /> New screening</Button>
            <Button variant="secondary" onClick={() => onNavigate('dashboard')}><LayoutDashboard className="h-4 w-4" /> Dashboard</Button>
            <Button variant="secondary" onClick={() => onNavigate('reports')}><FileText className="h-4 w-4" /> Reports</Button>
            <Button variant="secondary" onClick={() => onNavigate('analytics')}><Activity className="h-4 w-4" /> Analytics</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScreeningsTab({ onNavigate, screenings, officer }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'ts', dir: 'desc' });
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return screenings
      .filter((r) => {
        if (filter !== 'all') {
          const f = RISK_FILTERS.find((x) => x.id === filter);
          if (f && !f.match(r.riskTier)) return false;
        }
        if (q && ![r.person, r.documentNumber, r.id, r.nationality].some((v) => String(v || '').toLowerCase().includes(q))) return false;
        return true;
      })
      .sort((a, b) => {
        const va = a[sort.key] ?? '';
        const vb = b[sort.key] ?? '';
        const cmp = sort.key === 'ts' ? new Date(va) - new Date(vb) : String(va).localeCompare(String(vb));
        return sort.dir === 'asc' ? cmp : -cmp;
      });
  }, [screenings, query, filter, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const view = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const activeChips = [
    { key: 'risk', label: `Risk: ${RISK_FILTERS.find((x) => x.id === filter)?.label || 'All'}` },
  ].filter(() => filter !== 'all');

  const sortBtn = (key, label) => (
    <button onClick={() => sort.key === key ? setSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }) : setSort({ key, dir: 'desc' })}
      className="flex items-center gap-1 font-bold hover:text-navy-900" aria-label={`Sort by ${label}`}>
      {label}
      {sort.key === key && (sort.dir === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
    </button>
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search by name, document or case ID…" className="ctl-input pl-9" aria-label="Search screenings" />
        </div>
        <div className="flex flex-wrap gap-1">
          <button onClick={() => { setFilter('all'); setPage(0); }}
            className={cx('rounded-md border px-3 py-1.5 text-xs font-bold', filter === 'all' ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}>All</button>
          {RISK_FILTERS.map(({ id, label }) => (
            <button key={id} onClick={() => { setFilter(filter === id ? 'all' : id); setPage(0); }}
              className={cx('rounded-md border px-3 py-1.5 text-xs font-bold', filter === id ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}>{label}</button>
          ))}
        </div>
        <Button variant="secondary" className="ml-auto" onClick={() => downloadCSV(`aegisborder_profile_screenings_${Date.now()}.csv`, t('history_csv_head').split('|'), filtered.map((r) => [r.id, r.person, r.documentNumber, r.riskScore, r.riskTier, r.decision, formatTime(r.ts), officer.id]))}>
          <FileDown className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <FilterBar chips={activeChips} count={filtered.length} onRemove={() => setFilter('all')} onClear={() => setFilter('all')} />

      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState icon={Search} title="No screenings match" hint="Try a different search or clear the filters." />
        </Card>
      ) : (
        <>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{sortBtn('id', 'Case')}</th>
                  <th>{sortBtn('person', 'Subject')}</th>
                  <th>{sortBtn('documentNumber', 'Document')}</th>
                  <th>{sortBtn('riskScore', 'Risk')}</th>
                  <th>Detection</th>
                  <th>{sortBtn('decision', 'Decision')}</th>
                  <th>{sortBtn('ts', 'Date & time')}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {view.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-[11px]">{r.id}</td>
                    <td className="font-semibold text-navy-900">{r.person}</td>
                    <td>{r.documentNumber}<span className="block text-[11px] text-slate-400">{r.nationality || '—'}</span></td>
                    <td><RiskBadge tier={r.riskTier} /> <span className="ml-1 text-[11px] text-slate-500">{r.riskScore}%</span></td>
                    <td><DetectionBadge type={detectionFor(r.riskTier, r.watchlistFlagged, r.operationType)} /></td>
                    <td>{r.decision}</td>
                    <td>{formatTime(r.ts)}</td>
                    <td>
                      <button onClick={() => onNavigate('history')} className="text-xs font-bold text-navy-700 hover:underline">Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={safePage} pages={pages} total={filtered.length} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function AlertsTab({ alerts }) {
  const [seg, setSeg] = useState('all');
  const [severity, setSeverity] = useState('all');

  const filtered = useMemo(() => alerts.filter((a) => {
    if (seg === 'unread' && a.resolution) return false;
    if (seg === 'critical' && a.severity !== 'Critical') return false;
    if (severity !== 'all' && a.severity !== severity) return false;
    return true;
  }).sort((a, b) => new Date(b.ts) - new Date(a.ts)), [alerts, seg, severity]);

  const mark = (a) => {
    const next = a.resolution ? null : 'handled';
    resolveAlert(a.id, next);
    toast(next ? 'Alert marked as handled.' : 'Alert marked as unread.', { type: 'info', title: 'Alert updated' });
    window.dispatchEvent(new Event('rakshak-store-update'));
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'unread', 'critical'].map((s) => (
          <button key={s} onClick={() => setSeg(s)}
            className={cx('rounded-md border px-3 py-1.5 text-xs font-bold capitalize', seg === s ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}>{s}</button>
        ))}
        <div className="ml-auto flex flex-wrap gap-1">
          {['all', 'Low', 'Moderate', 'High', 'Critical'].map((s) => (
            <button key={s} onClick={() => setSeverity(s)}
              className={cx('rounded-md border px-2 py-1 text-[11px] font-bold', severity === s ? 'border-navy-400 bg-navy-50 text-navy-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6"><EmptyState icon={BellRing} title="No alerts here" hint="No alerts match the current filters." /></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((a) => (
            <AlertCard key={a.id} alert={a} onReview={mark} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportsTab({ onNavigate, screenings }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = screenings.filter((r) => !q || [r.person, r.id].some((v) => String(v || '').toLowerCase().includes(q)));

  if (list.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState icon={FileText} title="No reports yet" hint="Reports are generated from completed screenings." actionLabel="Run a screening" onAction={() => onNavigate('screening')} />
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports…" className="ctl-input pl-9" aria-label="Search reports" />
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr><th>Subject</th><th>Detections</th><th>Risk</th><th>Result</th><th>Created</th><th>Action</th></tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td><span className="font-semibold text-navy-900">{r.person}</span><span className="block font-mono text-[11px] text-slate-400">{r.id}</span></td>
                <td><DetectionBadge type={detectionFor(r.riskTier, r.watchlistFlagged, r.operationType)} /></td>
                <td><RiskBadge tier={r.riskTier} /></td>
                <td>{r.decision}</td>
                <td>{formatTime(r.ts)}</td>
                <td><button onClick={() => onNavigate('reports')} className="text-xs font-bold text-navy-700 hover:underline">Open report</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityTab({ screenings, alerts }) {
  const items = useMemo(() => {
    const list = [
      ...screenings.map((r) => ({
        ts: r.ts, kind: 'screening', icon: ScanLine, tone: 'text-navy-600',
        title: `Screening performed — ${r.person}`,
        detail: `${threatCategory(r)} · ${r.decision} · ${r.id}`,
        badge: <RiskBadge tier={r.riskTier} />,
      })),
      ...alerts.map((a) => ({
        ts: a.ts, kind: 'alert', icon: BellRing, tone: 'text-orange-600',
        title: `Alert raised — ${a.title}`,
        detail: a.person || a.id,
        badge: <SeverityBadge severity={a.severity} />,
      })),
    ];
    return list.sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [screenings, alerts]);

  const [kind, setKind] = useState('all');
  const filtered = items.filter((i) => kind === 'all' || i.kind === kind);

  return (
    <div className="grid gap-4">
      <div>
        <button onClick={() => setKind('all')} className={cx('rounded-md border px-3 py-1.5 text-xs font-bold', kind === 'all' ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}>All</button>{' '}
        <button onClick={() => setKind('screening')} className={cx('rounded-md border px-3 py-1.5 text-xs font-bold', kind === 'screening' ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}>Screenings</button>{' '}
        <button onClick={() => setKind('alert')} className={cx('rounded-md border px-3 py-1.5 text-xs font-bold', kind === 'alert' ? 'border-navy-800 bg-navy-800 text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}>Alerts</button>
      </div>
      {filtered.length === 0 ? (
        <Card className="p-6"><EmptyState icon={Activity} title="No activity yet" hint="Screening activity appears here as you work." /></Card>
      ) : (
        <ol className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {filtered.slice(0, 40).map((x, i) => {
            const Icon = x.icon;
            return (
              <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
                <span className="flex flex-col items-center" aria-hidden="true">
                  <span className={cx('flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white', x.tone)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {i < filtered.slice(0, 40).length - 1 && <span className="w-px flex-1 bg-slate-200" />}
                </span>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy-900">{x.title}</p>
                    <span className="text-[11px] text-slate-400">{formatTime(x.ts)}</span>
                  </div>
                  <p className="text-xs text-slate-500">{x.detail}</p>
                  <div className="mt-1.5">{x.badge}</div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function AccountTab({ onNavigate, officer, lang, setLang, health }) {
  const [name, setName] = useState(officer.name);
  const [checkpoint, setCheckpoint] = useState(officer.checkpoint);
  const [motion, setMotion] = useState(() => localStorage.getItem('rakshak_reduced_motion') === '1');
  const [savedId, setSavedId] = useState(null);
  const langs = listLanguages();

  const save = (section) => {
    if (section === 'officer') localStorage.setItem('rakshak_officer', JSON.stringify({ ...officer, name, checkpoint }));
    if (section === 'motion') {
      localStorage.setItem('rakshak_reduced_motion', motion ? '1' : '0');
      document.documentElement.classList.toggle('reduce-motion', motion);
    }
    setSavedId(section);
    setTimeout(() => setSavedId(null), 1800);
    toast('Preferences saved.', { type: 'success', title: 'Saved' });
  };

  const reset = () => {
    clearHistory();
    window.dispatchEvent(new Event('rakshak-store-update'));
    toast('Screening history cleared.', { type: 'info', title: 'Workspace reset' });
    onNavigate('dashboard');
  };

  const signOut = () => {
    localStorage.removeItem('rakshak_officer');
    toast('Signed out of this workspace.', { type: 'info', title: 'Session reset' });
    onNavigate('home');
  };

  const savedChip = (id) => savedId === id && <Badge color="green"><Check className="h-3 w-3" /> Saved</Badge>;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-navy-700" aria-hidden="true" />
          <h3 className="text-sm font-bold text-navy-900">Profile</h3>
          <span className="ml-auto">{savedChip('officer')}</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="ctl-label">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="ctl-input" />
          </div>
          <div>
            <label className="ctl-label">Officer ID</label>
            <input value={officer.id} disabled className="ctl-input font-mono opacity-60" />
          </div>
          <div className="sm:col-span-2">
            <label className="ctl-label">Checkpoint / counter</label>
            <input value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)} className="ctl-input" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => save('officer')}>Save profile</Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-navy-700" aria-hidden="true" />
          <h3 className="text-sm font-bold text-navy-900">Language</h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3">
          {langs.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className={cx('rounded-md border px-2 py-1.5 text-left text-xs font-semibold', lang === l.code ? 'border-navy-400 bg-navy-50 text-navy-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
              <span className="block truncate font-bold">{l.native}</span>
              <span className="block truncate text-[10px] text-slate-400">{l.name}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-navy-700" aria-hidden="true" />
          <h3 className="text-sm font-bold text-navy-900">Preferences</h3>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3">
            <div>
              <p className="text-sm font-semibold text-navy-900">Reduced motion</p>
              <p className="text-xs text-slate-500">Minimise animations and transitions across the interface.</p>
            </div>
            <button role="switch" aria-checked={motion} aria-label="Reduced motion" onClick={() => { setMotion(!motion); save('motion'); }}
              className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors', motion ? 'bg-navy-800' : 'bg-slate-300')}>
              <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', motion ? 'translate-x-5' : 'translate-x-0.5')} />
            </button>
          </div>
          <div className="rounded-md border border-slate-200 p-3">
            <p className="text-sm font-semibold text-navy-900">Workspace data</p>
            <p className="text-xs text-slate-500">All screening records are stored locally for this session only.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="danger" onClick={reset}><Trash2 className="h-4 w-4" /> Clear screening history</Button>
              <Button variant="secondary" onClick={() => onNavigate('settings')}><SettingsIcon className="h-4 w-4" /> System settings</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-navy-700" aria-hidden="true" />
          <h3 className="text-sm font-bold text-navy-900">Security &amp; session</h3>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <dt className="text-xs font-semibold text-slate-500">Session</dt>
            <dd className="flex items-center gap-1.5 text-xs font-bold text-emerald-700"><Check className="h-3.5 w-3.5" aria-hidden="true" /> Active</dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <dt className="text-xs font-semibold text-slate-500">Storage</dt>
            <dd className="text-xs font-bold text-slate-700">Session-local (this device)</dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <dt className="text-xs font-semibold text-slate-500">Backend</dt>
            <dd className="text-xs font-bold capitalize text-slate-700">{health?.state || 'checking'}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <dt className="text-xs font-semibold text-slate-500">Officer ID</dt>
            <dd className="font-mono text-xs text-slate-700">{officer.id}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <Button variant="danger" onClick={signOut}><LogOut className="h-4 w-4" /> Reset session</Button>
        </div>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-navy-700" aria-hidden="true" />
          <h3 className="text-sm font-bold text-navy-900">App session</h3>
          <span className="ml-auto text-xs text-slate-400">Current version 1.0.0</span>
        </div>
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
          This workspace stores screening history, alerts and officer details in local browser storage so records persist for the current session.
          No data leaves this device unless an operation explicitly requires the backend. Sign out to reset the session.
        </div>
      </Card>
    </div>
  );
}