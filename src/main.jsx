import React, { useState } from 'react'; import { createRoot } from 'react-dom/client'; import { ShieldCheck, CreditCard, Smartphone, Landmark, CheckCircle2, XCircle, Loader2, LockKeyhole, Eye, EyeOff } from 'lucide-react'; import './index.css';
const money = n => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
function validLuhn(v) { let a = v.replace(/\D/g, ''); if (a.length !== 16) return false; let s = 0, dbl = false; for (let i = a.length - 1; i >= 0; i--) { let d = +a[i]; if (dbl) { d *= 2; if (d > 9) d -= 9 } s += d; dbl = !dbl } return s % 10 === 0 }
function App() {
    const [method, setMethod] = useState('card'); const [status, setStatus] = useState('idle'); const [showCvv, setShowCvv] = useState(false); const [form, setForm] = useState({ name: '', card: '', expiry: '', cvv: '', upi: '', bank: '' });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const card = form.card.replace(/\D/g, ''); const exp = form.expiry; const [mm, yy] = exp.split('/'); const year = Number(yy); const month = Number(mm); const now = new Date(); const expired = yy?.length === 2 && (year < now.getFullYear() % 100 || (year === now.getFullYear() % 100 && month < now.getMonth() + 1));
    const errors = { name: !form.name.trim() ? 'Name is required' : '', card: !validLuhn(form.card) ? 'Enter a valid 16-digit card number' : '', expiry: !/^\d{2}\/\d{2}$/.test(exp) || month < 1 || month > 12 || expired ? 'Enter a valid future expiry' : '', cvv: !/^\d{3}$/.test(form.cvv) ? 'CVV must be 3 digits' : '', upi: !/^[\w.-]+@[\w.-]+$/.test(form.upi) ? 'Enter a valid UPI ID' : '', bank: !form.bank ? 'Select a bank' : '' };
    const canPay = method === 'card' ? !Object.values({ name: errors.name, card: errors.card, expiry: errors.expiry, cvv: errors.cvv }).some(Boolean) : method === 'upi' ? !errors.upi : !errors.bank;
    const pay = () => { if (!canPay || status === 'loading') return; setStatus('loading'); setTimeout(() => setStatus(Math.random() < .82 ? 'success' : 'error'), 1800) };
    const reset = () => setStatus('idle');
    return <div className="min-h-screen">    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left - Logo + Brand */}
        <div className="flex items-center gap-3">
          {/* Payvanta Logo */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-md">
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Letter P */}
              <path
                d="M18 52V12H34C43 12 49 18 49 26C49 34 43 40 34 40H26V52H18Z"
                fill="white"
                opacity="0.95"
              />

              {/* Shield */}
              <path
                d="M38 18L45 21V28C45 33 42 36.5 38 39C34 36.5 31 33 31 28V21L38 18Z"
                fill="#1E3A8A"
              />

              {/* Lock */}
              <rect x="35.8" y="26.5" width="4.5" height="5" rx="1" fill="white"/>
              <path
                d="M36.8 26V24.8C36.8 23.5 37.6 22.7 38 22.7C38.4 22.7 39.2 23.5 39.2 24.8V26"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Brand Name */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Payvanta
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Secure. Seamless. Yours.
            </p>
          </div>
        </div>

        {/* Center - Checkout Details */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-slate-800">
            Secure Checkout
          </h2>

          <p className="text-sm text-slate-500">
            Order <span className="font-semibold">#PG-2026-0828</span>
          </p>
        </div>

        {/* Right - Security Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-200">
          <ShieldCheck size={20} />
          <span className="font-semibold text-sm">
            Secure Payment
          </span>
        </div>

      </div>
    </header>
        <main className="max-w-6xl mx-auto px-4 py-8"><div className="grid lg:grid-cols-[1fr_370px] gap-6"><section className="bg-white rounded-2xl shadow-sm p-6"><h1 className="text-2xl font-bold">Complete Your Payment</h1><p className="text-sm text-slate-500 mt-1">Choose your preferred payment method.</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-7">{[['card', 'Card', 'Credit / Debit Card', CreditCard], ['upi', 'UPI', 'Google Pay, PhonePe, etc.', Smartphone], ['bank', 'Net Banking', 'Pay using your bank', Landmark]].map(([id, title, sub, Icon]) => <button key={id} onClick={() => { setMethod(id); reset() }} className={`text-left p-4 rounded-xl border transition ${method === id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-400'}`}><Icon size={22} className={method === id ? 'text-blue-600' : 'text-slate-500'} /><div className="font-semibold mt-3">{title}</div><div className="text-xs text-slate-500 mt-1">{sub}</div></button>)}</div>
            {method === 'card' && <div className="mt-7 space-y-5"><Field label="Cardholder Name" value={form.name} onChange={v => set('name', v)} placeholder="John Doe" error={errors.name} /><Field label="Card Number" value={form.card} onChange={v => set('card', v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} placeholder="4242 4242 4242 4242" inputMode="numeric" error={card.length ? errors.card : ''} /><div className="grid grid-cols-2 gap-4"><Field label="Expiry Date" value={form.expiry} onChange={v => { v = v.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); set('expiry', v) }} placeholder="MM/YY" inputMode="numeric" error={form.expiry.length ? errors.expiry : ''} /><div><label className="block text-sm font-medium mb-2">CVV</label><div className="relative"><input type={showCvv ? 'text' : 'password'} maxLength="3" inputMode="numeric" value={form.cvv} onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="•••" className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-11 outline-none focus:border-blue-600" /><button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-3.5 text-slate-400">{showCvv ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{form.cvv && <Err text={errors.cvv} />}</div></div></div>}
            {method === 'upi' && <div className="mt-7"><Field label="UPI ID" value={form.upi} onChange={v => set('upi', v.trim())} placeholder="yourname@upi" error={form.upi ? errors.upi : ''} /><div className="mt-4 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">Try a mock UPI ID such as <b>pratik@upi</b>.</div></div>}
            {method === 'bank' && <div className="mt-7"><label className="block text-sm font-medium mb-2">Select Bank</label><select value={form.bank} onChange={e => set('bank', e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white outline-none focus:border-blue-600"><option value="">Choose your bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>State Bank of India</option><option>Axis Bank</option><option>Kotak Mahindra Bank</option></select>{form.bank && <Err text={errors.bank} />}</div>}
            <button disabled={!canPay || status === 'loading'} onClick={pay} className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{status === 'loading' ? <><Loader2 className="animate-spin" size={19} />Processing payment...</> : <> <LockKeyhole size={18} />Pay {money(1352)}</>}</button>
            {status === 'success' && <Status success onClick={reset} />} {status === 'error' && <Status onClick={reset} />} </section>
            <aside className="bg-white rounded-2xl shadow-sm p-6 h-fit"><h2 className="font-bold text-lg">Order Summary</h2><div className="flex justify-between mt-6 text-sm"><span className="text-slate-600">React Premium UI Kit</span><span>{money(1200)}</span></div><div className="flex justify-between mt-3 text-sm"><span className="text-slate-600">Discount</span><span className="text-emerald-600">-₹100.00</span></div><div className="flex justify-between mt-3 text-sm"><span className="text-slate-600">GST (23%)</span><span>{money(252)}</span></div><div className="border-t mt-5 pt-5 flex justify-between text-lg font-bold"><span>Total</span><span>{money(1352)}</span></div><div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 flex gap-2"><ShieldCheck size={17} className="text-emerald-600 shrink-0" />Your payment information is encrypted and securely processed.</div></aside></div></main></div>
}
function Field({ label, value, onChange, placeholder, inputMode, error }) { return <div><label className="block text-sm font-medium mb-2">{label}</label><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600 ${error ? 'border-red-400' : 'border-slate-300'}`} />{value && <Err text={error} />}</div> }
function Err({ text }) { return text ? <p className="text-xs text-red-500 mt-1">{text}</p> : null }
function Status({ success, onClick }) { return <div className={`mt-5 rounded-xl p-4 flex items-center justify-between ${success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}><div className="flex items-center gap-3">{success ? <CheckCircle2 /> : <XCircle />}<div><div className="font-semibold">{success ? 'Payment Successful' : 'Payment Failed'}</div><div className="text-xs opacity-80">{success ? 'Your mock payment was completed successfully.' : 'Something went wrong. Please try again.'}</div></div></div><button onClick={onClick} className="text-sm underline">{success ? 'Done' : 'Retry'}</button></div> }
createRoot(document.getElementById('root')).render(<App />);
