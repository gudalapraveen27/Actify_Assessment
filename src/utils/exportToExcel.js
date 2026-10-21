export async function exportAccounts(accounts, filtered) {
  if (!accounts.length) return false;
  const XLSX = await import('xlsx');
  const rows = accounts.map(({ name, email, phone, website, industry, status, remark }) => ({ 'Account Name': name, Email: email, 'Phone Number': phone, Website: website, Industry: industry, 'Account Status': status, Remark: remark }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 28 }, { wch: 32 }, { wch: 21 }, { wch: 36 }, { wch: 24 }, { wch: 18 }, { wch: 38 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Accounts');
  XLSX.writeFile(workbook, filtered ? 'accounts_filtered.xlsx' : 'accounts.xlsx');
  return true;
}
