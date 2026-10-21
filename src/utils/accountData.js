export const PAGE_SIZE = 10;
export const SORT_FIELDS = { name: 'name', email: 'email', phone: 'phone', website: 'website', industry: 'industry', status: 'status', remark: 'remark' };

export function selectVisibleAccounts(accounts, query, statusFilter, sort) {
  const needle = query.trim().toLocaleLowerCase();
  const filtered = accounts.filter((account) => {
    const matchesQuery = !needle || Object.values(account).some((value) => String(value).toLocaleLowerCase().includes(needle));
    return matchesQuery && (statusFilter === 'All statuses' || account.status === statusFilter);
  });
  if (!sort?.key) return filtered;
  const direction = sort.direction === 'desc' ? -1 : 1;
  return filtered.map((account, index) => ({ account, index })).sort((a, b) => {
    const left = String(a.account[sort.key] ?? '').toLocaleLowerCase();
    const right = String(b.account[sort.key] ?? '').toLocaleLowerCase();
    if (!left && right) return 1;
    if (left && !right) return -1;
    const comparison = left.localeCompare(right, undefined, { numeric: true });
    return comparison === 0 ? a.index - b.index : comparison * direction;
  }).map(({ account }) => account);
}

export function getPage(accounts, page) {
  const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return { records: accounts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), page: safePage, totalPages, start: accounts.length ? (safePage - 1) * PAGE_SIZE + 1 : 0, end: Math.min(safePage * PAGE_SIZE, accounts.length) };
}
