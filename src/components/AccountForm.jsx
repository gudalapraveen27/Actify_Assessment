import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { industriesList, statusesList } from '../data/dummyAccounts';

const fields = [
  { name: 'name', label: 'Account name', placeholder: 'e.g. Acme Corporation', required: 'Account name is required', minLength: [2, 'Use at least 2 characters'], maxLength: [80, 'Use 80 characters or fewer'] },
  { name: 'email', label: 'Email address', type: 'email', placeholder: 'name@company.com', required: 'Email is required', pattern: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'] },
  { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 (555) 123-4567', required: 'Phone number is required', pattern: [/^\+?[\d\s().-]{7,20}$/, 'Enter a valid phone number'] },
  { name: 'website', label: 'Website', type: 'url', placeholder: 'https://company.com', required: 'Website is required', validate: (value) => { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) || 'Enter a valid URL starting with https://'; } catch { return 'Enter a valid URL starting with https://'; } } },
];

export default function AccountForm({ account, onClose, onSave }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: account || { name: '', email: '', phone: '', website: '', industry: '', status: 'Active', remark: '' }, mode: 'onBlur' });
  useEffect(() => { reset(account || { name: '', email: '', phone: '', website: '', industry: '', status: 'Active', remark: '' }); }, [account, reset]);
  useEffect(() => { const handler = (event) => { if (event.key === 'Escape') onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [onClose]);
  const submit = async (values) => { await onSave({ ...values, remark: values.remark.trim() }); };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="form-panel" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <header className="form-header"><div><span className="eyebrow">ACCOUNT DETAILS</span><h2 id="form-title">{account ? 'Edit account' : 'Add an account'}</h2><p>Keep your team’s account information up to date.</p></div><button className="icon-button" type="button" onClick={onClose} aria-label="Close form"><X size={20}/></button></header>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="form-grid">
          {fields.map(({ name, label, type = 'text', placeholder, ...rules }) => <div className="field" key={name}><label htmlFor={name}>{label}<span className="required"> *</span></label><input id={name} type={type} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} {...register(name, { ...rules, minLength: rules.minLength && { value: rules.minLength[0], message: rules.minLength[1] }, maxLength: rules.maxLength && { value: rules.maxLength[0], message: rules.maxLength[1] }, pattern: rules.pattern && { value: rules.pattern[0], message: rules.pattern[1] } })}/>{errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name].message}</span>}</div>)}
          <div className="field"><label htmlFor="industry">Industry<span className="required"> *</span></label><select id="industry" aria-invalid={Boolean(errors.industry)} {...register('industry', { required: 'Choose an industry' })}><option value="">Select industry</option>{industriesList.map((industry) => <option key={industry}>{industry}</option>)}</select>{errors.industry && <span className="field-error">{errors.industry.message}</span>}</div>
          <div className="field"><label htmlFor="status">Account status<span className="required"> *</span></label><select id="status" {...register('status', { required: 'Choose an account status' })}>{statusesList.map((status) => <option key={status}>{status}</option>)}</select>{errors.status && <span className="field-error">{errors.status.message}</span>}</div>
          <div className="field field-wide"><label htmlFor="remark">Remark <span className="optional">Optional</span></label><textarea id="remark" rows="3" maxLength="240" placeholder="Add context for your team…" aria-invalid={Boolean(errors.remark)} {...register('remark', { maxLength: { value: 240, message: 'Use 240 characters or fewer' } })}/>{errors.remark && <span className="field-error">{errors.remark.message}</span>}</div>
        </div>
        <footer className="form-footer"><span className="form-hint"><span className="required">*</span> Required fields</span><div className="button-row"><button className="button button-light" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={isSubmitting}>{account ? 'Save changes' : 'Add account'}</button></div></footer>
      </form>
    </section>
  </div>;
}
