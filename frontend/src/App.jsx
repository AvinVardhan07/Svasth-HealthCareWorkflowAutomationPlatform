import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Leaf,
  Menu,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  QrCode,
  AlertCircle,
  Calendar,
  User,
  Stethoscope,
  Send
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl border backdrop-blur-md text-sm font-medium transition-all ${
          isSuccess
            ? 'bg-emerald-500/90 text-white border-emerald-400/40 shadow-emerald-500/20'
            : isError
            ? 'bg-rose-500/90 text-white border-rose-400/40 shadow-rose-500/20'
            : 'bg-blue-600/90 text-white border-blue-400/40 shadow-blue-500/20'
        }`}
      >
        {isSuccess ? <CheckCircle2 size={18} /> : isError ? <AlertCircle size={18} /> : <Sparkles size={18} />}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded-full p-1 transition hover:bg-white/20"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = user?.name?.split(' ')[0] || 'Team';

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a]">
      <header className="sticky top-0 z-40 border-b border-[#dbeafe] bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              src={logo}
              alt="SVASTH logo"
              className="h-14 w-auto rounded-xl object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </Link>

          <nav className="hidden items-center gap-3 text-sm font-medium text-[#475569] md:flex">
            {user ? (
              <>
                <span className="rounded-full bg-[#EFF6FF] px-4 py-2 text-[#2563EB] font-semibold">
                  Hello, {displayName}
                </span>
                <Link
                  to="/dashboard"
                  className="rounded-full bg-[#2563EB] px-5 py-2 text-white font-medium shadow-md shadow-[#2563EB]/15 transition hover:bg-[#1D4ED8]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="rounded-full border border-[#2563EB] bg-white px-4 py-2 text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-[#2563EB] font-medium hover:underline">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-[#2563EB] px-5 py-2 text-[#2563EB] font-semibold transition hover:bg-[#2563EB] hover:text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-full border border-[#dbeafe] p-2 text-[#111827] md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#dbeafe] bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium text-[#475569]">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-[#2563EB] px-4 py-2 text-center text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout();
                    }}
                    className="rounded-full border border-[#2563EB] px-4 py-2 text-center text-[#2563EB]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-[#2563EB] text-center">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-[#2563EB] px-4 py-2 text-center text-[#2563EB]"
                  >
                    Sign up
                  </Link>
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
            <img src={logo} alt="SVASTH logo" className="h-12 w-auto rounded-xl object-contain" />
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#2563EB]">SVASTH</p>
              <p className="mt-2 max-w-sm leading-7 text-[#475569]">
                A secure and modern healthcare platform for intelligent patient engagement, automated reminders, and streamlined care coordination.
              </p>
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
              <li>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2 font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  <MessageCircleMore size={16} /> Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#dbeafe] px-6 py-4 text-center text-sm text-[#475569] sm:px-8">
          © 2026 SVASTH. All rights reserved.
        </div>
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
    { title: 'Data privacy built in', copy: 'Role-based access protects patient records, medical history, and care workflows.' }
  ];

  const stats = [
    { label: 'Faster scheduling', value: '40%' },
    { label: 'Reduced manual follow-up', value: '60%' },
    { label: 'Patient satisfaction', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#0f172a]">
      <main>
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-[#eff6ff] to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 sm:px-8 lg:grid-cols-[0.95fr_0.85fr] lg:px-8 lg:py-24">
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
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2563EB]/20 transition hover:bg-[#1D4ED8]"
                >
                  {user ? 'Go to dashboard' : 'Request access'}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#platform"
                  className="inline-flex items-center justify-center rounded-full border border-[#dbeafe] bg-white px-7 py-3.5 text-base font-semibold text-[#111827] shadow-sm transition hover:border-[#2563EB] hover:text-[#2563EB]"
                >
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
                <p className="mt-4 text-base leading-7 text-[#475569]">
                  A modern healthcare operations platform designed for hospitals, clinics, and outpatient centers that need a secure digital control center.
                </p>
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

        <motion.section id="platform" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">About SVASTH</p>
              <h2 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">A complete digital healthcare workflow system</h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                SVASTH helps hospitals and clinics reduce manual coordination by connecting patients, care teams, and operations through secure digital workflows.
              </p>
              <p className="mt-4 text-lg leading-8 text-[#475569]">
                Built on MERN with Redis caching, touchless QR code verification, and n8n automation, SVASTH supports appointment management, communication, and compliance in one elegant system.
              </p>
            </div>
            <div className="rounded-[32px] border border-[#dbeafe] bg-[#f8fbff] p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2563EB]">What it supports</p>
              <div className="mt-6 space-y-4">
                {pillars.map(({ title, copy }) => (
                  <div key={title} className="rounded-[20px] border border-[#dbeafe] bg-white px-4 py-4 shadow-sm">
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

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-8 lg:px-8">
          <div className="rounded-[32px] border border-[#dbeafe] bg-[#111827] p-8 text-white lg:p-10 shadow-2xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#93C5FD]">Ready to simplify care?</p>
                <h2 className="mt-3 text-3xl font-bold">Bring your clinic operations into one intelligent workflow.</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to={user ? '/dashboard' : '/register'} className="rounded-full bg-[#2563EB] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1D4ED8] text-center">
                  Start now
                </Link>
                <a href="#platform" className="rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:border-[#93C5FD] text-center">
                  View features
                </a>
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const success = await onSubmit(form, isLogin ? 'login' : 'register');
    setLoading(false);
    if (success !== false) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row items-center justify-center pt-8">
        <div className="flex-1 rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Access portal</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#111827] sm:text-4xl">
            {isLogin ? 'Sign in to SVASTH' : 'Create your account'}
          </h2>
          <p className="mt-3 max-w-xl text-[#475569]">
            A calm, secure command center for patients, reception, doctors, and administrators.
          </p>
        </div>
        <div className="w-full max-w-xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">
                {isLogin ? 'Welcome back' : 'New account'}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[#111827]">
                {isLogin ? 'Secure sign in' : 'Begin your journey'}
              </h3>
            </div>
            <Link to="/" className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]">
              Home
            </Link>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                required
              />
            )}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#2563EB]"
              required
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#2563EB]"
              required
            />
            {!isLogin && (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#2563EB]"
              />
            )}
            {error && (
              <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-600 flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </p>
            )}
            <button
              disabled={loading}
              className="w-full rounded-full bg-[#2563EB] px-6 py-3.5 font-semibold text-white shadow-md shadow-[#2563EB]/20 transition hover:bg-[#1D4ED8] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Log in' : 'Register'
              )}
            </button>
          </form>

          <div className="mt-5 flex justify-between text-sm text-[#475569]">
            <Link to={isLogin ? '/register' : '/login'} className="text-[#2563EB] hover:underline">
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </Link>
            <Link to="/forgot-password" className="text-[#2563EB] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await onSubmit(email);
    setLoading(false);
    setMessage(result.message);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a] flex items-center justify-center">
      <div className="mx-auto w-full max-w-xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Recovery</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#111827]">Reset password</h2>
        <p className="mt-3 text-sm text-[#475569]">
          A temporary access recovery code will be generated for the submitted email.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Registered email"
            className="w-full rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-[#111827] outline-none focus:border-[#2563EB] placeholder:text-[#94a3b8]"
            required
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-[#2563EB] px-6 py-3 font-semibold text-white shadow-md shadow-[#2563EB]/15 transition hover:bg-[#1D4ED8] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Generating code...</> : 'Send reset code'}
          </button>
        </form>
        {message && (
          <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 size={16} /> {message}
          </p>
        )}
        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm text-[#2563EB] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({
  user,
  doctors,
  appointments,
  notifications,
  onBook,
  onRefresh,
  onCheckIn,
  onComplete,
  onAssistantSend,
  assistantMessages,
  aiOpen,
  setAiOpen,
  isBooking,
  checkingInId,
  isRefreshing,
  isAssistantSending
}) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [assistantInput, setAssistantInput] = useState('');

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doctor) =>
        `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(search.toLowerCase())
      ),
    [doctors, search]
  );

  const handleBook = async (event) => {
    event.preventDefault();
    if (isBooking) return;
    const success = await onBook({
      ...form,
      patientName: user?.name || form.patientName || form.name,
      patientEmail: user?.email || form.patientEmail || form.email,
      patientPhone: user?.phone || form.patientPhone || form.phone
    });
    if (success) {
      setForm(emptyForm);
    }
  };

  const handleAssistantSubmit = async (event) => {
    event.preventDefault();
    if (!assistantInput.trim() || isAssistantSending) return;
    const msg = assistantInput;
    setAssistantInput('');
    await onAssistantSend(msg);
  };

  const upcomingAppointment = appointments.find((a) => a.status !== 'completed') || appointments[0];

  return (
    <div className="min-h-screen bg-[#f8fbff] p-4 text-[#0f172a] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-[#dbeafe] bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Patient dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827] sm:text-4xl">
              Welcome back, {user?.name || 'Patient'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onRefresh(false)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#dbeafe] bg-white px-4 py-2 text-sm font-semibold text-[#475569] shadow-sm transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-60"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#2563EB]' : ''} />
              {isRefreshing ? 'Syncing...' : 'Refresh'}
            </button>
            <Link
              to="/reception"
              className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              Reception
            </Link>
            <Link
              to="/doctor"
              className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              Doctor
            </Link>
            <Link
              to="/admin"
              className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              Admin
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2563EB]">Next Appointment</p>
              <Calendar size={18} className="text-[#2563EB]" />
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#111827]">
              {upcomingAppointment ? `Dr. ${upcomingAppointment.doctorName}` : 'No appointment yet'}
            </h3>
            <p className="mt-1 text-sm text-[#475569]">
              {upcomingAppointment
                ? `${upcomingAppointment.date} • ${upcomingAppointment.slot} (${upcomingAppointment.status})`
                : 'Book a doctor below to begin'}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#bae6fd] bg-[#f0f9ff] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f766e]">Touchless QR Check-in</p>
              <QrCode size={18} className="text-[#0f766e]" />
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#111827]">
              {appointments.some((a) => a.status === 'confirmed') ? 'Ready to Scan' : 'Up to Date'}
            </h3>
            <p className="mt-1 text-sm text-[#475569]">
              Present your QR code at reception or click Check in for touchless arrival.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#64748b]">Live Notifications</p>
              <MessageCircleMore size={18} className="text-[#2563EB]" />
            </div>
            <h3 className="mt-3 text-2xl font-bold text-[#111827]">{notifications.length}</h3>
            <p className="mt-1 text-sm text-[#475569]">WhatsApp & Email automated alerts synced.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">Find a Doctor</h3>
                  <p className="text-xs text-[#64748b] mt-0.5">Explore medical specialists and available clinics</p>
                </div>
                <span className="rounded-full bg-blue-100 text-[#2563EB] px-3 py-1 text-xs font-semibold">
                  {filteredDoctors.length} available
                </span>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by doctor name or specialty (e.g. Cardiology)..."
                className="mt-4 w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB] shadow-xs"
              />
              <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="rounded-[20px] border border-[#dbeafe] bg-white p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-[#EFF6FF] p-2.5 text-[#2563EB]">
                          <Stethoscope size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#111827]">{doctor.name}</p>
                          <p className="text-xs text-[#64748b]">
                            {doctor.specialty} • {doctor.experience}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setForm((prev) => ({ ...prev, doctorId: doctor.id }));
                            setSelectedDoctor(doctor);
                          }}
                          className="rounded-full border border-[#2563EB] px-3 py-1.5 text-xs font-semibold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => setSelectedDoctor(selectedDoctor?.id === doctor.id ? null : doctor)}
                          className="rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB] transition hover:bg-[#DBEAFE]"
                        >
                          {selectedDoctor?.id === doctor.id ? 'Hide' : 'Info'}
                        </button>
                      </div>
                    </div>
                    {selectedDoctor?.id === doctor.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-xs space-y-1 text-[#475569]"
                      >
                        <p><strong>Availability:</strong> {doctor.availability}</p>
                        <p><strong>Location:</strong> {doctor.location}</p>
                        <p><strong>Consultation:</strong> {doctor.consultationType}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">Book Appointment</h3>
                  <p className="text-xs text-[#64748b] mt-0.5">Instant scheduling with automated multi-channel confirmation</p>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
                  Fast confirmation
                </span>
              </div>

              <form className="mt-5 space-y-3.5" onSubmit={handleBook}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={form.patientName}
                    onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))}
                    placeholder="Patient Name"
                    className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                    required
                  />
                  <input
                    type="email"
                    value={form.patientEmail}
                    onChange={(event) => setForm((prev) => ({ ...prev, patientEmail: event.target.value }))}
                    placeholder="Patient Email"
                    className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                    required
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="tel"
                    value={form.patientPhone}
                    onChange={(event) => setForm((prev) => ({ ...prev, patientPhone: event.target.value }))}
                    placeholder="WhatsApp Phone Number"
                    className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                  />
                  <select
                    value={form.doctorId}
                    onChange={(event) => setForm((prev) => ({ ...prev, doctorId: event.target.value }))}
                    className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none focus:border-[#2563EB]"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                    className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none focus:border-[#2563EB]"
                    required
                  />
                  <select
                    value={form.slot}
                    onChange={(event) => setForm((prev) => ({ ...prev, slot: event.target.value }))}
                    className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none focus:border-[#2563EB]"
                    required
                  >
                    <option value="">Choose Slot</option>
                    <option value="09:00 AM">09:00 AM - Morning Slot</option>
                    <option value="11:30 AM">11:30 AM - Morning Slot</option>
                    <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                    <option value="04:00 PM">04:00 PM - Evening Slot</option>
                  </select>
                </div>

                <textarea
                  value={form.reason}
                  onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
                  placeholder="Reason for visit / symptoms..."
                  rows={2}
                  className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                  required
                />

                <button
                  id="confirm-booking-button"
                  disabled={isBooking}
                  className="w-full rounded-full bg-[#2563EB] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#2563EB]/25 transition hover:bg-[#1D4ED8] disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Confirming booking...
                    </>
                  ) : (
                    <>
                      <Check size={18} /> Confirm booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#111827]">My Appointments</h3>
                <span className="rounded-full bg-blue-100 text-[#2563EB] px-2.5 py-0.5 text-xs font-semibold">
                  {appointments.length}
                </span>
              </div>

              <div className="mt-4 space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {appointments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#dbeafe] bg-white p-6 text-center text-sm text-[#64748b]">
                    No appointments booked yet. Book your first visit using the form.
                  </div>
                ) : (
                  appointments.map((appointment) => {
                    const isCheckingIn = checkingInId === appointment.id;
                    const isConfirmed = appointment.status === 'confirmed';
                    const isCheckedIn = appointment.status === 'checked-in';
                    const isCompleted = appointment.status === 'completed';

                    return (
                      <div
                        key={appointment.id}
                        className="rounded-[22px] border border-[#dbeafe] bg-white p-4 shadow-xs transition hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-[#111827]">Dr. {appointment.doctorName}</p>
                            <p className="text-xs text-[#64748b]">
                              {appointment.date} • {appointment.slot}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-emerald-500/15 text-emerald-700'
                                : isCheckedIn
                                ? 'bg-cyan-500/15 text-cyan-700'
                                : 'bg-amber-500/15 text-amber-700'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={12} /> : isCheckedIn ? <Check size={12} /> : <Clock size={12} />}
                            {appointment.status}
                          </span>
                        </div>

                        <div className="mt-3 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-xs text-[#475569] space-y-1">
                          <p><strong>Reason:</strong> {appointment.reason}</p>
                          <p><strong>Reminder Status:</strong> {appointment.reminderStatus}</p>
                          {appointment.qrCode && (
                            <p className="font-mono text-[#2563EB] font-bold">
                              <strong>QR Code:</strong> {appointment.qrCode}
                            </p>
                          )}
                        </div>

                        {appointment.qrCode && (
                          <div className="mt-3 flex flex-col items-center justify-center rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3">
                            <QRCodeSVG value={appointment.qrCode} size={110} level="H" />
                            <p className="mt-1.5 text-[10px] text-[#64748b]">Present at reception desk for check-in</p>
                          </div>
                        )}

                        {isConfirmed && (
                          <button
                            id={`checkin-btn-${appointment.id}`}
                            disabled={isCheckingIn}
                            onClick={() => onCheckIn(appointment.id)}
                            className="mt-3 w-full rounded-full bg-[#0f766e] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#115e59] disabled:opacity-75 flex items-center justify-center gap-2"
                          >
                            {isCheckingIn ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Checking in...
                              </>
                            ) : (
                              <>
                                <Check size={14} /> Check in
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#111827]">Live Notifications</h3>
                <span className="rounded-full bg-blue-100 text-[#2563EB] px-2 py-0.5 text-xs font-semibold">
                  Live
                </span>
              </div>
              <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#94a3b8] italic">No notifications yet</p>
                ) : (
                  notifications.map((notification, idx) => (
                    <div
                      key={notification.id || idx}
                      className="rounded-2xl border border-[#dbeafe] bg-white p-3 text-xs text-[#475569] shadow-2xs"
                    >
                      {notification.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SVASTH Conversational AI Assistant Floating Widget */}
        <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,360px)] rounded-[26px] border border-[#dbeafe] bg-white/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-[#eff6ff]">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-[#111827] text-sm">SVASTH AI Assistant</h3>
            </div>
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="rounded-full px-2.5 py-1 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition"
            >
              {aiOpen ? 'Minimize' : 'Chat'}
            </button>
          </div>

          {aiOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div className="mt-3 max-h-60 space-y-2 overflow-y-auto rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-3 text-xs">
                {assistantMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-xl p-2.5 text-xs leading-relaxed ${
                      message.role === 'assistant'
                        ? 'bg-[#eff6ff] text-[#1d4ed8] border border-blue-100 shadow-2xs'
                        : 'bg-white text-[#1e293b] border border-slate-200 ml-4 shadow-2xs'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isAssistantSending && (
                  <div className="rounded-xl p-2 text-xs bg-[#eff6ff] text-[#1d4ed8] flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-[#2563EB]" />
                    <span className="italic text-[#2563EB]">SVASTH AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Quick suggestion chips */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  'QR Check-in rules',
                  'Doctor timings',
                  'Reminders setup'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setAssistantInput(chip);
                    }}
                    className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-medium text-[#475569] transition hover:bg-[#2563EB] hover:text-white"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form className="mt-2.5 flex gap-2" onSubmit={handleAssistantSubmit}>
                <input
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-2.5 text-xs text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  disabled={isAssistantSending || !assistantInput.trim()}
                  className="rounded-full bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 flex items-center justify-center"
                >
                  {isAssistantSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReceptionPage({ appointments, onCheckIn, checkingInId }) {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleScan = async (event) => {
    event.preventDefault();
    const cleanCode = qrCode.trim().toUpperCase();
    const appointment = appointments.find((item) => (item.qrCode || '').toUpperCase() === cleanCode);
    if (!appointment) {
      setMessage('QR Code not found in today\'s register. Please check the code.');
      return;
    }
    setIsVerifying(true);
    await onCheckIn(appointment.id);
    setIsVerifying(false);
    setMessage(`Verified and checked in: ${appointment.patientName} (${appointment.doctorName})`);
    setQrCode('');
  };

  const pendingAppointments = appointments.filter((a) => a.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Reception Desk</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827]">QR-Based Patient Check-in</h2>
          </div>
          <Link
            to="/dashboard"
            className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#111827]">Scan QR / Enter Code</h3>
            <p className="mt-1 text-xs text-[#64748b]">Enter code or click any pending patient on the right</p>
            <form onSubmit={handleScan} className="mt-5 space-y-4">
              <input
                value={qrCode}
                onChange={(event) => setQrCode(event.target.value)}
                placeholder="Enter SVASTH-XXXXXX code"
                className="w-full rounded-2xl border border-[#dbeafe] bg-white p-3 font-mono text-sm uppercase text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#2563EB]"
                required
              />
              <button
                id="reception-verify-btn"
                disabled={isVerifying}
                className="w-full rounded-full bg-[#2563EB] px-6 py-3 font-bold text-white shadow-md shadow-[#2563EB]/20 transition hover:bg-[#1D4ED8] disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Check size={16} /> Verify and check in
                  </>
                )}
              </button>
            </form>
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 rounded-2xl border p-3 text-xs font-semibold ${
                  message.includes('Verified')
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700'
                    : 'border-rose-500/20 bg-rose-500/10 text-rose-700'
                }`}
              >
                {message}
              </motion.p>
            )}
          </div>

          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#111827]">Active Appointment Queue</h3>
              <span className="rounded-full bg-blue-100 text-[#2563EB] px-2.5 py-0.5 text-xs font-bold">
                {pendingAppointments.length} Waiting
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {pendingAppointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#dbeafe] bg-white p-6 text-center text-xs text-[#64748b]">
                  Queue is clear. No waiting appointments.
                </div>
              ) : (
                pendingAppointments.map((appointment) => {
                  const isCheckingIn = checkingInId === appointment.id;
                  return (
                    <div
                      key={appointment.id}
                      className="rounded-[20px] border border-[#dbeafe] bg-white p-4 transition hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#111827]">{appointment.patientName}</p>
                          <p className="text-xs text-[#64748b]">
                            {appointment.doctorName} • {appointment.date} • {appointment.slot}
                          </p>
                          {appointment.qrCode && (
                            <span
                              onClick={() => setQrCode(appointment.qrCode)}
                              className="mt-1 inline-block cursor-pointer rounded-md bg-[#f1f5f9] px-2 py-0.5 font-mono text-[11px] font-bold text-[#2563EB] hover:bg-[#dbeafe]"
                              title="Click to copy into scan box"
                            >
                              QR: {appointment.qrCode}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                              appointment.status === 'checked-in'
                                ? 'bg-cyan-500/15 text-cyan-700'
                                : 'bg-amber-500/15 text-amber-700'
                            }`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.status === 'confirmed' && (
                            <button
                              disabled={isCheckingIn}
                              onClick={() => onCheckIn(appointment.id)}
                              className="rounded-full bg-[#0f766e] px-3 py-1 text-[11px] font-bold text-white transition hover:bg-[#115e59] disabled:opacity-60 flex items-center gap-1"
                            >
                              {isCheckingIn ? <Loader2 size={10} className="animate-spin" /> : null}
                              Check in
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorPage({ appointments, onComplete, completingId }) {
  const activeAppointments = appointments.filter((appointment) => appointment.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Doctor Workspace</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827]">Today’s Consultations</h2>
          </div>
          <Link
            to="/dashboard"
            className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {activeAppointments.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#dbeafe] bg-[#f8fbff] p-8 text-center text-sm text-[#64748b]">
              All consultations completed for today! Great job.
            </div>
          ) : (
            activeAppointments.map((appointment) => {
              const isCompleting = completingId === appointment.id;
              return (
                <div
                  key={appointment.id}
                  className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 transition hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg text-[#111827]">{appointment.patientName}</p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            appointment.status === 'checked-in'
                              ? 'bg-cyan-500/15 text-cyan-700'
                              : 'bg-amber-500/15 text-amber-700'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748b] mt-1">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                      <p className="text-xs text-[#94a3b8] mt-0.5">
                        {appointment.date} • {appointment.slot}
                      </p>
                    </div>
                    <button
                      id={`complete-btn-${appointment.id}`}
                      disabled={isCompleting}
                      onClick={() => onComplete(appointment.id)}
                      className="rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#2563EB]/20 transition hover:bg-[#1D4ED8] disabled:opacity-75 flex items-center justify-center gap-2"
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Completing...
                        </>
                      ) : (
                        <>
                          <Check size={16} /> Mark consultation completed
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPage({ stats, appointments, onComplete, completingId }) {
  return (
    <div className="min-h-screen bg-[#f8fbff] p-6 text-[#0f172a]">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Admin Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111827]">Hospital Workflow Command</h2>
          </div>
          <Link
            to="/dashboard"
            className="rounded-full border border-[#dbeafe] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#bfdbfe] bg-[#eff6ff] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#2563EB] font-semibold">Total Appointments</p>
            <h3 className="mt-2 text-3xl font-black text-[#111827]">{stats.totalAppointments}</h3>
          </div>
          <div className="rounded-[24px] border border-[#bae6fd] bg-[#f0f9ff] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#0f766e] font-semibold">Active & Confirmed</p>
            <h3 className="mt-2 text-3xl font-black text-[#111827]">{stats.confirmed}</h3>
          </div>
          <div className="rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#64748b] font-semibold">Completed Visits</p>
            <h3 className="mt-2 text-3xl font-black text-[#111827]">{stats.completed}</h3>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#dbeafe] bg-[#f8fbff] p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#111827]">Appointment Operations</h3>
          <div className="mt-4 space-y-3">
            {appointments.length === 0 ? (
              <p className="text-xs text-[#94a3b8] italic">No appointments recorded yet.</p>
            ) : (
              appointments.map((appointment) => {
                const isCompleting = completingId === appointment.id;
                return (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-[20px] border border-[#dbeafe] bg-white p-4 gap-3 shadow-2xs"
                  >
                    <div>
                      <p className="font-bold text-[#111827]">
                        {appointment.patientName} • Dr. {appointment.doctorName}
                      </p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        {appointment.date} • {appointment.slot} • Status: <span className="font-bold uppercase text-[#2563EB]">{appointment.status}</span>
                      </p>
                    </div>
                    {appointment.status !== 'completed' && (
                      <button
                        disabled={isCompleting}
                        onClick={() => onComplete(appointment.id)}
                        className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1D4ED8] disabled:opacity-75 flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        {isCompleting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Complete
                      </button>
                    )}
                  </div>
                );
              })
            )}
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
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your 24/7 SVASTH virtual assistant. I can guide you through booking, touchless QR check-in, and doctor schedules.'
    }
  ]);
  const [aiOpen, setAiOpen] = useState(true);
  const [authError, setAuthError] = useState('');

  // Interactive loading states
  const [isBooking, setIsBooking] = useState(false);
  const [checkingInId, setCheckingInId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAssistantSending, setIsAssistantSending] = useState(false);

  // Modern Toast notification system
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Safe non-overlapping background poll guard
  const isFetchingRef = useRef(false);

  const refreshData = async (silent = true) => {
    if (isFetchingRef.current) return;
    if (document.hidden) return; // Don't poll while user is looking at another window/tab
    isFetchingRef.current = true;
    if (!silent) setIsRefreshing(true);

    try {
      const emailQuery = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
      const [doctorsResponse, appointmentsResponse, notificationsResponse, statsResponse] =
        await Promise.all([
          fetch('/api/doctors'),
          fetch(`/api/appointments${emailQuery}`),
          fetch(`/api/notifications${emailQuery}`),
          fetch('/api/stats')
        ]);

      if (doctorsResponse.ok) setDoctors(await doctorsResponse.json());
      if (appointmentsResponse.ok) setAppointments(await appointmentsResponse.json());
      if (notificationsResponse.ok) setNotifications(await notificationsResponse.json());
      if (statsResponse.ok) setStats(await statsResponse.json());
    } catch (error) {
      console.warn('Network sync error:', error);
    } finally {
      isFetchingRef.current = false;
      if (!silent) setIsRefreshing(false);
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
      refreshData(false);
      // Clean 10-second polling that won't overwhelm the network or queue
      const timer = window.setInterval(() => refreshData(true), 10000);
      return () => window.clearInterval(timer);
    }
  }, [user]);

  const handleAuth = async (form, mode) => {
    const endpoint = mode === 'login' ? '/api/login' : '/api/register';
    try {
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
      showToast(mode === 'login' ? 'Signed in successfully!' : 'Account registered successfully!', 'success');
      return true;
    } catch {
      setAuthError('Connection failed. Please ensure the backend is running.');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('svasth-user');
    setUser(null);
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await response.json();
    } catch {
      return { message: 'Unable to connect to recovery server.' };
    }
  };

  const handleBookAppointment = async (payload) => {
    setIsBooking(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok && data.appointment) {
        // Optimistic UI state update: prepend the appointment immediately
        setAppointments((prev) => [data.appointment, ...prev.filter((a) => a.id !== data.appointment.id)]);
        setStats((prev) => ({
          ...prev,
          totalAppointments: prev.totalAppointments + 1,
          confirmed: prev.confirmed + 1
        }));
        showToast('Appointment confirmed! QR Code generated & reminders scheduled.', 'success');
        refreshData(true);
        return true;
      } else {
        showToast(data.message || 'Failed to book appointment', 'error');
        return false;
      }
    } catch (err) {
      showToast('Network error while booking appointment', 'error');
      return false;
    } finally {
      setIsBooking(false);
    }
  };

  const handleCheckIn = async (appointmentId) => {
    setCheckingInId(appointmentId);

    // Optimistic UI update: mark checked-in instantly
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'checked-in' } : a))
    );

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/checkin`, { method: 'POST' });
      if (response.ok) {
        showToast('Patient checked in! Reception queue updated.', 'success');
        refreshData(true);
      } else {
        showToast('Check-in failed. Please try again.', 'error');
        refreshData(true);
      }
    } catch {
      showToast('Check-in network error', 'error');
      refreshData(true);
    } finally {
      setCheckingInId(null);
    }
  };

  const handleComplete = async (appointmentId) => {
    setCompletingId(appointmentId);

    // Optimistic UI update: mark completed instantly
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: 'completed' } : a))
    );
    setStats((prev) => ({
      ...prev,
      confirmed: Math.max(0, prev.confirmed - 1),
      completed: prev.completed + 1
    }));

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, { method: 'POST' });
      if (response.ok) {
        showToast('Consultation completed successfully.', 'success');
        refreshData(true);
      } else {
        showToast('Failed to complete consultation', 'error');
        refreshData(true);
      }
    } catch {
      showToast('Network error updating consultation status', 'error');
      refreshData(true);
    } finally {
      setCompletingId(null);
    }
  };

  const handleAssistantSend = async (message) => {
    setAssistantMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsAssistantSending(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      setAssistantMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setAssistantMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I am momentarily offline. Please check your network or try again.' }
      ]);
    } finally {
      setIsAssistantSending(false);
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <HomePage user={user} />
            </AppLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <AuthPage mode="login" onSubmit={handleAuth} error={authError} setError={setAuthError} />
            </AppLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <AuthPage mode="register" onSubmit={handleAuth} error={authError} setError={setAuthError} />
            </AppLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <ForgotPasswordPage onSubmit={handleForgotPassword} />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <ProtectedRoute user={user}>
                <DashboardPage
                  user={user}
                  doctors={doctors}
                  appointments={appointments}
                  notifications={notifications}
                  onBook={handleBookAppointment}
                  onRefresh={refreshData}
                  onCheckIn={handleCheckIn}
                  onComplete={handleComplete}
                  onAssistantSend={handleAssistantSend}
                  assistantMessages={assistantMessages}
                  aiOpen={aiOpen}
                  setAiOpen={setAiOpen}
                  isBooking={isBooking}
                  checkingInId={checkingInId}
                  isRefreshing={isRefreshing}
                  isAssistantSending={isAssistantSending}
                />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/reception"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <ProtectedRoute user={user}>
                <ReceptionPage
                  appointments={appointments}
                  onCheckIn={handleCheckIn}
                  checkingInId={checkingInId}
                />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/doctor"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <ProtectedRoute user={user}>
                <DoctorPage
                  appointments={appointments}
                  onComplete={handleComplete}
                  completingId={completingId}
                />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout user={user} onLogout={handleLogout}>
              <ProtectedRoute user={user}>
                <AdminPage
                  stats={stats}
                  appointments={appointments}
                  onComplete={handleComplete}
                  completingId={completingId}
                />
              </ProtectedRoute>
            </AppLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
