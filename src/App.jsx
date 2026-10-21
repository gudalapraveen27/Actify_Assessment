import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDown, ArrowDownUp, ArrowUp, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, Download, Ellipsis, FileSpreadsheet, Plus, Search, SlidersHorizontal, Users, X } from 'lucide-react';
import { addAccount, deleteAccount, selectAccounts, updateAccount } from './features/accounts/accountsSlice';
import { getPage, selectVisibleAccounts } from './utils/accountData';
import { exportAccounts } from './utils/exportToExcel';
import { statusesList } from './data/dummyAccounts';
import AccountForm from './components/AccountForm';

const columns = [{ key: 'name', label: 'ACCOUNT NAME' }, { key: 'email', label: 'EMAIL' }, { key: 'phone', label: 'PHONE NUMBER' }, { key: 'website', label: 'WEBSITE' }, { key: 'industry', label: 'INDUSTRY' }, { key: 'status', label: 'STATUS' }, { key: 'remark', label: 'REMARK' }];
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function App() {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const filteredAccounts = useMemo(() => selectVisibleAccounts(accounts, query, statusFilter, sort), [accounts, query, statusFilter, sort]);
  const pagination = getPage(filteredAccounts, page);
  useEffect(() => { setPage((current) => Math.min(current, pagination.totalPages)); }, [pagination.totalPages]);
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 3000); return () => window.clearTimeout(timeout); }, [toast]);
  useEffect(() => { const close = (event) => { if (event.key === 'Escape') setOpenMenu(null); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);

  const saveAccount = (values) => {
    if (dialog?.type === 'edit') { dispatch(updateAccount({ ...values, id: dialog.account.id })); setToast('Account updated successfully'); }
    else { dispatch(addAccount(values)); setPage(1); setToast('Account added successfully'); }
    setDialog(null);
  };
  const removeAccount = (account) => {
    if (window.confirm(`Delete ${account.name}? This action cannot be undone.`)) { dispatch(deleteAccount(account.id)); setToast('Account deleted'); setOpenMenu(null); }
  };
  const toggleSort = (key) => { setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }); setPage(1); };
  const isFiltered = Boolean(query.trim()) || statusFilter !== 'All statuses';
  const handleExport = async () => { if (!await exportAccounts(filteredAccounts, isFiltered)) setToast('There are no matching accounts to export'); else setToast(`Exported ${filteredAccounts.length} ${filteredAccounts.length === 1 ? 'account' : 'accounts'} to Excel`); };

  return <main className="app-shell">
    <aside className="sidebar"><a href="#main" className="sidebar-brand"><img src="/actify-logo.png" alt="Actify Business"/><span>CRM Portal</span></a><nav aria-label="Main navigation"><a className="nav-item" href="#main"><Building2 size={15}/> Dashboard</a><div className="nav-section-title"><Users size={15}/> Account <ChevronDown size={14}/></div><a className="nav-item nav-active" href="#main"><Building2 size={15}/> Accounts</a><a className="nav-item" href="#main"><SlidersHorizontal size={15}/> Account Report</a><a className="nav-item" href="#main"><Download size={15}/> Account Upload</a><a className="nav-item nav-parent" href="#main"><Users size={15}/> Contact <ChevronDown size={14}/></a><a className="nav-item nav-parent" href="#main"><Users size={15}/> Lead <ChevronDown size={14}/></a><a className="nav-item nav-parent" href="#main"><Building2 size={15}/> Deal <ChevronDown size={14}/></a><a className="nav-item" href="#main"><FileSpreadsheet size={15}/> Feedback</a></nav><div className="sidebar-footer">ACTIFY BUSINESS</div></aside>
    <div className="workspace"><header className="topbar"><div className="welcome-label">Welcome back, <strong>John</strong></div><div className="topbar-right"><span className="avatar avatar-user">JD</span><button className="signout-button" type="button" onClick={() => setToast('You are signed in as John')}>Sign out</button></div></header>
    <section className="page-wrap" id="main">
      <div className="page-tabs"><button className="tab-active" type="button">Account</button><button type="button" onClick={() => setDialog({ type: 'add' })}><Plus size={14}/> Create</button></div>
      <div className="page-heading"><div><div className="eyebrow">ACTIFY BUSINESS · ACCOUNTS</div><h1>Account Lists <span className="count-pill">{accounts.length}</span></h1><p>Here’s a list of your accounts.</p></div></div>
      <section className="table-card" aria-label="Accounts directory">
        <div className="table-card-heading"><div><h2>Accounts</h2><span className="table-subtitle">Browse and manage your account records</span></div><span className="live-indicator"><span/> Up to date</span></div>
        <div className="toolbar"><label className="search-box"><Search size={17}/><input type="search" placeholder="Search accounts…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} aria-label="Search all accounts"/>{query && <button aria-label="Clear search" onClick={() => { setQuery(''); setPage(1); }}><X size={15}/></button>}<kbd>⌘ K</kbd></label><div className="toolbar-actions"><div className="filter-wrap"><button className={`button button-light filter-button ${statusFilter !== 'All statuses' ? 'filter-active' : ''}`} onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}><SlidersHorizontal size={16}/><span>Filter</span>{statusFilter !== 'All statuses' && <i/>}</button>{showFilters && <div className="filter-popover"><label htmlFor="status-filter">Account status</label><select id="status-filter" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option>All statuses</option>{statusesList.map((status) => <option key={status}>{status}</option>)}</select>{statusFilter !== 'All statuses' && <button className="reset-filter" onClick={() => { setStatusFilter('All statuses'); setPage(1); }}>Clear filter</button>}</div>}</div><button className="button button-light export-button" onClick={handleExport}><FileSpreadsheet size={16}/><span>Download Excel</span></button></div></div>
        <div className="active-filter-line">{(query || statusFilter !== 'All statuses') && <><span>Showing {filteredAccounts.length} results{query && <> for <strong>“{query}”</strong></>}{statusFilter !== 'All statuses' && <> · {statusFilter}</>}</span><button onClick={() => { setQuery(''); setStatusFilter('All statuses'); setPage(1); }}>Clear all</button></>}</div>
        <div className="table-scroll"><table><thead><tr>{columns.map((column) => <th key={column.key} aria-sort={sort.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}><button className="sort-button" onClick={() => toggleSort(column.key)}>{column.label}{sort.key === column.key ? (sort.direction === 'asc' ? <ArrowUp size={13}/> : <ArrowDown size={13}/>) : <ArrowDownUp className="sort-muted" size={13}/>}</button></th>)}<th className="action-heading"><span className="sr-only">Actions</span></th></tr></thead><tbody>
          {pagination.records.map((account) => <tr key={account.id}><td><div className="account-name-cell"><span className={`avatar company-avatar avatar-tone-${(account.name.charCodeAt(0) + account.name.length) % 6}`}>{initials(account.name)}</span><span className="account-name-text">{account.name}</span></div></td><td><a className="email-link" href={`mailto:${account.email}`}>{account.email}</a></td><td className="muted-cell">{account.phone}</td><td><a className="website-link" href={account.website} target="_blank" rel="noreferrer">{account.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}</a></td><td><span className="industry-cell">{account.industry}</span></td><td><span className={`status-badge status-${account.status.toLowerCase()}`}><i/>{account.status}</span></td><td className="remark-cell">{account.remark || <span className="empty-remark">—</span>}</td><td className="row-actions"><button className="icon-button row-menu-button" aria-label={`Actions for ${account.name}`} aria-expanded={openMenu === account.id} onClick={() => setOpenMenu((current) => current === account.id ? null : account.id)}><Ellipsis size={19}/></button>{openMenu === account.id && <div className="row-menu"><button onClick={() => { setDialog({ type: 'edit', account }); setOpenMenu(null); }}>Edit account</button><button className="danger-text" onClick={() => removeAccount(account)}>Delete account</button></div>}</td></tr>)}
          {!pagination.records.length && <tr><td colSpan="8"><div className="empty-state"><span className="empty-icon"><FileSpreadsheet size={23}/></span><strong>{query || statusFilter !== 'All statuses' ? 'No accounts found' : 'No accounts yet'}</strong><p>{query || statusFilter !== 'All statuses' ? 'Try adjusting your search or filters.' : 'Add your first account to get started.'}</p>{query || statusFilter !== 'All statuses' ? <button className="button button-light" onClick={() => { setQuery(''); setStatusFilter('All statuses'); }}>Clear search &amp; filters</button> : <button className="button button-primary" onClick={() => setDialog({ type: 'add' })}><Plus size={16}/> Add account</button>}</div></td></tr>}
        </tbody></table></div>
        <footer className="pagination"><span className="results-count">Showing <strong>{pagination.start}–{pagination.end}</strong> of <strong>{filteredAccounts.length}</strong> accounts</span><div className="pagination-controls"><button className="button button-light page-button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft size={16}/><span>Previous</span></button><span className="page-indicator">Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong></span><button className="button button-light page-button" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}><span>Next</span><ChevronRight size={16}/></button></div><span className="rows-per-page">10 per page</span></footer>
      </section><div className="page-footer"><span>© 2025 Account Atlas</span><span>Built for better business relationships <span className="footer-heart">✳</span></span></div>
    </section></div>
    {toast && <div className="toast" role="status"><span className="toast-check"><Check size={15}/></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15}/></button></div>}
    {dialog && <AccountForm account={dialog.type === 'edit' ? dialog.account : null} onClose={() => setDialog(null)} onSave={saveAccount}/>}
  </main>;
}
