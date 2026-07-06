import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, Leaf, Menu, MessageCircleMore, ShieldCheck, Sparkles, Star, Truck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import logo from './assets/Svasth-logo.png';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  doctorId: '',
  date: '',
  slot: '',
  reason: '',
  notes: ''
};

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = user?.name?.split(' ')[0] || 'Team';

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a]">
      <header className="sticky top-0 z-40 border-b border-[#dbeafe] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src={logo}
              alt="SVASTH logo"
              className="h-16 w-auto rounded-2xl object-contain"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.25 }}
            />
            <span className="text-base font-semibold text-[#111827]">SVASTH</span>
          </Link>

          <nav className="hidden items-center gap-3 text-sm font-medium text-[#475569] md:flex">
            {user ? (
              <>
                <span className="rounded-full bg-[#EFF6FF] px-4 py-2 text-[#2563EB]">Hello, {displayName}</span>
                <Link to="/dashboard" className="rounded-full bg-[#2563EB] px-4 py-2 text-white transition hover:bg-[#1D4ED8]">Dashboard</Link>
                <button onClick={onLogout} className="rounded-full border border-[#2563EB] bg-white px-4 py-2 text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#2563EB] hover:underline">Login</Link>
                <Link to="/register" className="rounded-full border border-[#2563EB] px-4 py-2 text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white">Sign up</Link>
              </>
            )}
          </nav>

          <button onClick={() => setMobileOpen((prev) => !prev)} className="rounded-full border border-[#dbeafe] p-2 text-[#111827] md:hidden" aria-label="Toggle navigation">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#dbeafe] bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium text-[#475569]">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-full bg-[#2563EB] px-4 py-2 text-center text-white">Dashboard</Link>
                  <button onClick={() => { setMobileOpen(false); onLogout(); }} className="rounded-full border border-[#2563EB] px-4 py-2 text-center text-[#2563EB]">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-[#2563EB]">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-full border border-[#2563EB] px-4 py-2 text-center text-[#2563EB]">Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-[#dbeafe] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm text-[#475569] sm:px-8 lg:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SVASTH logo" className="h-12 w-auto rounded-2xl object-contain" />
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#2563EB]">SVASTH</p>
              <p className="mt-2 max-w-sm leading-7 text-[#475569]">A secure and modern healthcare platform for intelligent patient engagement, automated reminders, and streamlined care coordination.</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#platform" className="transition hover:text-[#2563EB]">Platform</a></li>
              <li><a href="#about" className="transition hover:text-[#2563EB]">About</a></li>
              <li><a href="#faq" className="transition hover:text-[#2563EB]">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>support@svasth.example</li>
              <li>+1 (800) 555-0100</li>
              <li><a href="#" className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2 font-semibold text-white transition hover:bg-[#1D4ED8]"> <MessageCircleMore size={16} /> Contact us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#dbeafe] px-6 py-4 text-center text-sm text-[#475569] sm:px-8">© 2026 SVASTH. All rights reserved.</div>
      </footer>
    </div>
  );
}

function HomePage({ user }) {
  const highlights = [
    { title: 'Digital appointment orchestration', copy: 'Book, confirm, and update patient visits through one clean clinical workflow.', icon: Sparkles },
    { title: 'Automated patient messaging', copy: 'Send reminders, confirmations, and follow-ups via secure channels automatically.', icon: ShieldCheck },
    { title: 'Clear team collaboration', copy: 'Give reception, doctors, and admin staff a single source of truth for every visit.', icon: Leaf }
  ];

  const pillars = [
    { title: 'Workflow automation', copy: 'SVASTH triggers confirmations, reminders, cancellations, and live status updates across every care touchpoint.' },
    { title: 'Real-time visibility', copy: 'Staff can see appointments, capacity, and patient readiness instantly from one dashboard.' },
    { title: 'Data privacy built in', copy: 'JWT authentication and role-based access protect patient records and care workflows.' }
  ];

  const stats = [
    { label: 'Faster scheduling', value: '40%' },
    { label: 'Reduced manual follow-up', value: '60%' },
    { label: 'Patient satisfaction', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a]">
      <main>
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-[#eff6ff] to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 sm:px-8 lg:grid-cols-[0.95fr_0.85fr] lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-white/90 px-4 py-2 text-sm font-medium text-[#2563EB] shadow-sm backdrop-blur">
                <Leaf size={16} />
                Enterprise-grade operations for clinics and hospitals
              </div>
              <h1 className="mt-8 text-5xl font-black tracking-tight text-[#111827] sm:text-6xl lg:text-7xl">
                Secure care coordination,
                <span className="block text-[#2563EB]">simplified for modern healthcare.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-[#475569]">
                SVASTH brings appointments, communication, scheduling, and administrative workflows together in one polished platform so care teams can focus on patient outcomes.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to={user ? '/dashboard' : '/register'} className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2563EB]/15 transition hover:bg-[#1D4ED8]">
                  {user ? 'Go to dashboard' : 'Request access'}
                  <ArrowRight size={18} />
                </Link>
                <a href="#platform" className="inline-flex items-center justify-center rounded-full border border-[#dbeafe] bg-white px-7 py-3.5 text-base font-semibold text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                  Explore platform
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[28px] border border-[#dbeafe] bg-white/90 p-6 shadow-[0_18px_50px_rgba(37,99,235,0.08)]">
                    <p className="text-3xl font-black text-[#111827]">{item.value}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[#475569]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] lg:p-10">
              <div className="rounded-[28px] bg-[#eff6ff] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">Platform overview</p>
                <h2 className="mt-4 text-3xl font-bold text-[#111827]">Patient access, team workflows, and care automation in one place.</h2>
                <p className="mt-4 text-base leading-7 text-[#475569]">A modern healthcare operations platform designed for hospitals, clinics, and outpatient centers that need a secure digital control center.</p>
              </div>

              <div className="mt-8 space-y-4">
                {highlights.map(({ title, copy, icon: Icon }) => (
                  <div key={title} className="flex gap-4 rounded-[26px] border border-[#dbeafe] bg-white p-4 text-[#475569] shadow-sm">
                    <div className="mt-1 rounded-3xl bg-[#2563EB]/10 p-3 text-[#2563EB]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">{title}</p>
                      <p className="mt-1 text-sm leading-6">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="platform" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">About SVASTH</p>
              <h2 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">A complete digital healthcare workflow system</h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                SVASTH helps hospitals and clinics reduce manual coordination by connecting patients, care teams, and operations through secure digital workflows.
              </p>
              <p className="mt-4 text-lg leading-8 text-[#475569]">
                Built on MERN with Redis caching, JWT authentication, and n8n automation, SVASTH supports appointment management, communication, and compliance in one elegant system.
              </p>
            </div>
            <div className="rounded-[32px] border border-[#dbeafe] bg-[#f8fbff] p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">What it supports</p>
              <div className="mt-6 space-y-4">
                {pillars.map(({ title, copy }) => (
                  <div key={title} className="rounded-[20px] border border-[#dbeafe] bg-white px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-[#2563EB]/10 p-2 text-[#2563EB]">
                        <Check size={16} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#111827]">{title}</h3>
                        <p className="mt-1 text-sm leading-7 text-[#475569]">{copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="about" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-8">
          <div className="rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">Why healthcare teams use SVASTH</p>
                <h2 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">Better experience for patients, doctors, and administrators</h2>
                <p className="mt-4 text-lg leading-8 text-[#475569]">The platform unifies patient booking, doctor visibility, reminders, and workflow automation so care teams can focus on treatment rather than manual coordination.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-5">
                  <h3 className="font-semibold text-[#111827]">Appointment lifecycle</h3>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">Guide every booking from request to confirmation, check-in, completion, and follow-up.</p>
                </div>
                <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-5">
                  <h3 className="font-semibold text-[#111827]">Patient engagement</h3>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">Share updates, reminders, and care communications automatically and securely.</p>
                </div>
                <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-5">
                  <h3 className="font-semibold text-[#111827]">Operational control</h3>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">Help reception, doctors, and admins manage schedules and queues with less friction.</p>
                </div>
                <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-5">
                  <h3 className="font-semibold text-[#111827]">Secure access</h3>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">Protect patient data with authentication, role-based permissions, and reliable workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }} className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">Patient confidence</p>
              <h2 className="mt-3 text-3xl font-bold text-[#111827]">A polished experience built for modern healthcare</h2>
              <div className="mt-6 flex items-center gap-1 text-[#2563EB]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
              </div>
              <p className="mt-4 text-lg leading-8 text-[#475569]">“The workflow is clear, timely, and reassuring. Patients feel informed and staff feel in control.”</p>
              <p className="mt-6 font-semibold text-[#111827]">Care team partner</p>
            </div>
            <div id="faq" className="rounded-[32px] border border-[#dbeafe] bg-[#f8fbff] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">Frequently asked</p>
              <div className="mt-6 space-y-4">
                {['How does appointment automation work?', 'Can patients manage their own visits?', 'How are reminders delivered?'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-[20px] border border-[#dbeafe] bg-white px-4 py-4">
                    <span className="font-medium text-[#111827]">{item}</span>
                    <ChevronRight size={18} className="text-[#2563EB]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-8 lg:px-8">
          <div className="rounded-[32px] border border-[#dbeafe] bg-[#111827] p-8 text-white lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#93C5FD]">Ready to simplify care?</p>
                <h2 className="mt-3 text-3xl font-bold">Bring your clinic operations into one intelligent workflow.</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/dashboard' : '/register'} className="rounded-full bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]">Start now</Link>
                <a href="#platform" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-[#93C5FD]">View features</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function AuthPage({ mode, onSubmit, error, setError }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onSubmit(form, isLogin ? 'login' : 'register');
    if (success !== false) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Access portal</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#111827] sm:text-4xl">{isLogin ? 'Sign in to SVASTH' : 'Create your account'}</h2>
          <p className="mt-3 max-w-xl text-[#475569]">A calm, secure command center for patients, reception, doctors, and administrators.</p>
        </div>
        <div className="w-full max-w-xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">{isLogin ? 'Welcome back' : 'New account'}</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{isLogin ? 'Secure sign in' : 'Begin your journey'}</h3>
            </div>
            <Link to="/" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Home</Link>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8]" required />}
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8]" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8]" required />
            {!isLogin && <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8]" />}
            {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</p>}
            <button className="w-full rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]">{isLogin ? 'Log in' : 'Register'}</button>
          </form>

          <div className="mt-4 flex justify-between text-sm text-[#475569]">
            <Link to={isLogin ? '/register' : '/login'} className="text-[#2563EB]">{isLogin ? 'Create an account' : 'Already have an account?'}</Link>
            <button type="button" onClick={() => { setError(''); window.location.href = '/forgot-password'; }} className="text-[#2563EB]">Forgot password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await onSubmit(email);
    setMessage(result.message);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Recovery</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#111827]">Reset password</h2>
        <p className="mt-3 text-sm text-[#475569]">A temporary access code will be generated for the submitted email.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Registered email" className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none placeholder:text-[#94a3b8]" required />
          <button className="rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]">Send reset code</button>
        </form>
        {message && <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700">{message}</p>}
        <Link to="/login" className="mt-4 inline-block text-sm text-[#2563EB]">Back to login</Link>
      </div>
    </div>
  );
}

function DashboardPage({ user, doctors, appointments, notifications, onBook, onRefresh, onCheckIn, onComplete, onAssistantSend, assistantMessages, aiOpen, setAiOpen }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [assistantInput, setAssistantInput] = useState('');

  const filteredDoctors = useMemo(() => doctors.filter((doctor) => `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(search.toLowerCase())), [doctors, search]);

  const handleBook = async (event) => {
    event.preventDefault();
    const result = await onBook({ ...form, patientName: user?.name || form.name, patientEmail: user?.email || form.email, patientPhone: user?.phone || form.phone });
    setStatusMessage(result.message);
    setForm(emptyForm);
  };

  const handleAssistantSubmit = async (event) => {
    event.preventDefault();
    if (!assistantInput.trim()) return;
    await onAssistantSend(assistantInput);
    setAssistantInput('');
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-4 text-[#0f172a] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-[#dbeafe] bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Patient dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827] sm:text-4xl">Welcome back, {user?.name || 'Patient'}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/reception" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Reception</Link>
            <Link to="/doctor" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Doctor</Link>
            <Link to="/admin" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Admin</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#2563EB]">Upcoming appointment</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{appointments[0] ? `Dr. ${appointments[0].doctorName}` : 'No appointment yet'}</h3>
            <p className="mt-2 text-sm text-[#475569]">{appointments[0] ? `${appointments[0].date} • ${appointments[0].slot}` : 'Book a doctor to begin'}</p>
          </div>
          <div className="rounded-[24px] border border-[#bae6fd] bg-[#f0f9ff] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#0f766e]">QR check-in</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{appointments.some((appointment) => appointment.status === 'confirmed') ? 'Ready' : 'Pending'}</h3>
            <p className="mt-2 text-sm text-[#475569]">Use the QR code at reception after booking.</p>
          </div>
          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#64748b]">Notifications</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{notifications.length}</h3>
            <p className="mt-2 text-sm text-[#475569]">Reminder automation and booking updates stay live here.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#111827]">Find a doctor</h3>
                <button onClick={onRefresh} className="rounded-full border border-[#dbeafe] px-3 py-2 text-sm text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Refresh</button>
              </div>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctor or specialty" className="mt-4 w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8]" />
              <div className="mt-4 space-y-3">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="rounded-[20px] border border-[#dbeafe] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#111827]">{doctor.name}</p>
                        <p className="text-sm text-[#64748b]">{doctor.specialty} • {doctor.experience}</p>
                      </div>
                      <button onClick={() => setSelectedDoctor(doctor)} className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">View profile</button>
                    </div>
                    {selectedDoctor?.id === doctor.id && (
                      <div className="mt-3 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-sm text-[#475569]">
                        <p><strong>Availability:</strong> {doctor.availability}</p>
                        <p><strong>Location:</strong> {doctor.location}</p>
                        <p><strong>Consultation:</strong> {doctor.consultationType}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
              <h3 className="text-xl font-semibold text-[#111827]">Book appointment</h3>
              {statusMessage && <p className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700">{statusMessage}</p>}
              <form className="mt-4 space-y-3" onSubmit={handleBook}>
                <input value={form.patientName} onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))} placeholder="Patient name" className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8]" required />
                <input value={form.patientEmail} onChange={(event) => setForm((prev) => ({ ...prev, patientEmail: event.target.value }))} placeholder="Patient email" className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8]" required />
                <select value={form.doctorId} onChange={(event) => setForm((prev) => ({ ...prev, doctorId: event.target.value }))} className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none" required>
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}
                </select>
                <div className="grid gap-3 md:grid-cols-2">
                  <input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none" required />
                  <select value={form.slot} onChange={(event) => setForm((prev) => ({ ...prev, slot: event.target.value }))} className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none" required>
                    <option value="">Choose slot</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
                <textarea value={form.reason} onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))} placeholder="Reason for visit" className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8]" required />
                <button className="rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]">Confirm booking</button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
              <h3 className="text-xl font-semibold text-[#111827]">My appointments</h3>
              <div className="mt-4 space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-[20px] border border-[#dbeafe] bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#111827]">{appointment.doctorName}</p>
                        <p className="text-sm text-[#64748b]">{appointment.date} • {appointment.slot}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${appointment.status === 'completed' ? 'bg-emerald-500/15 text-emerald-700' : appointment.status === 'checked-in' ? 'bg-cyan-500/15 text-cyan-700' : 'bg-amber-500/15 text-amber-700'}`}>{appointment.status}</span>
                    </div>
                    <div className="mt-3 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-sm text-[#475569]">
                      <p><strong>Reason:</strong> {appointment.reason}</p>
                      <p><strong>Reminder:</strong> {appointment.reminderStatus}</p>
                      {appointment.qrCode && <p className="mt-2"><strong>QR:</strong> {appointment.qrCode}</p>}
                    </div>
                    {appointment.qrCode && (
                      <div className="mt-3 flex justify-center rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3">
                        <QRCodeSVG value={appointment.qrCode} size={120} level="H" />
                      </div>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button onClick={() => onCheckIn(appointment.id)} className="mt-3 rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#115e59]">Check in</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
              <h3 className="text-xl font-semibold text-[#111827]">Live notifications</h3>
              <div className="mt-4 space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-[#dbeafe] bg-white p-3 text-sm text-[#475569]">{notification.message}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-50 w-[min(90vw,320px)] rounded-[24px] border border-[#dbeafe] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#111827]">SVASTH AI Assistant</h3>
            <button onClick={() => setAiOpen(!aiOpen)} className="text-sm text-[#2563EB]">{aiOpen ? 'Hide' : 'Show'}</button>
          </div>
          {aiOpen && (
            <>
              <div className="mt-3 max-h-56 space-y-2 overflow-auto rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3">
                {assistantMessages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`rounded-xl p-2 text-sm ${message.role === 'assistant' ? 'bg-[#eff6ff] text-[#1d4ed8]' : 'bg-white text-[#475569]'}`}>
                    {message.content}
                  </div>
                ))}
              </div>
              <form className="mt-3 flex gap-2" onSubmit={handleAssistantSubmit}>
                <input value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="Ask about your appointment" className="flex-1 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-2 text-sm text-[#111827] outline-none placeholder:text-[#94a3b8]" />
                <button className="rounded-full bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ReceptionPage({ appointments, onCheckIn }) {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');

  const handleScan = async (event) => {
    event.preventDefault();
    const appointment = appointments.find((item) => item.qrCode === qrCode);
    if (!appointment) {
      setMessage('QR not found. Please try again.');
      return;
    }
    await onCheckIn(appointment.id);
    setMessage(`Checked in ${appointment.patientName}`);
    setQrCode('');
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Reception desk</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827]">QR-based patient check-in</h2>
          </div>
          <Link to="/dashboard" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Back to dashboard</Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
            <h3 className="text-xl font-semibold text-[#111827]">Scan QR / Enter code</h3>
            <form onSubmit={handleScan} className="mt-4 space-y-4">
              <input value={qrCode} onChange={(event) => setQrCode(event.target.value)} placeholder="Enter QR code here" className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8]" required />
              <button className="rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]">Verify and check in</button>
            </form>
            {message && <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700">{message}</p>}
          </div>
          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
            <h3 className="text-xl font-semibold text-[#111827]">Appointment queue</h3>
            <div className="mt-4 space-y-3">
              {appointments.filter((appointment) => appointment.status !== 'completed').map((appointment) => (
                <div key={appointment.id} className="rounded-[20px] border border-[#dbeafe] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#111827]">{appointment.patientName}</p>
                      <p className="text-sm text-[#64748b]">{appointment.doctorName} • {appointment.date} • {appointment.slot}</p>
                    </div>
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700">{appointment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorPage({ appointments, onComplete }) {
  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Doctor workspace</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827]">Today’s appointments</h2>
          </div>
          <Link to="/dashboard" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Back to dashboard</Link>
        </div>

        <div className="mt-8 space-y-4">
          {appointments.filter((appointment) => appointment.status !== 'completed').map((appointment) => (
            <div key={appointment.id} className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#111827]">{appointment.patientName}</p>
                  <p className="text-sm text-[#64748b]">{appointment.reason} • {appointment.date} • {appointment.slot}</p>
                </div>
                <button onClick={() => onComplete(appointment.id)} className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">Mark consultation completed</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPage({ stats, appointments, onComplete }) {
  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Admin dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827]">Manage hospital workflow</h2>
          </div>
          <Link to="/dashboard" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">Back to dashboard</Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#2563EB]">Total appointments</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{stats.totalAppointments}</h3>
          </div>
          <div className="rounded-[24px] border border-[#bae6fd] bg-[#f0f9ff] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#0f766e]">Confirmed</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{stats.confirmed}</h3>
          </div>
          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#64748b]">Completed</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111827]">{stats.completed}</h3>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6">
          <h3 className="text-xl font-semibold text-[#111827]">Appointment operations</h3>
          <div className="mt-4 space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-[20px] border border-[#dbeafe] bg-white p-4">
                <div>
                  <p className="font-semibold text-[#111827]">{appointment.patientName} • {appointment.doctorName}</p>
                  <p className="text-sm text-[#64748b]">{appointment.date} • {appointment.slot} • {appointment.status}</p>
                </div>
                {appointment.status !== 'completed' && <button onClick={() => onComplete(appointment.id)} className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">Complete</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('svasth-user') || 'null'));
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ totalAppointments: 0, confirmed: 0, completed: 0 });
  const [assistantMessages, setAssistantMessages] = useState([{ role: 'assistant', content: 'Hello! I can help with booking, reminders, check-in, and your appointment status.' }]);
  const [aiOpen, setAiOpen] = useState(true);
  const [authError, setAuthError] = useState('');

  const refreshData = async () => {
    try {
      const [doctorsResponse, appointmentsResponse, notificationsResponse, statsResponse] = await Promise.all([
        fetch('/api/doctors'),
        fetch(`/api/appointments${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`),
        fetch(`/api/notifications${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`),
        fetch('/api/stats')
      ]);
      const doctorsData = await doctorsResponse.json();
      const appointmentsData = await appointmentsResponse.json();
      const notificationsData = await notificationsResponse.json();
      const statsData = await statsResponse.json();
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setNotifications(notificationsData);
      setStats(statsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('svasth-user') || 'null');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshData();
      const timer = window.setInterval(refreshData, 5000);
      return () => window.clearInterval(timer);
    }
  }, [user]);

  const handleAuth = async (form, mode) => {
    const endpoint = mode === 'login' ? '/api/login' : '/api/register';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) {
      setAuthError(data.message || 'Authentication failed');
      return false;
    }
    localStorage.setItem('svasth-user', JSON.stringify(data.user));
    setUser(data.user);
    setAuthError('');
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('svasth-user');
    setUser(null);
    navigate('/');
  };

  const handleForgotPassword = async (email) => {
    const response = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  };

  const handleBookAppointment = async (payload) => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      await refreshData();
    }
    return data;
  };

  const handleCheckIn = async (appointmentId) => {
    const response = await fetch(`/api/appointments/${appointmentId}/checkin`, { method: 'POST' });
    if (response.ok) {
      await refreshData();
    }
  };

  const handleComplete = async (appointmentId) => {
    const response = await fetch(`/api/appointments/${appointmentId}/complete`, { method: 'POST' });
    if (response.ok) {
      await refreshData();
    }
  };

  const handleAssistantSend = async (message) => {
    setAssistantMessages((prev) => [...prev, { role: 'user', content: message }]);
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    setAssistantMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
  };

  return (
    <Routes>
      <Route path="/" element={<AppLayout user={user} onLogout={handleLogout}><HomePage user={user} /></AppLayout>} />
      <Route path="/login" element={<AppLayout user={user} onLogout={handleLogout}><AuthPage mode="login" onSubmit={handleAuth} error={authError} setError={setAuthError} /></AppLayout>} />
      <Route path="/register" element={<AppLayout user={user} onLogout={handleLogout}><AuthPage mode="register" onSubmit={handleAuth} error={authError} setError={setAuthError} /></AppLayout>} />
      <Route path="/forgot-password" element={<AppLayout user={user} onLogout={handleLogout}><ForgotPasswordPage onSubmit={handleForgotPassword} /></AppLayout>} />
      <Route path="/dashboard" element={<AppLayout user={user} onLogout={handleLogout}><ProtectedRoute user={user}><DashboardPage user={user} doctors={doctors} appointments={appointments} notifications={notifications} onBook={handleBookAppointment} onRefresh={refreshData} onCheckIn={handleCheckIn} onComplete={handleComplete} onAssistantSend={handleAssistantSend} assistantMessages={assistantMessages} aiOpen={aiOpen} setAiOpen={setAiOpen} /></ProtectedRoute></AppLayout>} />
      <Route path="/reception" element={<AppLayout user={user} onLogout={handleLogout}><ProtectedRoute user={user}><ReceptionPage appointments={appointments} onCheckIn={handleCheckIn} /></ProtectedRoute></AppLayout>} />
      <Route path="/doctor" element={<AppLayout user={user} onLogout={handleLogout}><ProtectedRoute user={user}><DoctorPage appointments={appointments} onComplete={handleComplete} /></ProtectedRoute></AppLayout>} />
      <Route path="/admin" element={<AppLayout user={user} onLogout={handleLogout}><ProtectedRoute user={user}><AdminPage stats={stats} appointments={appointments} onComplete={handleComplete} /></ProtectedRoute></AppLayout>} />
    </Routes>
  );
}

export default App;
