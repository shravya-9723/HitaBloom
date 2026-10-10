import { useState, useEffect, useRef, useMemo, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Brain, CalendarDays, Check, CheckCircle2, ChevronRight, Clock3,
  Flower2, Globe, Heart, Info, Leaf, LockKeyhole, Mail, MessageCircle, Mic, Play, Pause, RefreshCw, Send, ShieldCheck, Sparkles, Star,
  Stethoscope, Trophy, Users, Volume2, VolumeX, Wind, X, Zap
} from 'lucide-react';
import {
  areas, languages, useDemo, demoAccounts, advancePatientGarden, culturalGuideDialogues, type DemoRole, type DemoState,
} from './data';
import {
  analyzeSymptom, answerCharacterQuestion, explainDoctorInstructions, generateBodyExplanation,
  generateCulturalContext, suggestQuest, findSpeechVoice, stopSpeechSynthesis, LANGUAGE_SPEECH_MAP,
  CULTURAL_WELLNESS_DATA, translateUserText, type CulturalContext
} from './services';
import {
  AppFrame, ButtonLink, Character, Disclaimer, DoctorAvatar, EmptyState, FieldLabel,
  GlassPanel, JourneyStep, Metric, PageHeading, PatientAvatar, ProgressBar, Tag, TinyGarden,
  CHARACTER_REGISTRY,
} from './hb-ui';

function DemoAccountList({ role, onChoose }: { role: DemoRole; onChoose: (email: string) => void }) {
  return (
    <div className="hb-demo-account-list">
      <div className="hb-demo-account-title">
        <Users size={15} />
        <span>{role === 'doctor' ? 'Doctor demo account' : 'Patient demo accounts'}</span>
      </div>
      {demoAccounts.filter((account) => account.role === role).map((account) => (
        <button
          type="button"
          className="hb-demo-account"
          key={account.id}
          onClick={() => onChoose(account.email)}
          data-testid={`button-demo-${account.id}`}
        >
          <span className="hb-demo-avatar">
            {account.role === 'doctor' ? <Stethoscope size={15} /> : account.name.slice(0, 1)}
          </span>
          <span>
            <strong>{account.name}</strong>
            <small>{account.email}{account.role === 'patient' ? ` · ${account.language}` : ''}</small>
          </span>
          <ArrowRight size={15} />
        </button>
      ))}
      <p className="hb-microcopy">Demo accounts use any non-empty password. Click any profile to log in instantly.</p>
    </div>
  );
}

// ============================================================
// 1. LANDING PAGE (MOCKUP SCREEN 1)
// ============================================================
export function Landing() {
  const { session } = useDemo();
  const patientHref = session?.role === 'patient' ? '/world' : '/login?role=patient';
  const doctorHref = session?.role === 'doctor' ? '/doctor' : '/login?role=doctor';

  const lineupCharacters = [
    { name: 'Bri', role: 'Brain', img: '/assets/characters/bri.png' },
    { name: 'Cora', role: 'Heart', img: '/assets/characters/cora.png' },
    { name: 'Luma', role: 'Lungs', img: '/assets/characters/luma.png' },
    { name: 'Bony', role: 'Bones', img: '/assets/characters/bony.png' },
    { name: 'Milo', role: 'Muscles', img: '/assets/characters/milo.png' },
    { name: 'Dr. Maya', role: 'Doctor', img: '/assets/characters/dr-maya.png' },
    { name: 'Cultural Guide', role: 'Wellness', img: '/assets/characters/cultural-guide.png' },
  ];

  return (
    <AppFrame className="hb-landing-page">
      <section
        className="hb-landing-hero relative rounded-3xl overflow-hidden p-6 md:p-12 mb-10 flex flex-col items-center text-center justify-center min-h-[560px]"
        style={{
          backgroundImage: 'linear-gradient(rgba(10, 12, 38, 0.72), rgba(13, 16, 48, 0.85)), url(/assets/landing/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.18)'
        }}
      >
        <div className="max-w-3xl flex flex-col items-center z-10">
          {/* Lotus Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-sm font-semibold text-pink-300 shadow-lg">
            <Flower2 size={18} className="text-pink-400" />
            <span>HitaBloom</span>
            <span className="text-white/40">|</span>
            <span className="text-white/80 font-normal text-xs">Healthcare Knowledge. Cultural Roots. Healthier Tomorrows.</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md">
            A Healthier You,<br />
            <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              A Brighter World
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-200 max-w-xl mb-8 leading-relaxed font-normal">
            An AI-powered health world where multilingual video characters guide you through doctor-approved care,
            cultural wellness knowledge, and interactive health quests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Link
              href={patientHref}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base shadow-xl hover:shadow-pink-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              data-testid="link-landing-patient"
            >
              🌸 Start Your Journey <span className="text-xs text-pink-200 font-normal">(I'm a Patient)</span> <ArrowRight size={18} />
            </Link>

            <Link
              href={doctorHref}
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-base border border-white/25 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              data-testid="link-landing-doctor"
            >
              <Stethoscope size={18} className="text-cyan-300" /> I’m a Doctor <span className="text-xs text-slate-300 font-normal">(Access Dashboard)</span>
            </Link>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-6">
            Different Cultures. Same Care. A Healthier You.
          </p>

          {/* Character Lineup */}
          <div className="hb-character-lineup-bar">
            {lineupCharacters.map((c) => (
              <div key={c.name} className="hb-lineup-item" title={`${c.name} - ${c.role}`}>
                <img src={c.img} alt={c.name} onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="hb-landing-lower">
        <div className="hb-section-heading text-center mb-8">
          <span className="hb-eyebrow">How HitaBloom Works</span>
          <h2>Care is a journey, not a checklist.</h2>
          <p>Explore your body, learn at your own pace, and keep your clinician in the loop.</p>
        </div>
        <div className="hb-process-grid">
          <GlassPanel className="hb-process-card">
            <span className="hb-step-index">01</span>
            <BookOpen size={21} />
            <h3>Start with your words</h3>
            <p>Share a symptom or question in the language that feels like home. The match is for learning, not diagnosis.</p>
          </GlassPanel>
          <GlassPanel className="hb-process-card">
            <span className="hb-step-index">02</span>
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border border-white/30">
              <img src="/assets/characters/bri.png" alt="Bri" className="w-full h-full object-cover" />
            </div>
            <h3>Meet your body guides</h3>
            <p>Friendly characters explain how body systems work and when to speak with your clinician.</p>
          </GlassPanel>
          <GlassPanel className="hb-process-card">
            <span className="hb-step-index">03</span>
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border border-white/30">
              <img src="/assets/characters/dr-maya.png" alt="Dr. Maya" className="w-full h-full object-cover" />
            </div>
            <h3>Grow with your doctor</h3>
            <p>Dr. Maya reviews wellbeing quests and writes your care instructions. AI never changes her plan.</p>
          </GlassPanel>
        </div>
        <Disclaimer />
      </section>
    </AppFrame>
  );
}

// ============================================================
// 4. LOGIN SCREEN (MOCKUP SCREEN 4)
// ============================================================
export function Login() {
  const { login, patients } = useDemo();
  const [, setPath] = useLocation();
  const initialRole: DemoRole = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState<DemoRole>(initialRole);
  const [email, setEmail] = useState(demoAccounts.find((account) => account.role === initialRole)?.email ?? '');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  function completeLogin(nextRole: DemoRole, nextEmail: string, nextPassword: string) {
    const result = login(nextRole, nextEmail, nextPassword);
    if (!result.ok) {
      setError(result.error ?? 'Could not sign in.');
      return;
    }
    setError('');
    if (nextRole === 'doctor') setPath('/doctor');
    else {
      const patient = patients.find((item) => item.email.toLowerCase() === nextEmail.trim().toLowerCase());
      setPath(patient?.onboardingComplete ? '/world' : '/world');
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    completeLogin(role, email, password);
  }

  function chooseRole(nextRole: DemoRole) {
    setRole(nextRole);
    setEmail(demoAccounts.find((account) => account.role === nextRole)?.email ?? '');
    setError('');
  }

  return (
    <AppFrame className="hb-auth-page">
      <div className="hb-auth-layout max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center py-6">
        <section className="hb-auth-art flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-xs font-semibold text-pink-300">
            <Flower2 size={14} className="text-pink-400" />
            <span>Welcome to HitaBloom</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-slate-300 text-sm md:text-base mb-6 max-w-md">
            Login to your HitaBloom account to continue your personal wellbeing journey or manage patient care.
          </p>
          <div className="hidden md:block rounded-2xl overflow-hidden border border-white/20 shadow-xl max-w-sm">
            <img src="/assets/landing/hero-bg.png" alt="HitaBloom World" className="w-full h-44 object-cover" />
          </div>
        </section>

        <GlassPanel className="hb-auth-card flex-1 w-full max-w-md p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-indigo-500 flex items-center justify-center text-white mb-2 shadow-lg">
              <Flower2 size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Login</h2>
            <p className="text-xs text-slate-300">Choose your role to enter the demo workspace</p>
          </div>

          {/* Patient / Doctor Switch */}
          <div className="hb-role-switch mb-5 p-1 rounded-xl bg-slate-900/40 border border-white/10 flex" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'patient'}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'patient' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => chooseRole('patient')}
              data-testid="tab-patient-login"
            >
              <Heart size={14} /> Patient
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'doctor'}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'doctor' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => chooseRole('doctor')}
              data-testid="tab-doctor-login"
            >
              <Stethoscope size={14} /> Doctor
            </button>
          </div>

          <form className="hb-form flex flex-col gap-4" onSubmit={submit}>
            <div>
              <FieldLabel htmlFor="login-email">Email address</FieldLabel>
              <input
                id="login-email"
                className="hb-input w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                data-testid="input-login-email"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <span className="text-xs text-pink-300 hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <input
                id="login-password"
                className="hb-input w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
                data-testid="input-login-password"
              />
            </div>

            {error && (
              <p className="hb-form-error text-xs text-rose-300 bg-rose-500/20 p-2.5 rounded-lg border border-rose-500/30" role="alert" data-testid="status-login-error">
                {error}
              </p>
            )}

            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg hover:shadow-pink-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
              type="submit"
              data-testid="button-login"
            >
              Login <ArrowRight size={16} />
            </button>
          </form>

          {/* Mock Social Sign In */}
          <div className="mt-5 text-center">
            <span className="text-xs text-slate-400">or continue with</span>
            <div className="flex justify-center gap-3 mt-2.5">
              <button type="button" onClick={() => completeLogin(role, email, 'demo')} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-semibold transition-all">
                Google
              </button>
              <button type="button" onClick={() => completeLogin(role, email, 'demo')} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-semibold transition-all">
                Apple
              </button>
              <button type="button" onClick={() => completeLogin(role, email, 'demo')} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-semibold transition-all">
                Microsoft
              </button>
            </div>
          </div>

          <div className="hb-divider my-4 border-t border-white/10" />

          {/* Quick 1-click Demo Accounts List */}
          <DemoAccountList role={role} onChoose={(nextEmail) => completeLogin(role, nextEmail, 'demo')} />

          {role === 'patient' && (
            <p className="hb-auth-footer text-center text-xs text-slate-300 mt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-pink-300 font-bold hover:underline" data-testid="link-create-account">
                Sign up
              </Link>
            </p>
          )}
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

export function SignUp() {
  const { signup } = useDemo();
  const [, setPath] = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = signup(name, email, password, language);
    if (!result.ok) {
      setError(result.error ?? 'Could not create a demo account.');
      return;
    }
    setPath('/onboarding');
  }

  return (
    <AppFrame className="hb-auth-page">
      <div className="hb-auth-layout max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center py-6">
        <section className="hb-auth-art flex-1 text-center md:text-left">
          <span className="hb-eyebrow">Your own corner of the world</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            Make space<br /><span>to grow.</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base mb-6">
            Create a local demo patient profile. Dr. Maya will be your assigned clinician in this demonstration.
          </p>
        </section>
        <GlassPanel className="hb-auth-card flex-1 w-full max-w-md p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
          <div className="hb-auth-heading mb-4">
            <span className="hb-eyebrow">Patient account</span>
            <h2 className="text-2xl font-bold text-white">Create your profile</h2>
          </div>
          <form className="hb-form flex flex-col gap-3" onSubmit={submit}>
            <div>
              <FieldLabel htmlFor="signup-name">Your name</FieldLabel>
              <input id="signup-name" className="hb-input w-full" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="What should we call you?" data-testid="input-signup-name" />
            </div>
            <div>
              <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
              <input id="signup-email" className="hb-input w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" data-testid="input-signup-email" />
            </div>
            <div>
              <FieldLabel htmlFor="signup-password">Demo password</FieldLabel>
              <input id="signup-password" className="hb-input w-full" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={4} placeholder="At least 4 characters" data-testid="input-signup-password" />
            </div>
            <div>
              <FieldLabel htmlFor="signup-language">Preferred language</FieldLabel>
              <select id="signup-language" className="hb-input w-full" value={language} onChange={(event) => setLanguage(event.target.value)} data-testid="select-signup-language">
                {languages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            {error && <p className="hb-form-error text-xs text-rose-300" role="alert" data-testid="status-signup-error">{error}</p>}
            <button className="hb-button hb-button-full mt-2" type="submit" data-testid="button-signup">
              Create demo account <ArrowRight size={16} />
            </button>
          </form>
          <p className="hb-auth-footer text-center text-xs text-slate-300 mt-4">
            Already have a profile? <Link href="/login" data-testid="link-back-to-login" className="text-pink-300 font-bold">Sign in</Link>
          </p>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

const avatarOptions = {
  skin: [['#f0c7a1', 'Light'], ['#d99d75', 'Medium light'], ['#bd7957', 'Medium'], ['#844f3e', 'Deep']],
  hair: [['short', 'Short'], ['wavy', 'Wavy'], ['curly', 'Curly'], ['long', 'Long']],
  hairColor: [['#49372f', 'Espresso'], ['#7b4b36', 'Chestnut'], ['#b97942', 'Copper'], ['#302a36', 'Midnight']],
  face: [['round', 'Round'], ['oval', 'Oval']],
  outfit: [['sage', 'Garden green'], ['coral', 'Coral'], ['lavender', 'Lavender']],
  glasses: [['false', 'No glasses'], ['true', 'Glasses']],
  accessory: [['flower', 'Flower'], ['star', 'Star'], ['none', 'None']],
  expression: [['happy', 'Happy'], ['curious', 'Curious'], ['calm', 'Calm']],
} as const;

function AvatarControls({ avatar, update }: { avatar: DemoState['avatarStyle']; update: (style: DemoState['avatarStyle']) => void }) {
  return (
    <div className="hb-avatar-controls grid grid-cols-2 gap-3">
      {(Object.keys(avatarOptions) as (keyof typeof avatarOptions)[]).map((key) => (
        <label key={key} className="hb-control-label">
          <span className="text-xs text-slate-300 font-medium">{key === 'hairColor' ? 'Hair color' : key === 'skin' ? 'Skin tone' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
          <select
            className="hb-input w-full text-xs"
            aria-label={key === 'hairColor' ? 'Hair color' : key}
            value={key === 'glasses' ? String(avatar.glasses) : avatar[key]}
            onChange={(event) => update({ ...avatar, [key]: key === 'glasses' ? event.target.value === 'true' : event.target.value } as DemoState['avatarStyle'])}
            data-testid={`select-avatar-${key}`}
          >
            {avatarOptions[key].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      ))}
    </div>
  );
}

// ============================================================
// 8. ONBOARDING (MOCKUP SCREENS 2 & 3)
// ============================================================
export function Onboarding() {
  const { state, update } = useDemo();
  const [, setPath] = useLocation();
  const [step, setStep] = useState<'language' | 'avatar'>('language');
  const [language, setLanguage] = useState(state.language);
  const [avatar, setAvatar] = useState(state.avatarStyle);
  const [avatarName, setAvatarName] = useState(state.name || 'Aarav');
  const [activeTab, setActiveTab] = useState<'style' | 'outfit' | 'accessories'>('style');

  const languageCards = [
    { name: 'English', flag: '🇬🇧', native: 'English' },
    { name: 'Hindi', flag: '🇮🇳', native: 'हिंदी' },
    { name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
    { name: 'Greek', flag: '🇬🇷', native: 'Ελληνικά' },
    { name: 'Yoruba', flag: '🇳🇬', native: 'Yorùbá' },
  ];

  function continueToWorld() {
    update({ name: avatarName, language, avatarStyle: avatar, onboardingComplete: true });
    setPath('/world');
  }

  return (
    <AppFrame className="hb-onboarding-page">
      <div className="max-w-2xl mx-auto py-4">
        {step === 'language' ? (
          /* Screen 2: Choose Your Language */
          <GlassPanel className="p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-400 to-indigo-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Flower2 size={28} />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Choose Your Language</h2>
            <p className="text-slate-300 text-sm mb-6">Let's make HitaBloom feel like home.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {languageCards.map((lang) => (
                <button
                  type="button"
                  key={lang.name}
                  onClick={() => setLanguage(lang.name)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    language === lang.name
                      ? 'bg-pink-500/20 border-pink-400 ring-2 ring-pink-400 shadow-lg'
                      : 'bg-white/5 border-white/15 hover:bg-white/10'
                  }`}
                  data-testid={`button-language-${lang.name.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <strong className="block text-white text-sm">{lang.name}</strong>
                      <small className="text-slate-300 text-xs">{lang.native}</small>
                    </div>
                  </div>
                  {language === lang.name && (
                    <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center">
                      <Check size={14} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl transition-all"
              type="button"
              onClick={() => {
                update({ language });
                setStep('avatar');
              }}
              data-testid="button-language-continue"
            >
              Continue <ArrowRight size={16} className="inline ml-1" />
            </button>
          </GlassPanel>
        ) : (
          /* Screen 3: Avatar Setup */
          <GlassPanel className="p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-indigo-500 flex items-center justify-center text-white mx-auto mb-2 shadow-lg">
                <Flower2 size={24} />
              </div>
              <h2 className="text-3xl font-extrabold text-white">Create Your Avatar</h2>
              <p className="text-slate-300 text-sm">Meet your HitaBloom self!</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
              {/* Left: Avatar preview */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-44 h-56 rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl bg-gradient-to-b from-indigo-950/70 to-purple-950/70 flex items-center justify-center p-3">
                  <PatientAvatar style={avatar} label={avatarName} full />
                </div>
                <div className="mt-3 text-center">
                  <span className="text-xs text-pink-300 font-bold uppercase tracking-wider">Bitmoji Style</span>
                </div>
              </div>

              {/* Right: Controls & customization */}
              <div className="flex-1 w-full">
                <div className="flex gap-2 mb-4 border-b border-white/15 pb-2">
                  {(['style', 'outfit', 'accessories'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        activeTab === tab ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <AvatarControls avatar={avatar} update={setAvatar} />

                <div className="mt-4">
                  <FieldLabel htmlFor="avatar-name">Name your avatar</FieldLabel>
                  <input
                    id="avatar-name"
                    className="hb-input w-full mt-1"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Aarav"
                    data-testid="input-avatar-name"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/15">
              <button
                className="hb-button hb-button-secondary"
                type="button"
                onClick={() => setStep('language')}
                data-testid="button-back-to-language"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <button
                className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl transition-all"
                type="button"
                onClick={continueToWorld}
                data-testid="button-enter-world"
              >
                Continue to World <ArrowRight size={16} className="inline ml-1" />
              </button>
            </div>
          </GlassPanel>
        )}
      </div>
    </AppFrame>
  );
}

// ============================================================
// 1. PATIENT WORLD (MOCKUP SCREEN 5) — HIGHEST PRIORITY
// ============================================================
export function World() {
  const { state, update } = useDemo();
  const [, setPath] = useLocation();

  // Dynamic progression checks
  const progressByArea: Record<string, number> = {
    'Brain Garden': state.brain,
    'Heart Garden': state.heart,
    'Lung Valley': state.lung,
    'Bone Mountains': state.bone,
    'Muscle Meadow': state.muscle,
    'Cultural Garden': state.cultural,
  };

  const unlockedByArea: Record<string, boolean> = {
    'Brain Garden': true,
    'Heart Garden': true,
    'Lung Valley': state.lungUnlocked || state.lung > 0 || (state.analyzed && state.learningArea === 'Lung Valley'),
    'Bone Mountains': Boolean(state.boneUnlocked || state.bone > 0 || (state.analyzed && state.learningArea === 'Bone Mountains')),
    'Muscle Meadow': Boolean(state.muscleUnlocked || state.muscle > 0 || (state.analyzed && state.learningArea === 'Muscle Meadow')),
    'Cultural Garden': true,
  };

  const bloomedByArea: Record<string, boolean> = {
    'Brain Garden': state.brain >= 100,
    'Heart Garden': state.heart >= 100,
    'Lung Valley': state.lung >= 100,
    'Bone Mountains': state.bone >= 100,
    'Muscle Meadow': state.muscle >= 100,
    'Cultural Garden': state.cultural >= 100,
  };

  const hotspots = [
    {
      name: 'Brain Garden',
      icon: '🧠',
      top: '24%',
      left: '20%',
      progress: `${state.brain}%`,
      status: bloomedByArea['Brain Garden'] ? 'Bloomed' : 'Unlocked',
      unlocked: true,
      bloomed: bloomedByArea['Brain Garden'],
    },
    {
      name: 'Heart Garden',
      icon: '❤️',
      top: '64%',
      left: '25%',
      progress: `${state.heart}%`,
      status: bloomedByArea['Heart Garden'] ? 'Bloomed' : 'Unlocked',
      unlocked: true,
      bloomed: bloomedByArea['Heart Garden'],
    },
    {
      name: 'Lung Valley',
      icon: '🫁',
      top: '20%',
      left: '84%',
      progress: `${state.lung}%`,
      status: bloomedByArea['Lung Valley'] ? 'Bloomed' : unlockedByArea['Lung Valley'] ? 'Unlocked' : 'Locked',
      unlocked: unlockedByArea['Lung Valley'],
      bloomed: bloomedByArea['Lung Valley'],
    },
    {
      name: 'Bone Mountains',
      icon: '🦴',
      top: '24%',
      left: '60%',
      progress: `${state.bone}%`,
      status: bloomedByArea['Bone Mountains'] ? 'Bloomed' : unlockedByArea['Bone Mountains'] ? 'Unlocked' : 'Locked',
      unlocked: unlockedByArea['Bone Mountains'],
      bloomed: bloomedByArea['Bone Mountains'],
    },
    {
      name: 'Muscle Meadow',
      icon: '💪',
      top: '64%',
      left: '78%',
      progress: `${state.muscle}%`,
      status: bloomedByArea['Muscle Meadow'] ? 'Bloomed' : unlockedByArea['Muscle Meadow'] ? 'Unlocked' : 'Locked',
      unlocked: unlockedByArea['Muscle Meadow'],
      bloomed: bloomedByArea['Muscle Meadow'],
    },
    {
      name: 'Cultural Garden',
      icon: '🌿',
      top: '52%',
      left: '50%',
      progress: `${state.cultural}%`,
      status: 'Unlocked',
      unlocked: true,
      bloomed: bloomedByArea['Cultural Garden'],
    },
  ];

  function handleHotspotClick(hotspotName: string, isUnlocked: boolean) {
    if (!isUnlocked) return;
    if (hotspotName === 'Cultural Garden') {
      setPath('/cultural');
    } else {
      update({ learningArea: hotspotName });
      setPath('/character');
    }
  }

  // Dismiss bloom celebration
  const dismissCelebration = () => {
    update({ justBloomedArea: undefined, justUnlockedArea: undefined });
  };

  return (
    <AppFrame className="hb-world-page">
      {/* Bloom / Unlock Celebration Modal */}
      {(state.justBloomedArea || state.justUnlockedArea) && (
        <div className="hb-celebration-overlay" onClick={dismissCelebration}>
          <div className="hb-celebration-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl animate-bounce">🌸✨🎉</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {state.justBloomedArea ? `${state.justBloomedArea} Bloomed!` : 'Milestone Reached!'}
            </h2>
            {state.justUnlockedArea && (
              <p className="text-pink-300 font-semibold text-lg">
                ✨ {state.justUnlockedArea} is now Unlocked!
              </p>
            )}
            <p className="text-sm text-slate-300">
              Your dedication and doctor-approved steps helped your health world bloom!
            </p>
            <div className="flex gap-4">
              <span className="px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/40">
                ⭐ +50 XP
              </span>
              <span className="px-3 py-1.5 rounded-full bg-orange-400/20 text-orange-300 font-bold text-xs border border-orange-400/40">
                🔥 +1 Day Streak
              </span>
            </div>
            <button
              type="button"
              onClick={dismissCelebration}
              className="mt-2 px-8 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* World Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span className="hb-eyebrow flex items-center gap-1.5 text-pink-300">
            <Sparkles size={14} /> HitaBloom World
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Good day, <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">{state.name}</span>
          </h1>
        </div>

        {/* Header Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 shadow">
            <span className="text-orange-400">🔥</span> {state.streak} Day Streak
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 shadow">
            <span className="text-amber-300">⭐</span> {state.xp} XP
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <PatientAvatar style={state.avatarStyle} label={state.name} small />
            <span className="text-xs text-white font-semibold hidden sm:inline">Level {Math.floor(state.xp / 100) + 1}</span>
          </div>
        </div>
      </div>

      {/* 2D FANTASY WORLD SCENE WITH HOTSPOTS */}
      <div className="hb-fantasy-world-container mb-6">
        <div className="hb-fantasy-world-stage" role="region" aria-label="HitaBloom 2D Fantasy Health World Map">
          {/* Hotspots */}
          {hotspots.map((h) => {
            const isUnlocked = h.unlocked;
            const isBloomed = h.bloomed;
            return (
              <button
                key={h.name}
                type="button"
                className={`hb-world-hotspot ${!isUnlocked ? 'is-locked' : ''}`}
                style={{ top: h.top, left: h.left }}
                onClick={() => handleHotspotClick(h.name, isUnlocked)}
                disabled={!isUnlocked}
                data-testid={`button-area-${h.name.toLowerCase().replaceAll(' ', '-')}`}
                title={isUnlocked ? `${h.name} (${h.progress})` : `${h.name} (Locked)`}
              >
                <div className={`hb-hotspot-pin ${isBloomed ? 'bloomed' : !isUnlocked ? 'locked' : ''}`}>
                  <span>{h.icon}</span>
                  <span>{h.name}</span>
                  <span className={`hb-hotspot-badge ${isBloomed ? 'badge-bloomed' : isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}>
                    {isBloomed ? 'Bloomed' : isUnlocked ? `${h.progress}` : 'Locked'}
                  </span>
                </div>
                <div className={`hb-hotspot-pulse ${isBloomed ? 'bloomed' : !isUnlocked ? 'locked' : ''}`} />
              </button>
            );
          })}

          {/* Patient Avatar standing in foreground */}
          <div className="hb-world-avatar-standing" style={{ bottom: '10%', left: '50%' }}>
            {state.id === 'aarav' && !state.onboardingComplete ? (
              <img src="/assets/characters/aarav.png" alt={`${state.name} in HitaBloom World`} />
            ) : (
              <div className="w-20 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/40 flex items-center justify-center p-1 bg-indigo-950/80 backdrop-blur-md">
                <PatientAvatar style={state.avatarStyle} label={state.name} size="large" />
              </div>
            )}
          </div>

          {/* Floating Pill CTA */}
          <Link
            href="/journey"
            className="hb-world-floating-cta"
            data-testid="button-world-cta"
          >
            <MessageCircle size={18} className="text-white" />
            <span>Tell HitaBloom what you're feeling</span>
          </Link>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="hb-world-bottom-nav" aria-label="World Navigation">
          <Link href="/world" className="hb-world-nav-item is-active" data-testid="world-nav-home">
            <span className="text-base">🏠</span>
            <span>Home</span>
          </Link>
          <Link href="/progress" className="hb-world-nav-item" data-testid="world-nav-progress">
            <span className="text-base">📈</span>
            <span>Progress</span>
          </Link>
          <Link href="/quests" className="hb-world-nav-item" data-testid="world-nav-quests">
            <span className="text-base">🎯</span>
            <span>Quests</span>
          </Link>
          <Link href="/messages" className="hb-world-nav-item" data-testid="world-nav-messages">
            <span className="text-base">💬</span>
            <span>Messages</span>
          </Link>
          <Link href="/profile" className="hb-world-nav-item" data-testid="world-nav-profile">
            <span className="text-base">👤</span>
            <span>Profile</span>
          </Link>
        </nav>
      </div>

      {/* World Lower Quick Info Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassPanel className="p-5 rounded-2xl">
          <span className="hb-eyebrow text-pink-300">Active Quest</span>
          <h3 className="text-lg font-bold text-white mb-1">
            {state.questStatus === 'active' ? state.questTitle : state.questStatus === 'pending' ? 'Dr. Maya is reviewing your quest' : 'Start with what you notice'}
          </h3>
          <p className="text-xs text-slate-300 mb-3">
            {state.questStatus === 'active'
              ? 'A doctor-approved quest is active and ready whenever you are.'
              : state.questStatus === 'pending'
              ? 'Your suggestion will activate as soon as Dr. Maya approves it.'
              : 'Share a symptom or question to begin learning with body guides.'}
          </p>
          <ButtonLink href={state.questStatus === 'active' || state.questStatus === 'completed' ? '/quests' : '/journey'} small>
            {state.questStatus === 'active' || state.questStatus === 'completed' ? 'Open my quest' : 'Start my journey'} <ArrowRight size={14} />
          </ButtonLink>
        </GlassPanel>

        <GlassPanel className="p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="hb-eyebrow text-cyan-300">World Progress</span>
            <Link href="/progress" className="text-xs text-cyan-300 font-bold hover:underline">Details →</Link>
          </div>
          <div className="flex justify-between text-xs text-slate-300 mb-2 font-semibold">
            <span>Gardens Explored</span>
            <span>{Object.values(unlockedByArea).filter(Boolean).length} of 6</span>
          </div>
          <ProgressBar value={Math.round((Object.values(unlockedByArea).filter(Boolean).length / 6) * 100)} label="Areas explored" />
          <p className="text-xs text-slate-400 mt-3">Growth is not a race. Rest is part of the journey too.</p>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

// ============================================================
// 9. SYMPTOM JOURNEY (MOCKUP SCREENS 6 & 7)
// ============================================================
export function Journey() {
  const { state, update } = useDemo();
  // CRITICAL: The example text must NEVER be stored as default patient data; initialized empty!
  const [symptom, setSymptom] = useState('');
  const [error, setError] = useState('');
  const [, setPath] = useLocation();

  const suggestionPills = [
    'I have a sore throat and mild cough.',
    'I’ve been feeling tired lately.',
    'Why does my head hurt?',
  ];

  function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = symptom.trim();
    if (!cleaned) {
      setError('Please describe your symptom or question first.');
      return;
    }
    const analysis = analyzeSymptom(cleaned);
    if (!analysis) return;
    const learningArea = analysis.learningArea;
    const needsQuest = state.questStatus === 'none' || state.questStatus === 'rejected';
    const suggestion = needsQuest ? suggestQuest(learningArea) : null;

    update({
      symptom: cleaned,
      analyzed: true,
      learningArea,
      ...(suggestion ? {
        questStatus: suggestion.status,
        questTitle: suggestion.title,
        questMinutes: suggestion.minutes,
        questNote: suggestion.note,
      } : {}),
      notification: analysis.message,
    });
  }

  const guide = state.learningArea ? (generateBodyExplanation(state.learningArea, state.language).guide) : null;

  return (
    <AppFrame className="hb-journey-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Patient journey · step 01"
          title="Tell HitaBloom what you’re feeling"
          subtitle="Describe your symptom or question. HitaBloom matches your words to an educational learning area only; it does not diagnose a condition."
          action={<ButtonLink href="/world" secondary><ArrowLeft size={15} /> Back to World</ButtonLink>}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left / Main: Input Card (Mockup Screen 6) */}
          <GlassPanel className="md:col-span-7 p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl overflow-hidden border border-white/25 shadow flex items-center justify-center p-1 bg-indigo-950/40 flex-shrink-0">
                <PatientAvatar style={state.avatarStyle} label={state.name} size="medium" />
              </div>
              <div className="min-w-0 flex-1">
                <Tag><MessageCircle size={13} /> Your words stay yours</Tag>
                <h2 className="text-xl font-bold text-white mt-1 truncate">What are you feeling?</h2>
              </div>
            </div>

            <form onSubmit={analyze} className="flex flex-col gap-4">
              <div>
                <FieldLabel htmlFor="symptom">Describe your symptom or question in your own words</FieldLabel>
                <textarea
                  id="symptom"
                  className="hb-input hb-textarea w-full p-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm leading-relaxed"
                  rows={4}
                  value={symptom}
                  onChange={(event) => { setSymptom(event.target.value); setError(''); }}
                  placeholder="Describe your symptom or question in your own words..."
                  data-testid="input-symptom"
                />
              </div>

              {/* Suggestion Pills */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-slate-300 font-semibold">Try an example:</span>
                <div className="flex flex-wrap gap-2">
                  {suggestionPills.map((pill) => (
                    <button
                      type="button"
                      key={pill}
                      onClick={() => { setSymptom(pill); setError(''); }}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-slate-200 transition-all text-left"
                    >
                      e.g. {pill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10 text-xs text-slate-300 flex items-start gap-2">
                <ShieldCheck size={16} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                <span>If symptoms feel severe or urgent, contact local emergency services or your clinician right away.</span>
              </div>

              {error && <p className="hb-form-error text-xs text-rose-300" role="alert" data-testid="status-symptom-error">{error}</p>}

              <button
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
                type="submit"
                data-testid="button-analyze"
              >
                Continue <ArrowRight size={16} />
              </button>
            </form>
          </GlassPanel>

          {/* Right: AI Match Result (Mockup Screen 7) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {state.analyzed && state.learningArea ? (
              <GlassPanel className="p-6 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-white/25 shadow-2xl animate-fade-in" testId="card-learning-area">
                <div className="text-center mb-4">
                  <span className="text-xs uppercase tracking-wider text-pink-300 font-bold">HitaBloom has matched your topic to:</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1 flex items-center justify-center gap-2">
                    <Sparkles size={20} className="text-pink-400" /> {state.learningArea}
                  </h3>
                  <p className="text-xs text-cyan-200 mt-1">Let’s learn together!</p>
                </div>

                {/* Character preview card */}
                {guide && (
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/30 flex-shrink-0 shadow-lg">
                      <img src={CHARACTER_REGISTRY[guide.name]?.image || '/assets/characters/luma.png'} alt={guide.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Meet {guide.name}</h4>
                      <p className="text-xs text-slate-300 leading-normal">
                        The friendly {state.learningArea} Explorer. I’ll help you understand how this body system works.
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-300 mb-4 text-center">
                  Educational match only. It does not identify a cause or diagnose a condition.
                </p>

                <button
                  type="button"
                  onClick={() => setPath('/character')}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                  data-testid="button-meet-guide"
                >
                  Speak with {guide?.name || 'Guide'} <ArrowRight size={16} />
                </button>
              </GlassPanel>
            ) : (
              <GlassPanel className="p-6 rounded-3xl">
                <span className="hb-eyebrow">Your Path</span>
                <JourneyStep number={1} title="Share what you notice" body="Use your own words." complete={state.analyzed} />
                <JourneyStep number={2} title="Learn with a body guide" body="Explore general body knowledge." complete={state.analyzed && !!state.learningArea} />
                <JourneyStep number={3} title="Grow with Dr. Maya" body="Your doctor approves quests and writes your care plan." />
              </GlassPanel>
            )}
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

// ============================================================
// 10. BODY CHARACTER EXPERIENCE (MOCKUP SCREEN 8)
// ============================================================
const CHARACTER_AUDIO_TRACKS: Record<string, Record<string, string>> = {
  Luma: {
    Telugu: '/assets/audio/luma/luma-te.mp3',
    Greek: '/assets/audio/luma/luma-el.mp3',
    Hindi: '/assets/audio/luma/luma-hi.mp3',
    Yoruba: '/assets/audio/luma/luma-yo.mp3',
    English: '/assets/audio/characters/luma-en.mp3',
  },
  Bri: {
    Telugu: '/assets/audio/characters/bri-te.mp3',
    Greek: '/assets/audio/characters/bri-el.mp3',
    Hindi: '/assets/audio/characters/bri-hi.mp3',
    Yoruba: '/assets/audio/characters/bri-yo.mp3',
    English: '/assets/audio/characters/bri-en.mp3',
  },
  Cora: {
    Telugu: '/assets/audio/characters/cora-te.mp3',
    Greek: '/assets/audio/characters/cora-el.mp3',
    Hindi: '/assets/audio/characters/cora-hi.mp3',
    Yoruba: '/assets/audio/characters/cora-yo.mp3',
    English: '/assets/audio/characters/cora-en.mp3',
  },
  Bony: {
    Telugu: '/assets/audio/characters/bony-te.mp3',
    Greek: '/assets/audio/characters/bony-el.mp3',
    Hindi: '/assets/audio/characters/bony-hi.mp3',
    Yoruba: '/assets/audio/characters/bony-yo.mp3',
    English: '/assets/audio/characters/bony-en.mp3',
  },
  Milo: {
    Telugu: '/assets/audio/characters/milo-te.mp3',
    Greek: '/assets/audio/characters/milo-el.mp3',
    Hindi: '/assets/audio/characters/milo-hi.mp3',
    Yoruba: '/assets/audio/characters/milo-yo.mp3',
    English: '/assets/audio/characters/milo-en.mp3',
  },
};

export function CharacterPage() {
  const { state, update } = useDemo();
  const [draft, setDraft] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayingAudioTrack, setIsPlayingAudioTrack] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReplySpeaking, setIsReplySpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const replyAudioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const explanation = generateBodyExplanation(state.learningArea || 'Lung Valley', state.language);
  const guide = explanation.guide;
  const activeCharName = guide.name;
  const currentQuestion = state.characterChats?.[activeCharName] || '';
  const answer = currentQuestion ? answerCharacterQuestion(currentQuestion, state.language, state.symptom) : null;
  const userQuestionTranslation = currentQuestion ? translateUserText(currentQuestion, state.language) : { translated: '', original: '', isTranslated: false };
  const isLuma = guide.name === 'Luma';
  const isEnglish = state.language === 'English';
  const guideTrack = CHARACTER_AUDIO_TRACKS[guide.name]?.[state.language];
  const guideMeta = CHARACTER_REGISTRY[guide.name];
  const activeVideoUrl = isLuma ? '/assets/characters/luma video.mp4' : guideMeta?.videoUrl;
  const activePosterUrl = isLuma ? '/assets/characters/luma.png' : (guideMeta?.posterImage || guideMeta?.image || '/assets/characters/luma.png');

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setVoices(v);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const matchingVoice = useMemo(() => {
    return findSpeechVoice(state.language, voices);
  }, [state.language, voices]);

  function stopAllAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (replyAudioRef.current) {
      replyAudioRef.current.pause();
      replyAudioRef.current.currentTime = 0;
    }
    setIsPlayingAudioTrack(false);
    setIsReplySpeaking(false);
    stopSpeechSynthesis();
    setIsSpeaking(false);
  }

  // Stop previous speech & audio when language changes or leaving character page
  useEffect(() => {
    stopAllAudio();
    return () => {
      stopAllAudio();
    };
  }, [state.language]);

  useEffect(() => {
    if (activeVideoUrl && videoRef.current && !videoFailed) {
      if (isEnglish) {
        // English: preserve native talking video audio
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              setVideoFailed(true);
            });
          }
        });
      } else {
        // Non-English: keep video visually active but muted so English speech doesn't clash
        videoRef.current.muted = true;
        setIsMuted(true);
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setVideoFailed(true);
        });
      }
    }
  }, [activeVideoUrl, videoFailed, isEnglish]);

  function playTrack(trackUrl: string) {
    if (isPlayingAudioTrack) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    const audio = new Audio(trackUrl);
    audioRef.current = audio;
    audio.onended = () => setIsPlayingAudioTrack(false);
    audio.onerror = () => {
      setIsPlayingAudioTrack(false);
      toggleSpeech();
    };
    audio.play().then(() => {
      setIsPlayingAudioTrack(true);
    }).catch(() => {
      setIsPlayingAudioTrack(false);
      toggleSpeech();
    });
  }

  function togglePlay() {
    if (activeVideoUrl && videoRef.current && !videoFailed) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      if (!isEnglish && guideTrack) {
        if (isPlayingAudioTrack || isSpeaking) {
          stopAllAudio();
        } else {
          playTrack(guideTrack);
        }
      }
    } else {
      if (isPlayingAudioTrack || isSpeaking) {
        stopAllAudio();
      } else if (guideTrack) {
        playTrack(guideTrack);
      } else if (matchingVoice) {
        toggleSpeech();
      } else {
        setIsSpeaking(!isSpeaking);
      }
    }
  }

  function toggleSpeech(customText?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeechSynthesis();
      setIsSpeaking(false);
    } else if (matchingVoice) {
      stopSpeechSynthesis();
      const textToSpeak = customText || explanation.text;
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.voice = matchingVoice;
      utter.pitch = 1.15;
      utter.rate = 1.05;
      const meta = LANGUAGE_SPEECH_MAP[state.language];
      if (meta) utter.lang = meta.bcp47;
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setIsSpeaking(true);
    }
  }

  function toggleAudio() {
    if (isEnglish) {
      if (videoRef.current && !videoFailed) {
        const nextMuted = !isMuted;
        videoRef.current.muted = nextMuted;
        setIsMuted(nextMuted);
        if (videoRef.current.paused) {
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      } else if (guideTrack) {
        playTrack(guideTrack);
      }
    } else {
      if (isPlayingAudioTrack || isSpeaking) {
        stopAllAudio();
        return;
      }
      if (guideTrack) {
        playTrack(guideTrack);
      } else {
        toggleSpeech();
      }
    }
  }

  function playReplyAudio(audioUrl?: string, fallbackText?: string) {
    if (isReplySpeaking) {
      if (replyAudioRef.current) {
        replyAudioRef.current.pause();
        replyAudioRef.current.currentTime = 0;
      }
      stopSpeechSynthesis();
      setIsReplySpeaking(false);
      return;
    }

    stopAllAudio();

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      replyAudioRef.current = audio;
      audio.onended = () => setIsReplySpeaking(false);
      audio.onerror = () => {
        fallbackSpeak(fallbackText || answer?.text || '');
      };
      audio.play().then(() => {
        setIsReplySpeaking(true);
      }).catch(() => {
        fallbackSpeak(fallbackText || answer?.text || '');
      });
      return;
    }

    fallbackSpeak(fallbackText || answer?.text || '');
  }

  function fallbackSpeak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsReplySpeaking(false);
      return;
    }
    stopSpeechSynthesis();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = findSpeechVoice(state.language, voices);
    if (voice) utter.voice = voice;
    utter.pitch = 1.15;
    utter.rate = 1.05;
    const meta = LANGUAGE_SPEECH_MAP[state.language];
    if (meta) utter.lang = meta.bcp47;
    utter.onend = () => setIsReplySpeaking(false);
    utter.onerror = () => setIsReplySpeaking(false);
    window.speechSynthesis.speak(utter);
    setIsReplySpeaking(true);
  }

  function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    const questionText = draft.trim();
    const nextChats = {
      ...(state.characterChats || {}),
      [activeCharName]: questionText,
    };
    update({
      characterChats: nextChats,
      followup: questionText,
    });
    setDraft('');

    // Automatically speak the character's answer
    setTimeout(() => {
      const freshAnswer = answerCharacterQuestion(questionText, state.language, state.symptom);
      playReplyAudio(freshAnswer.audioUrl, freshAnswer.text);
    }, 250);
  }

  return (
    <AppFrame className="hb-character-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow={`${state.learningArea || 'Lung Valley'} · ${guide.name}`}
          title={`${guide.name} — Your ${state.learningArea || 'Body'} Guide`}
          subtitle="Explore general body knowledge together. Dr. Maya remains the authoritative clinician for your personal care."
          action={<ButtonLink href="/world" secondary><ArrowLeft size={15} /> My World</ButtonLink>}
        />

        {/* Organ Switcher: Seamlessly explore each organ's dedicated character & chat */}
        <div className="flex flex-wrap items-center gap-2 mb-6 p-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
          <span className="text-xs text-pink-300 font-bold px-2">Explore Body Systems:</span>
          {[
            { area: 'Lung Valley', guide: 'Luma', icon: '🫁', role: 'Lungs' },
            { area: 'Brain Garden', guide: 'Bri', icon: '🧠', role: 'Brain' },
            { area: 'Heart Garden', guide: 'Cora', icon: '❤️', role: 'Heart' },
            { area: 'Bone Mountains', guide: 'Bony', icon: '🦴', role: 'Bones' },
            { area: 'Muscle Meadow', guide: 'Milo', icon: '💪', role: 'Muscles' },
          ].map((item) => {
            const isCurrent = (state.learningArea || 'Lung Valley') === item.area;
            return (
              <button
                key={item.area}
                type="button"
                onClick={() => {
                  stopAllAudio();
                  update({ learningArea: item.area });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
                title={`Switch to ${item.guide} (${item.role})`}
              >
                <span>{item.icon}</span>
                <span>{item.guide} ({item.role})</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
          {/* Main Character Presentation (Mockup Screen 8) */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <GlassPanel className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Large Character Avatar / Video */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl relative bg-gradient-to-tr from-pink-500/20 to-purple-500/20">
                    {activeVideoUrl && !videoFailed ? (
                      <video
                        ref={videoRef}
                        key={activeVideoUrl}
                        src={activeVideoUrl}
                        poster={activePosterUrl}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover"
                        onError={() => setVideoFailed(true)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    ) : (
                      <img
                        src={activePosterUrl}
                        alt={guide.name}
                        className="w-full h-full object-cover animate-hb-float"
                      />
                    )}

                    {/* Sound / Voice Toggle */}
                    {activeVideoUrl && !videoFailed && (
                      <button
                        type="button"
                        onClick={toggleAudio}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white shadow-md transition-transform active:scale-95 z-20 backdrop-blur-sm"
                        aria-label={
                          isEnglish
                            ? (isMuted ? 'Unmute video audio' : 'Mute video audio')
                            : (guideTrack || matchingVoice ? (isPlayingAudioTrack || isSpeaking ? 'Stop audio' : `Listen in ${state.language}`) : `Audio unavailable for ${state.language}`)
                        }
                        title={
                          isEnglish
                            ? (isMuted ? 'Click to enable audio' : 'Mute audio')
                            : (guideTrack || matchingVoice ? (isPlayingAudioTrack || isSpeaking ? 'Stop audio' : `Listen in ${state.language}`) : `Spoken audio unavailable for ${state.language}`)
                        }
                      >
                        {isEnglish ? (
                          isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-pink-300" />
                        ) : (
                          (guideTrack || matchingVoice) ? (
                            (isPlayingAudioTrack || isSpeaking) ? <Volume2 size={15} className="text-pink-300 animate-pulse" /> : <Volume2 size={15} className="text-white" />
                          ) : (
                            <VolumeX size={15} className="text-slate-400" />
                          )
                        )}
                      </button>
                    )}

                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 text-slate-900 shadow-md hover:scale-110 transition-transform z-20"
                      title={(activeVideoUrl && !videoFailed ? isPlaying : (isPlayingAudioTrack || isSpeaking)) ? 'Pause' : 'Play'}
                      aria-label={(activeVideoUrl && !videoFailed ? isPlaying : (isPlayingAudioTrack || isSpeaking)) ? 'Pause' : 'Play'}
                    >
                      {(activeVideoUrl && !videoFailed ? isPlaying : (isPlayingAudioTrack || isSpeaking)) ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>
                  <h3 className="font-extrabold text-white text-lg mt-2">{guide.name}</h3>
                  <span className="text-xs text-pink-300 font-semibold">{state.learningArea || 'Lung Valley'}</span>
                </div>

                {/* Speech Bubble */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="p-5 rounded-2xl bg-white/90 text-slate-900 shadow-xl border border-white/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                        <Sparkles size={13} /> Hi {state.name}! 🌿
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isEnglish ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-bold flex items-center gap-1">
                            {!videoFailed && !isMuted ? <Volume2 size={10} /> : null}
                            {!videoFailed ? (isMuted ? 'Video Muted' : 'Video Audio (EN)') : 'EN Subtitles'}
                          </span>
                        ) : (guideTrack || matchingVoice) ? (
                          <button
                            type="button"
                            onClick={toggleAudio}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold flex items-center gap-1 transition-all shadow-sm"
                            title={`Play audio in ${state.language}`}
                          >
                            {(isPlayingAudioTrack || isSpeaking) ? <Volume2 size={11} className="text-indigo-600 animate-pulse" /> : <Play size={10} />}
                            <span>{(isPlayingAudioTrack || isSpeaking) ? 'Stop Audio' : `Listen (${state.language})`}</span>
                          </button>
                        ) : (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium flex items-center gap-1"
                            title={`Spoken audio unavailable for ${state.language} in this browser · Showing localized text`}
                          >
                            <VolumeX size={11} className="text-slate-400" />
                            <span>Audio unavailable · {state.language} text</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed text-slate-800">
                      {explanation.text}
                    </p>
                  </div>

                  {/* Subtitle reference */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-white/10 text-xs text-slate-300 italic flex items-center justify-between">
                    <span>"{explanation.englishSubtitle}"</span>
                    {!isEnglish && (guideTrack || matchingVoice) && (
                      <button
                        type="button"
                        onClick={toggleAudio}
                        className="text-[11px] text-pink-300 hover:text-pink-200 underline ml-2 flex-shrink-0 not-italic font-semibold"
                      >
                        {(isPlayingAudioTrack || isSpeaking) ? 'Stop audio' : `Hear in ${state.language}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow-up question thread if asked for THIS character */}
              {currentQuestion && answer && (
                <div className="mt-6 pt-6 border-t border-white/15 flex flex-col gap-3">
                  <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-400/30 text-white text-xs md:text-sm self-end max-w-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-pink-300">
                        {state.language === 'English' ? 'You asked:' : `You asked (${state.language}):`}
                      </strong>
                      {userQuestionTranslation.isTranslated && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-400/30 text-purple-200">
                          Translated
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium">{userQuestionTranslation.translated || currentQuestion}</p>
                    {userQuestionTranslation.isTranslated && userQuestionTranslation.original !== userQuestionTranslation.translated && (
                      <div className="mt-2 pt-2 border-t border-purple-300/20 text-xs text-purple-200">
                        <span className="font-semibold text-pink-200">Original (EN):</span> {userQuestionTranslation.original}
                      </div>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-white/90 text-slate-900 text-xs md:text-sm shadow-md max-w-lg flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-purple-700">{guide.name} replies:</strong> {answer.text}
                      {answer.translated && answer.englishSubtitle && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">English subtitle:</span> {answer.englishSubtitle}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => playReplyAudio(answer.audioUrl, answer.text)}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm ${
                        isReplySpeaking
                          ? 'bg-purple-600 text-white animate-pulse shadow-md'
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-700 active:scale-95'
                      }`}
                      title={isReplySpeaking ? 'Stop audio' : `Listen to reply in ${state.language}`}
                      aria-label={isReplySpeaking ? 'Stop audio' : `Listen to reply in ${state.language}`}
                    >
                      <Volume2 size={15} />
                      <span className="text-[11px] font-bold">
                        {isReplySpeaking ? 'Playing...' : 'Listen'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Follow-up Question Input Form */}
              <form className="mt-6 flex flex-col gap-2" onSubmit={ask}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="character-question"
                      className="hb-input w-full pl-4 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={state.language === 'English' ? "Ask a follow-up question (e.g., Why do people cough?)" : `Ask in English or ${state.language} (e.g., Why do people cough?)`}
                      data-testid="input-follow-up"
                    />
                    <button type="button" className="absolute right-3 top-3 text-slate-400 hover:text-white" title="Voice input">
                      <Mic size={18} />
                    </button>
                  </div>
                  <button
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow hover:scale-105 active:scale-95 transition-all"
                    type="submit"
                    data-testid="button-send-question"
                  >
                    <Send size={16} />
                  </button>
                </div>
                {state.language !== 'English' && (
                  <p className="text-[11px] text-pink-200">
                    Questions typed in English are automatically translated to {state.language} in the chatbox.
                  </p>
                )}
              </form>
            </GlassPanel>
          </div>

          {/* Right: Quick Action Navigation */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-amber-300">Next Steps</span>
              <h3 className="text-lg font-bold text-white mb-2">Continue Your Care</h3>
              <p className="text-xs text-slate-300 mb-4">
                Explore cultural wellness insights related to this topic, or read Dr. Maya's authoritative care instructions.
              </p>
              <div className="flex flex-col gap-2.5">
                <ButtonLink href="/cultural">
                  <Flower2 size={16} /> Cultural Wellness Knowledge
                </ButtonLink>
                <ButtonLink href="/care" secondary>
                  <Stethoscope size={16} /> Dr. Maya's Care Plan
                </ButtonLink>
              </div>
            </GlassPanel>
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

// ============================================================
// 11. CULTURAL WELLNESS (MOCKUP SCREEN 9) — CONTEXTUAL DATA
// ============================================================
export interface CulturalFigure {
  id: string;
  code: string;
  name: string;
  title: string;
  culture: string;
  region: string;
  image: string;
  video: string;
  badgeEmoji: string;
  associatedPlace: 'India' | 'Greece' | 'Nigeria';
}

export const CULTURAL_FIGURES_BY_LANGUAGE: Record<string, CulturalFigure> = {
  English: {
    id: 'cultural-guide-en',
    code: 'en',
    name: 'Sage Rowan',
    title: 'Herbal Wisdom Sage',
    culture: 'Global Heritage',
    region: 'Universal Botanical Traditions',
    image: '/assets/characters/cultural-guide-en.png',
    video: '/assets/characters/cultural-guide-en.mp4',
    badgeEmoji: '🌿',
    associatedPlace: 'India',
  },
  Hindi: {
    id: 'cultural-guide-hi',
    code: 'hi',
    name: 'Vaidya Dadi',
    title: 'Ayurvedic Wellness Elder',
    culture: 'Indian Heritage',
    region: 'North Indian Ayurvedic Traditions',
    image: '/assets/characters/cultural-guide-hi.png',
    video: '/assets/characters/cultural-guide-hi.mp4',
    badgeEmoji: '🇮🇳',
    associatedPlace: 'India',
  },
  Telugu: {
    id: 'cultural-guide-te',
    code: 'te',
    name: 'Ammamma',
    title: 'Telugu Herbal Heritage Elder',
    culture: 'South Indian Heritage',
    region: 'Andhra & Telangana Herbal Traditions',
    image: '/assets/characters/cultural-guide-te.png',
    video: '/assets/characters/cultural-guide-te.mp4',
    badgeEmoji: '🇮🇳',
    associatedPlace: 'India',
  },
  Greek: {
    id: 'cultural-guide-el',
    code: 'el',
    name: 'YiaYia Eleni',
    title: 'Mediterranean Tisane Elder',
    culture: 'Hellenic Heritage',
    region: 'Greek Mountain Tisane Traditions',
    image: '/assets/characters/cultural-guide-el.png',
    video: '/assets/characters/cultural-guide-el.mp4',
    badgeEmoji: '🇬🇷',
    associatedPlace: 'Greece',
  },
  Yoruba: {
    id: 'cultural-guide-yo',
    code: 'yo',
    name: 'Ìyá Àgbà',
    title: 'Yoruba Traditional Healer Elder',
    culture: 'West African Heritage',
    region: 'Yoruba Botanical Traditions',
    image: '/assets/characters/cultural-guide-yo.png',
    video: '/assets/characters/cultural-guide-yo.mp4',
    badgeEmoji: '🇳🇬',
    associatedPlace: 'Nigeria',
  },
};

const CULTURAL_AUDIO_TRACKS: Record<string, string> = {
  English: '/assets/audio/cultural/cultural-en.mp3',
  Telugu: '/assets/audio/cultural/cultural-te.mp3',
  Greek: '/assets/audio/cultural/cultural-el.mp3',
  Hindi: '/assets/audio/cultural/cultural-hi.mp3',
  Yoruba: '/assets/audio/cultural/cultural-yo.mp3',
};

export function Cultural() {
  const { state, update } = useDemo();
  const [culture, setCulture] = useState('India');
  const [activeTab, setActiveTab] = useState<'tradition' | 'evidence' | 'safety'>('tradition');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [videoFailed, setVideoFailed] = useState<Record<string, boolean>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const learningArea = state.learningArea || 'Lung Valley';
  const entry: CulturalContext | null = generateCulturalContext(learningArea, culture, state.symptom);
  const culturalTrack = CULTURAL_AUDIO_TRACKS[state.language];
  const figure = CULTURAL_FIGURES_BY_LANGUAGE[state.language] || CULTURAL_FIGURES_BY_LANGUAGE.English;
  const isVideoFailed = Boolean(videoFailed[figure.code]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setVoices(v);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const culturalDialogue = culturalGuideDialogues[state.language] || culturalGuideDialogues.English;
  const culturalVoice = useMemo(() => {
    return findSpeechVoice(state.language, voices);
  }, [state.language, voices]);

  function stopCulturalAudio() {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    setIsVideoMuted(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    stopSpeechSynthesis();
    setIsPlayingVoice(false);
  }

  // Stop previous speech & audio when language changes or leaving Cultural page
  useEffect(() => {
    stopCulturalAudio();
    return () => {
      stopCulturalAudio();
    };
  }, [state.language]);

  function toggleCulturalAudio() {
    // 1. If video is active, toggle video mute to directly play embedded speech without duplication
    if (!isVideoFailed && videoRef.current) {
      const nextMuted = !isVideoMuted;
      videoRef.current.muted = nextMuted;
      setIsVideoMuted(nextMuted);
      if (!nextMuted) {
        if (videoRef.current.paused) {
          videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
        }
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlayingAudio(false);
        }
        stopSpeechSynthesis();
        setIsPlayingVoice(false);
      }
      return;
    }

    // 2. Fallback if video failed or unavailable: toggle standalone audio track or speech synthesis
    if (isPlayingAudio || isPlayingVoice) {
      stopCulturalAudio();
      return;
    }
    stopCulturalAudio();

    if (culturalTrack) {
      const audio = new Audio(culturalTrack);
      audioRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        setIsPlayingAudio(false);
        fallbackToSpeech();
      };
      audio.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        setIsPlayingAudio(false);
        fallbackToSpeech();
      });
    } else {
      fallbackToSpeech();
    }
  }

  const isCulturalSpeaking = (!isVideoFailed && !isVideoMuted) || isPlayingAudio || isPlayingVoice;

  function fallbackToSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (culturalVoice && culturalDialogue) {
      stopSpeechSynthesis();
      const utter = new SpeechSynthesisUtterance(culturalDialogue.line);
      utter.voice = culturalVoice;
      utter.pitch = 1.15;
      utter.rate = 1.05;
      const meta = LANGUAGE_SPEECH_MAP[state.language];
      if (meta) utter.lang = meta.bcp47;
      utter.onend = () => setIsPlayingVoice(false);
      utter.onerror = () => setIsPlayingVoice(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setIsPlayingVoice(true);
    }
  }

  return (
    <AppFrame className="hb-cultural-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Cultural Garden · Contextual Wellness"
          title="Cultural Wellness Knowledge"
          subtitle="Explore time-honored traditional practices with cultural context, modern scientific evidence, and safety guidelines."
          action={<ButtonLink href="/world" secondary><ArrowLeft size={15} /> My World</ButtonLink>}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
          {/* Main Card (Mockup Screen 9) */}
          <GlassPanel className="md:col-span-8 p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            {/* Culture Selector Pills */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-white/15">
              <div className="flex gap-2">
                {['India', 'Greece', 'Nigeria'].map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => setCulture(place)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      culture === place
                        ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                    data-testid={`button-culture-${place.toLowerCase()}`}
                  >
                    {place === 'India' ? '🇮🇳 India' : place === 'Greece' ? '🇬🇷 Greece' : '🇳🇬 Nigeria'}
                  </button>
                ))}
              </div>
              <span className="text-xs text-pink-300 font-semibold hidden sm:inline">
                {learningArea}
              </span>
            </div>

            {/* 5 Cultural Figures Quick Switcher Bar */}
            <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles size={13} /> 5 Cultural Guides & Voices
                </span>
                <span className="text-[11px] text-slate-400">
                  Switch figure to hear authentic wisdom & voice
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(CULTURAL_FIGURES_BY_LANGUAGE).map(([langKey, fig]) => {
                  const isSelected = state.language === langKey;
                  return (
                    <button
                      key={langKey}
                      type="button"
                      onClick={() => {
                        update({ language: langKey as any });
                        setCulture(fig.associatedPlace);
                      }}
                      className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-500/30 to-pink-500/30 border-2 border-amber-400/80 shadow-lg scale-[1.02]'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300'
                      }`}
                      data-testid={`button-guide-${fig.code}`}
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 mb-1 relative shadow-inner">
                        <img src={fig.image} alt={fig.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 text-[10px] bg-black/60 px-1 rounded-tl">
                          {fig.badgeEmoji}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-white leading-tight line-clamp-1">{fig.name}</span>
                      <span className="text-[10px] text-amber-300 font-semibold">{langKey}</span>
                      <span className="text-[9px] text-slate-400 leading-none mt-0.5 line-clamp-1">{fig.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cultural Guide Spotlight Card (Image / Talking Video + Spoken Audio) */}
            {culturalDialogue && (
              <div className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-5">
                {/* Avatar / Video Frame */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-36 h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl relative bg-gradient-to-tr from-amber-500/20 to-purple-500/20 group">
                    {!isVideoFailed ? (
                      <video
                        ref={videoRef}
                        key={figure.video}
                        src={figure.video}
                        poster={figure.image}
                        autoPlay
                        loop
                        muted={isVideoMuted}
                        playsInline
                        className="w-full h-full object-cover"
                        onError={() => setVideoFailed((prev) => ({ ...prev, [figure.code]: true }))}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                      />
                    ) : (
                      <img
                        src={figure.image}
                        alt={figure.name}
                        className="w-full h-full object-cover animate-hb-float"
                      />
                    )}

                    {/* Sound / Voice Toggle */}
                    <button
                      type="button"
                      onClick={toggleCulturalAudio}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white shadow-md transition-transform active:scale-95 z-20 backdrop-blur-sm"
                      title={isCulturalSpeaking ? 'Mute audio' : `Listen in ${state.language}`}
                      aria-label={isCulturalSpeaking ? 'Mute audio' : `Listen in ${state.language}`}
                    >
                      {isCulturalSpeaking ? (
                        <Volume2 size={14} className="text-amber-300 animate-pulse" />
                      ) : (
                        <VolumeX size={14} className="text-white" />
                      )}
                    </button>

                    {/* Video ready indicator or Play/Pause */}
                    {!isVideoFailed ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (videoRef.current) {
                            if (videoRef.current.paused) {
                              videoRef.current.play();
                              setIsVideoPlaying(true);
                            } else {
                              videoRef.current.pause();
                              setIsVideoPlaying(false);
                            }
                          }
                        }}
                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white shadow-md transition-transform active:scale-95 z-20 backdrop-blur-sm"
                        title={isVideoPlaying ? 'Pause video' : 'Play video'}
                        aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isVideoPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    ) : (
                      <span
                        className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/75 text-[9px] text-amber-200/90 text-center font-medium backdrop-blur-sm truncate"
                        title={`${figure.name} · ${state.language}`}
                      >
                        {figure.name} · {state.language}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-white text-base mt-2 flex items-center gap-1">
                    {figure.badgeEmoji} {figure.name}
                  </h3>
                  <span className="text-[11px] text-amber-300 font-semibold text-center">{figure.title}</span>
                </div>

                {/* Dialogue and Audio Controls */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-slate-300 font-medium">
                        {figure.region} · {state.language} Wisdom
                      </span>
                    </div>

                    {/* Audio Listen / Stop Button */}
                    <div>
                      {(culturalTrack || culturalVoice || !isVideoFailed) ? (
                        <button
                          type="button"
                          onClick={toggleCulturalAudio}
                          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                          title={isCulturalSpeaking ? 'Stop voice' : `Listen to ${figure.name}`}
                          aria-label={isCulturalSpeaking ? 'Stop voice' : `Listen to ${figure.name}`}
                        >
                          {isCulturalSpeaking ? (
                            <Volume2 size={13} className="text-white animate-pulse" />
                          ) : (
                            <Play size={13} />
                          )}
                          <span>{isCulturalSpeaking ? 'Stop Voice' : `Listen to ${figure.name}`}</span>
                        </button>
                      ) : (
                        <div
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 flex items-center gap-1"
                        >
                          <VolumeX size={12} className="text-slate-500" />
                          <span>Voice unavailable · {state.language} text</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Speech bubble */}
                  <div className="p-4 rounded-2xl bg-black/35 border border-white/15 text-slate-100 text-xs md:text-sm leading-relaxed italic shadow-inner">
                    "{culturalDialogue.line}"
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-amber-200/90 pt-1 border-t border-white/10 gap-2">
                    <span>💡 {culturalDialogue.subtitle}</span>
                    <span className="text-slate-400 text-[10px]">Medical authority: Dr. Maya</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs: Tradition | Evidence | Safety */}
            <div className="flex gap-2 mb-6">
              {(['tradition', 'evidence', 'safety'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white/20 text-white border border-white/30 shadow'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'tradition' ? '🌿 Tradition' : tab === 'evidence' ? '🔬 Modern Evidence' : '🛡️ Safety Notes'}
                </button>
              ))}
            </div>

            {entry ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-lg relative bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 flex-shrink-0">
                    <img
                      src={figure.image}
                      alt={figure.name}
                      className="w-full h-full object-cover animate-hb-float"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{entry.title}</h2>
                    <p className="text-xs text-amber-300 font-semibold">{figure.name} · Traditions from {culture} · Contextual to {learningArea}</p>
                  </div>
                </div>

                {activeTab === 'tradition' && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                    <div>
                      <strong className="block text-white text-sm mb-1">Traditional Context</strong>
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{entry.traditionalContext}</p>
                    </div>
                    <div>
                      <strong className="block text-white text-sm mb-1">Customary Use</strong>
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{entry.traditionalUse}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'evidence' && (
                  <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-400/20">
                    <strong className="block text-cyan-300 text-sm mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> Modern Scientific Evidence
                    </strong>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{entry.modernEvidence}</p>
                    <p className="text-[11px] text-slate-400 mt-3 italic">
                      Traditional practices are complementary and do not cure underlying medical diseases.
                    </p>
                  </div>
                )}

                {activeTab === 'safety' && (
                  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-400/20">
                    <strong className="block text-rose-300 text-sm mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={16} /> Safety & Clinical Caution
                    </strong>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{entry.safety}</p>
                    <p className="text-[11px] text-slate-400 mt-3">
                      Always inform Dr. Maya about any herbal or dietary supplements you consume.
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <p className="text-xs text-slate-400">Distinguishing cultural wisdom from clinical care.</p>
                  <ButtonLink href="/care" small>
                    See Dr. Maya’s Care Plan <ArrowRight size={14} />
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No curated entry available"
                body="No reviewed cultural wellness information is available for this topic. HitaBloom never invents traditions."
              />
            )}
          </GlassPanel>

          {/* Right Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-cyan-300">Culture & Care</span>
              <h3 className="text-lg font-bold text-white mb-2">Wisdom Deserves Context</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                HitaBloom celebrates heritage while keeping clinical medicine authoritative. Practices differ across families and regions.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10 text-xs text-slate-300">
                <span className="font-bold text-white">Topic:</span> {state.symptom || 'General Wellness'}
              </div>
            </GlassPanel>
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

const MAYA_AUDIO_TRACKS: Record<string, string> = {
  English: '/assets/audio/characters/dr-maya.mp3',
  Hindi: '/assets/audio/characters/dr-maya-hi.mp3',
  Telugu: '/assets/audio/characters/dr-maya-te.mp3',
  Greek: '/assets/audio/characters/dr-maya-el.mp3',
  Yoruba: '/assets/audio/characters/dr-maya-yo.mp3',
};

const MAYA_GREETINGS: Record<string, string> = {
  English: "Welcome to my clinic! No scary lectures, promise. We'll learn about your health one small quest at a time. And yes, asking questions is always a smart move!",
  Hindi: "मेरी क्लिनिक में आपका स्वागत है! कोई डरावने व्याख्यान नहीं, वादा। हम एक समय में एक छोटी खोज के साथ आपकी सेहत के बारे में जानेंगे। और हाँ, सवाल पूछना हमेशा एक समझदारी भरा कदम है!",
  Telugu: "నా క్లినిక్‌కి స్వాగతం! భయపెట్టే ఉపన్యాసాలు ఉండవు, మాట ఇస్తున్నాను. మనం ఒక్కో చిన్న అన్వేషణతో మీ ఆరోగ్యం గురించి నేర్చుకుందాం. మరియు ప్రశ్నలు అడగడం ఎల్లప్పుడూ ఒక తెలివైన ఆలోచన!",
  Greek: "Καλώς ήρθατε στην κλινική μου! Χωρίς τρομακτικές διαλέξεις, το υπόσχομαι. Θα μάθουμε για την υγεία σας με ένα μικρό βήμα τη φορά. Και ναι, το να κάνετε ερωτήσεις είναι πάντα μια έξυπνη κίνηση!",
  Yoruba: "Ẹ káàbọ̀ sí ilé-ìwòsàn mi! Kò sí àwọn ọ̀rọ̀ tí ń dẹ́rùbà yín, mo ṣèlérí. A máa kọ́ nípa ìlera yín ní ìgbésẹ̀ kọ̀ọ̀kan. Bẹ́ẹ̀ sì ni, bíbérè àwọn ìbéèrè jẹ́ ohun tí ó gbọ́n nígbà gbogbo!",
};

// ============================================================
// 12 & 13. DOCTOR CARE PLAN & AI EXPLANATION (SCREENS 10 & 11)
// ============================================================
export function Care() {
  const { state } = useDemo();
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMayaAudioPlaying, setIsMayaAudioPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const careText = state.carePlan || 'Rest and stay hydrated. Use warm fluids. Monitor symptoms. Seek in-person care if symptoms worsen or persist.';
  const explanation = explainDoctorInstructions(careText, state.language);
  const isEnglish = state.language === 'English';
  const mayaGreeting = MAYA_GREETINGS[state.language] || MAYA_GREETINGS.English;

  const isCustomCarePlan = Boolean(
    state.carePlan &&
    state.carePlan.trim() !== 'Rest and stay hydrated. Use warm fluids. Monitor symptoms. Seek in-person care if symptoms worsen or persist.'
  );

  const careSteps = useMemo(() => {
    if (!careText) return [];
    const lines = careText
      .split(/(?:\r?\n|(?<=[.!?])\s+)/)
      .map((s) => s.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter((s) => s.length > 2);
    return lines.length > 0 ? lines : [careText];
  }, [careText]);

  function stopAllMayaAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    setIsMayaAudioPlaying(false);
    setIsVideoMuted(true);
  }

  function toggleMayaAudio() {
    // English: native video audio (or fallback mp3 if video fails)
    if (isEnglish) {
      if (!videoFailed && videoRef.current) {
        const nextMuted = !isVideoMuted;
        videoRef.current.muted = nextMuted;
        setIsVideoMuted(nextMuted);
        if (!nextMuted) {
          if (videoRef.current.paused) {
            videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }
          if (audioRef.current) {
            audioRef.current.pause();
            setIsMayaAudioPlaying(false);
          }
        }
        return;
      }
      toggleStandaloneMayaAudio(MAYA_AUDIO_TRACKS.English);
      return;
    }

    // Non-English (Hindi, Telugu, Greek, Yoruba):
    // Keep video muted so English embedded audio never clashes!
    if (videoRef.current) {
      videoRef.current.muted = true;
      setIsVideoMuted(true);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    }

    const track = MAYA_AUDIO_TRACKS[state.language] || MAYA_AUDIO_TRACKS.English;
    toggleStandaloneMayaAudio(track);
  }

  function toggleStandaloneMayaAudio(track: string) {
    if (isMayaAudioPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsMayaAudioPlaying(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(track);
    audioRef.current = audio;
    audio.onended = () => setIsMayaAudioPlaying(false);
    audio.onerror = () => setIsMayaAudioPlaying(false);
    audio.play().then(() => {
      setIsMayaAudioPlaying(true);
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }).catch(() => {
      setIsMayaAudioPlaying(false);
    });
  }

  function toggleAiExplanationAudio() {
    if (isPlayingAudio) {
      stopSpeechSynthesis();
      setIsPlayingAudio(false);
      return;
    }
    stopAllMayaAudio();
    stopSpeechSynthesis();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlayingAudio(true);
      return;
    }
    const utter = new SpeechSynthesisUtterance(explanation.explanation);
    utter.pitch = 1.15;
    utter.rate = 1.05;
    const voice = findSpeechVoice(state.language);
    if (voice) utter.voice = voice;
    utter.onend = () => setIsPlayingAudio(false);
    utter.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utter);
    setIsPlayingAudio(true);
  }

  useEffect(() => {
    stopAllMayaAudio();
    stopSpeechSynthesis();
    setIsPlayingAudio(false);
  }, [state.language]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeechSynthesis();
    };
  }, []);

  const isMayaSpeaking = (isEnglish && !videoFailed && !isVideoMuted) || isMayaAudioPlaying;

  return (
    <AppFrame className="hb-care-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Clinical Oversight · Dr. Maya"
          title="Dr. Maya’s Care Plan"
          subtitle="Your personal care plan authored by Dr. Maya. AI explains and translates, but never changes her instructions."
          action={<ButtonLink href="/messages" secondary><MessageCircle size={15} /> Message Dr. Maya</ButtonLink>}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
          {/* Main Plan Card (Mockup Screen 10) */}
          <GlassPanel className="md:col-span-8 p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 mb-6 pb-6 border-b border-white/15">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-sky-300/60 shadow-xl relative bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 flex-shrink-0 group">
                  {!videoFailed ? (
                    <video
                      ref={videoRef}
                      src="/assets/characters/dr-maya.mp4"
                      poster="/assets/characters/dr-maya.png"
                      autoPlay
                      loop
                      muted={isVideoMuted}
                      playsInline
                      className="w-full h-full object-cover"
                      onError={() => setVideoFailed(true)}
                      onPlay={() => setIsVideoPlaying(true)}
                      onPause={() => setIsVideoPlaying(false)}
                    />
                  ) : (
                    <img src="/assets/characters/dr-maya.png" alt="Dr. Maya" className="w-full h-full object-cover animate-hb-float" />
                  )}

                  {/* Corner Sound Toggle */}
                  {!videoFailed && (
                    <button
                      type="button"
                      onClick={toggleMayaAudio}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-black/85 text-white shadow-md z-20 backdrop-blur-sm transition-transform active:scale-95"
                      title={isMayaSpeaking ? "Mute Dr. Maya" : `Listen to Dr. Maya in ${state.language}`}
                      aria-label={isMayaSpeaking ? "Mute Dr. Maya" : `Listen to Dr. Maya in ${state.language}`}
                    >
                      {isMayaSpeaking ? <Volume2 size={13} className="text-sky-300 animate-pulse" /> : <VolumeX size={13} />}
                    </button>
                  )}

                  {!videoFailed ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                            setIsVideoPlaying(true);
                          } else {
                            videoRef.current.pause();
                            setIsVideoPlaying(false);
                          }
                        }
                      }}
                      className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white shadow-md z-20 backdrop-blur-sm"
                      title={isVideoPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isVideoPlaying ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  ) : (
                    <span
                      className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/75 text-[9px] text-sky-200 text-center font-medium backdrop-blur-sm truncate"
                      title="Dr. Maya · Clinical Care"
                    >
                      Dr. Maya · Care
                    </span>
                  )}
                </div>

                <div className="flex flex-col text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">Dr. Maya</h2>
                    <Tag tone="tone-blue"><Stethoscope size={13} /> Authoritative</Tag>
                  </div>
                  <p className="text-xs text-sky-300 mb-2">Doctor's Corner · Personalized for {state.name}</p>
                  <div className="text-xs text-slate-200 bg-sky-950/40 border border-sky-400/20 p-2.5 rounded-xl max-w-md">
                    <p className="italic font-medium">"{mayaGreeting}"</p>
                    {!isEnglish && (
                      <div className="mt-1.5 pt-1.5 border-t border-sky-400/20 text-[11px] text-sky-300">
                        <span className="font-semibold text-slate-300">English original:</span> "{MAYA_GREETINGS.English}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleMayaAudio}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
                title={isMayaSpeaking ? "Mute Dr. Maya" : `Listen to Dr. Maya in ${state.language}`}
              >
                {isMayaSpeaking ? <Volume2 size={14} className="text-white animate-pulse" /> : <Play size={14} />}
                <span>{isMayaSpeaking ? "Mute Voice" : `Listen to Dr. Maya (${state.language})`}</span>
              </button>
            </div>

            {isCustomCarePlan && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-between text-xs text-emerald-200">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-300" /> Updated Clinical Instructions from Dr. Maya
                </span>
                <span className="text-[11px] opacity-80">Authoritative</span>
              </div>
            )}

            {/* Verbatim Steps */}
            <div className="flex flex-col gap-3 mb-4">
              {careSteps.map((step, idx) => (
                <div key={step} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-500/30 text-sky-300 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-100 font-medium">{step}</span>
                </div>
              ))}
            </div>

            {/* Follow-up Note from Dr. Maya */}
            {state.followUp && (
              <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-400/30 flex items-start gap-3 mb-6" data-testid="card-patient-followup">
                <CalendarDays size={18} className="text-sky-300 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white text-xs block font-bold">Follow-Up Instruction from Dr. Maya:</strong>
                  <p className="text-xs text-sky-200 mt-0.5">{state.followUp}</p>
                </div>
              </div>
            )}

            {/* Translation / Explanation CTA Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={() => setShowAiExplanation(!showAiExplanation)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
                data-testid="button-explain-plan"
              >
                <Volume2 size={16} /> Explain in {state.language}
              </button>
              <ButtonLink href="/quests" small>
                Suggested Quest <ArrowRight size={14} />
              </ButtonLink>
            </div>

            {/* AI Multilingual Explanation Card (Mockup Screen 11) */}
            {showAiExplanation && (
              <div className="mt-6 p-6 rounded-2xl bg-indigo-950/70 border-2 border-indigo-400/40 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 font-bold flex items-center gap-1">
                      <Sparkles size={13} /> AI Explanation in {state.language}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAiExplanationAudio}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    title={isPlayingAudio ? 'Pause Audio' : `Play Audio in ${state.language}`}
                  >
                    {isPlayingAudio ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>

                <p className="text-xs text-indigo-200 mb-2 font-medium">
                  Let me explain Dr. Maya's instructions in simple {state.language}...
                </p>

                <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-white text-sm leading-relaxed font-normal mb-4">
                  {explanation.explanation}
                </div>

                {/* Simulated Audio Waveform */}
                <div className="flex items-center gap-1 h-6 px-3 rounded-lg bg-black/30">
                  <span className="w-1 bg-pink-400 h-3 animate-pulse" />
                  <span className="w-1 bg-purple-400 h-5 animate-pulse" />
                  <span className="w-1 bg-cyan-400 h-2 animate-pulse" />
                  <span className="w-1 bg-pink-400 h-6 animate-pulse" />
                  <span className="w-1 bg-purple-400 h-4 animate-pulse" />
                  <span className="w-1 bg-cyan-400 h-3 animate-pulse" />
                  <span className="text-[10px] text-slate-400 ml-2">Audio explanation active</span>
                </div>

                <p className="text-[11px] text-slate-400 mt-3">
                  Note: AI provides explanation and translation only. Original English instructions authored by Dr. Maya remain authoritative.
                </p>
              </div>
            )}
          </GlassPanel>

          {/* Right: Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-sky-300">Clinician Boundary</span>
              <h3 className="text-lg font-bold text-white mb-2">Authoritative Care</h3>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                HitaBloom never changes dosage, prescribes medication, or contradicts your clinician.
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <strong>Assigned Doctor:</strong> Dr. Maya
              </div>
            </GlassPanel>
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

// ============================================================
// 14 & 15. QUEST FLOW & CELEBRATION (MOCKUP SCREENS 12 & 14)
// ============================================================
export function Quests() {
  const { state, update } = useDemo();
  const [showCelebration, setShowCelebration] = useState(false);
  const [checkedDays, setCheckedDays] = useState({ day1: true, day2: true, day3: false });
  const [, setPath] = useLocation();

  const questTitle = state.questTitle || 'Breathe Easy Challenge';
  const questNote = state.questNote || 'Drink warm fluids 3 times a day for 3 days.';

  function sendForApproval() {
    update({
      questStatus: 'pending',
      questTitle,
      questNote,
      notification: 'Quest suggestion sent to Dr. Maya for review.',
    });
  }

  function handleCompleteQuest() {
    const patch = advancePatientGarden(state);
    update(patch);
    setShowCelebration(true);
  }

  function finishAndGoWorld() {
    setShowCelebration(false);
    setPath('/world');
  }

  return (
    <AppFrame className="hb-quests-page">
      {/* Mockup Screen 14: Celebration Modal */}
      {showCelebration && (
        <div className="hb-celebration-overlay" onClick={finishAndGoWorld}>
          <div className="hb-celebration-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl animate-bounce">🌟🎉✨</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Quest Completed!</h2>
            <div className="w-24 h-24 my-2 flex items-center justify-center flex-shrink-0">
              <PatientAvatar style={state.avatarStyle} label={state.name} size="large" />
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-sm border border-amber-400/40">
                ⭐ +50 XP
              </span>
              <span className="px-4 py-2 rounded-full bg-orange-400/20 text-orange-300 font-extrabold text-sm border border-orange-400/40">
                🔥 +1 Day Streak
              </span>
            </div>
            <p className="text-pink-300 font-bold text-base">
              🌸 {state.justBloomedArea ? `${state.justBloomedArea} has bloomed!` : 'Heart Garden has bloomed!'} {state.justUnlockedArea ? `${state.justUnlockedArea} is now unlocked!` : 'Lung Valley is now unlocked!'}
            </p>
            <button
              type="button"
              onClick={finishAndGoWorld}
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
              data-testid="button-continue-to-world"
            >
              Continue to World <ArrowRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Health Quests · Small Steps"
          title="Your Wellbeing Quest"
          subtitle="Quests are gentle, doctor-approved daily milestones designed to help you build healthy habits without pressure."
          action={<ButtonLink href="/world" secondary><ArrowLeft size={15} /> My World</ButtonLink>}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
          {/* Main Quest Card (Mockup Screen 12) */}
          <GlassPanel className="md:col-span-8 p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/15">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <span className="hb-eyebrow text-pink-300">
                    {state.questStatus === 'active' ? 'Active Quest' : state.questStatus === 'pending' ? 'Pending Review' : 'Suggested Quest'}
                  </span>
                  <h2 className="text-xl font-extrabold text-white">{questTitle}</h2>
                </div>
              </div>
              <span className={`hb-status-pill status-${state.questStatus}`}>
                {state.questStatus === 'none' ? 'Suggested' : state.questStatus === 'pending' ? 'Waiting for Dr. Maya' : state.questStatus}
              </span>
            </div>

            <p className="text-sm md:text-base text-slate-200 mb-6 leading-relaxed">
              {questNote}
            </p>

            {/* Rewards row */}
            <div className="flex gap-4 mb-6">
              <div className="px-3.5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                <span>⭐</span> +50 XP
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-orange-400/10 border border-orange-400/20 text-orange-300 font-bold text-xs flex items-center gap-1.5">
                <span>🔥</span> +1 Day Streak
              </div>
            </div>

            {/* 3-Day Checklist */}
            <div className="flex gap-3 mb-8">
              {[
                { key: 'day1', label: 'Day 1' },
                { key: 'day2', label: 'Day 2' },
                { key: 'day3', label: 'Day 3' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    checkedDays[key as keyof typeof checkedDays]
                      ? 'bg-purple-500/20 border-purple-400 text-white'
                      : 'bg-white/5 border-white/15 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="rounded text-pink-500 focus:ring-0"
                    checked={checkedDays[key as keyof typeof checkedDays]}
                    onChange={(e) => setCheckedDays({ ...checkedDays, [key]: e.target.checked })}
                  />
                  <span className="text-xs font-bold">{label}</span>
                </label>
              ))}
            </div>

            {/* Action buttons based on status */}
            {state.questStatus === 'none' && (
              <button
                type="button"
                onClick={sendForApproval}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                data-testid="button-send-for-approval"
              >
                Send to Dr. Maya for Approval <ArrowRight size={16} />
              </button>
            )}

            {state.questStatus === 'pending' && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-3">
                <Clock3 size={18} className="flex-shrink-0" />
                <span>This quest is waiting for Dr. Maya's approval. You will see it activated once she reviews it.</span>
              </div>
            )}

            {state.questStatus === 'active' && (
              <button
                type="button"
                onClick={handleCompleteQuest}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                data-testid="button-complete-quest"
              >
                <CheckCircle2 size={18} /> Mark as Complete <Sparkles size={16} />
              </button>
            )}

            {state.questStatus === 'completed' && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Quest Completed! Garden milestone unlocked.</span>
                </div>
                <ButtonLink href="/world" small>Back to World</ButtonLink>
              </div>
            )}
          </GlassPanel>

          {/* Right: Info */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-pink-300">Human-In-The-Loop</span>
              <h3 className="text-lg font-bold text-white mb-2">Doctor Supervised</h3>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Quests are never automated treatments. Dr. Maya reviews and approves every suggestion before it appears in your active list.
              </p>
              <Link href="/care" className="text-xs text-pink-300 font-bold hover:underline">
                View care plan instructions →
              </Link>
            </GlassPanel>
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

// ============================================================
// 15. PROGRESS SCREEN (MOCKUP SCREEN 15)
// ============================================================
export function Progress() {
  const { state } = useDemo();
  const explored = [
    ['Brain Garden', state.brain, '🧠'],
    ['Heart Garden', state.heart, '❤️'],
    ['Lung Valley', state.lung, '🫁'],
    ['Bone Mountains', state.bone, '🦴'],
    ['Muscle Meadow', state.muscle, '💪'],
    ['Cultural Garden', state.cultural, '🌿'],
  ] as const;

  return (
    <AppFrame className="hb-progress-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Your Growth · Personal Journey"
          title="Your Progress"
          subtitle="View streak, XP, badges, and garden milestones blooming with you."
          action={<ButtonLink href="/world" secondary><ArrowLeft size={15} /> My World</ButtonLink>}
        />

        {/* Top Badges Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm flex items-center gap-2 shadow">
            <span className="text-orange-400 text-lg">🔥</span> {state.streak} Day Streak
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm flex items-center gap-2 shadow">
            <span className="text-amber-300 text-lg">⭐</span> {state.xp} XP
          </div>
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm flex items-center gap-2 shadow">
            <span className="text-pink-400 text-lg">🏆</span> {state.badges.length || 3} Badges
          </div>
        </div>

        {/* Garden Progress Bars (Mockup Screen 15) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
          <GlassPanel className="md:col-span-8 p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/15">
              <h2 className="text-xl font-extrabold text-white">Garden Progression</h2>
              <span className="text-xs text-slate-300">All 6 Health Zones</span>
            </div>

            <div className="flex flex-col gap-5">
              {explored.map(([name, val, icon]) => (
                <div key={name} className="flex flex-col gap-1.5" data-testid={`row-progress-${name.toLowerCase().replaceAll(' ', '-')}`}>
                  <div className="flex justify-between items-center text-xs text-white font-bold">
                    <span className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span>{name}</span>
                    </span>
                    <span className="text-slate-300">{val}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900/60 overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Right: Badges & Tokens */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-amber-300">Earned Badges</span>
              <h3 className="text-lg font-bold text-white mb-3">Moments of Bloom</h3>
              <div className="flex flex-wrap gap-2">
                {(state.badges.length ? state.badges : ['First Bloom', 'Brain Explorer', 'Care Explorer']).map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 shadow">
                    <Star size={12} className="text-amber-300" /> {b}
                  </span>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-pink-300">Recovery Tokens</span>
              <h3 className="text-lg font-bold text-white mb-1">{state.recoveryTokens} Tokens</h3>
              <p className="text-xs text-slate-300">
                Supportive tokens from Dr. Maya keep your streak guilt-free if you ever miss a day.
              </p>
            </GlassPanel>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function Messages() {
  const { state, messages, sendMessage } = useDemo();
  const [draft, setDraft] = useState('');
  const thread = messages.filter((message) => message.patientId === state.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    const rawText = draft.trim();
    if (state.language !== 'English') {
      const trans = translateUserText(rawText, state.language);
      sendMessage(state.id, trans.translated, 'patient', 'message', rawText, state.language);
    } else {
      sendMessage(state.id, rawText, 'patient', 'message', rawText, 'English');
    }
    setDraft('');
  }

  return (
    <AppFrame className="hb-messages-page">
      <div className="max-w-3xl mx-auto py-4">
        <PageHeading
          eyebrow="Care Communication · Direct Thread"
          title="Messages with Dr. Maya"
          subtitle="Share questions or updates with your assigned clinician. This local demo persists messages in your browser."
          action={<ButtonLink href="/care" secondary><Stethoscope size={15} /> Care Plan</ButtonLink>}
        />

        <GlassPanel className="hb-thread-card p-6 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/15 mb-4">
            <DoctorAvatar small />
            <div>
              <strong className="block text-white text-sm">Dr. Maya</strong>
              <small className="text-slate-300 text-xs">Assigned Clinician · Doctor + Administrator</small>
            </div>
          </div>

          <div className="hb-thread-body flex flex-col gap-3 min-h-[300px] mb-4" aria-live="polite" data-testid="list-patient-messages">
            {thread.length === 0 ? (
              <EmptyState title="Your conversation starts here" body="Send Dr. Maya a message. Her replies will appear in this thread." />
            ) : (
              thread.map((message) => (
                <article
                  key={message.id}
                  className={`p-3.5 rounded-2xl max-w-md ${
                    message.from === 'patient'
                      ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/30 border border-pink-400/30 self-end text-white'
                      : 'bg-white/10 border border-white/20 self-start text-white'
                  }`}
                  data-testid={`message-${message.id}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="block text-[10px] text-slate-300 font-bold">
                      {message.from === 'patient' ? 'You' : 'Dr. Maya'}
                      {message.kind !== 'message' ? ` · ${message.kind}` : ''}
                    </span>
                    {message.language && message.language !== 'English' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-400/30 text-purple-200">
                        {message.language}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{message.body}</p>
                  {message.originalEn && message.originalEn !== message.body && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/15 text-[11px] text-pink-200">
                      <span className="font-semibold text-slate-300">Original (EN):</span> {message.originalEn}
                    </div>
                  )}
                  <small className="block text-[10px] text-slate-400 mt-1">{new Date(message.createdAt).toLocaleTimeString()}</small>
                </article>
              ))
            )}
          </div>

          <form className="flex flex-col gap-2" onSubmit={submit}>
            <div className="flex gap-2">
              <input
                id="patient-message"
                className="hb-input flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={state.language === 'English' ? "Write a message to Dr. Maya…" : `Write in English or ${state.language}… (auto-translates on send)`}
                data-testid="input-patient-message"
              />
              <button
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow hover:scale-105 transition-all"
                type="submit"
                disabled={!draft.trim()}
                data-testid="button-send-patient-message"
              >
                <Send size={16} /> Send
              </button>
            </div>
            {state.language !== 'English' && (
              <p className="text-[11px] text-pink-200">
                English messages are automatically translated to {state.language} in the chatbox for Dr. Maya.
              </p>
            )}
          </form>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

export function Profile() {
  const { state, update, reset } = useDemo();
  const [, setPath] = useLocation();

  function resetDemo() {
    if (window.confirm('Reset all local demo data and sign out? This clears account changes made in this browser.')) {
      reset();
      setPath('/');
    }
  }

  return (
    <AppFrame className="hb-profile-page">
      <div className="max-w-3xl mx-auto py-4">
        <PageHeading
          eyebrow="Account Settings · Local Demo"
          title="Patient Profile"
          subtitle="Manage your avatar appearance and language preference."
        />

        <GlassPanel className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/15">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/30 shadow flex items-center justify-center p-1 bg-indigo-950/40 flex-shrink-0">
              <PatientAvatar style={state.avatarStyle} label={state.name} size="large" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-white truncate">{state.name}</h2>
              <p className="text-slate-300 text-xs">{state.email}</p>
              <div className="mt-2 flex gap-2">
                <Tag><Heart size={12} /> Patient</Tag>
                <Tag tone="tone-blue"><Stethoscope size={12} /> Dr. Maya</Tag>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <FieldLabel htmlFor="profile-language">Preferred language</FieldLabel>
              <select
                id="profile-language"
                className="hb-input w-full mt-1"
                value={state.language}
                onChange={(event) => update({ language: event.target.value })}
                data-testid="select-profile-language"
              >
                {languages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">Avatar Appearance</span>
              <AvatarControls avatar={state.avatarStyle} update={(avatarStyle) => update({ avatarStyle })} />
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex justify-between items-center">
            <button
              className="hb-button hb-button-danger"
              type="button"
              onClick={resetDemo}
              data-testid="button-reset-demo"
            >
              Reset demo data
            </button>
            <ButtonLink href="/world" secondary small>Back to World</ButtonLink>
          </div>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}
