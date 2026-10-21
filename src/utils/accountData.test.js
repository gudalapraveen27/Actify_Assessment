import { describe, expect, it } from 'vitest';
import { dummyAccounts } from '../data/dummyAccounts';
import { getPage, selectVisibleAccounts } from './accountData';

describe('account data pipeline', () => {
  it('provides 60 unique records and pages them in groups of ten', () => {
    expect(dummyAccounts).toHaveLength(60);
    expect(new Set(dummyAccounts.map((account) => account.id)).size).toBe(60);
    expect(getPage(dummyAccounts, 1).records).toHaveLength(10);
    expect(getPage(dummyAccounts, 6).records).toHaveLength(10);
    expect(getPage(dummyAccounts, 9).page).toBe(6);
  });

  it('searches all fields across the whole dataset without case sensitivity', () => {
    expect(selectVisibleAccounts(dummyAccounts, 'NORTHSTAR', 'All statuses').map((account) => account.id)).toContain('acct-001');
    expect(selectVisibleAccounts(dummyAccounts, '+1 (555) 259-', 'All statuses').map((account) => account.id)).toContain('acct-060');
    expect(selectVisibleAccounts(dummyAccounts, 'technology', 'All statuses').length).toBeGreaterThan(1);
  });

  it('combines filters, stable sorting, and pagination', () => {
    const active = selectVisibleAccounts(dummyAccounts, '', 'Active', { key: 'name', direction: 'asc' });
    expect(active.every((account) => account.status === 'Active')).toBe(true);
    expect(active.map((account) => account.name)).toEqual([...active.map((account) => account.name)].sort((a, b) => a.localeCompare(b)));
    expect(getPage(active, 1).records).toHaveLength(10);
    expect(selectVisibleAccounts(dummyAccounts, 'no such account', 'All statuses')).toEqual([]);
  });

  it('keeps equal and blank values in a consistent order in both directions', () => {
    const sample = [
      { id: 'a', name: 'Beta', remark: '' },
      { id: 'b', name: 'Alpha', remark: 'filled' },
      { id: 'c', name: 'Alpha', remark: '' }
    ];
    expect(selectVisibleAccounts(sample, '', 'All statuses', { key: 'name', direction: 'asc' }).map((row) => row.id)).toEqual(['b', 'c', 'a']);
    expect(selectVisibleAccounts(sample, '', 'All statuses', { key: 'name', direction: 'desc' }).map((row) => row.id)).toEqual(['a', 'b', 'c']);
    expect(selectVisibleAccounts(sample, '', 'All statuses', { key: 'remark', direction: 'desc' }).map((row) => row.id)).toEqual(['b', 'a', 'c']);
  });
});
