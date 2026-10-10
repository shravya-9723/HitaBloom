import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity, ArrowRight, Bell, BookOpen, CalendarDays, Check, ClipboardCheck, Flower2, Heart, Home,
  Leaf, LogOut, Mail, MessageCircle, Settings2, ShieldCheck, Sparkles, Stethoscope, Trophy, Users,
} from 'lucide-react';
import type { AvatarStyle } from './data';
import { useDemo } from './data';

const patientLinks = [
  { href: '/world', label: 'My world', icon: Home },
  { href: '/journey', label: 'My journey', icon: Sparkles },
  { href: '/quests', label: 'Quests', icon: Check },
  { href: '/progress', label: 'Growth', icon: Trophy },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
];
const doctorLinks = [
  { href: '/doctor', label: 'Overview', icon: Home },
  { href: '/doctor/patients', label: 'Patients', icon: Users },
  { href: '/doctor/quests', label: 'Quest review', icon: ClipboardCheck },
  { href: '/doctor/messages', label: 'Messages', icon: Mail },
  { href: '/doctor/recovery-tokens', label: 'Recovery tokens', icon: Flower2 },
];

export function Brand({ href = '/' }: { href?: string }) {
  return <Link href={href} className="hb-brand" aria-label="HitaBloom home" data-testid="link-brand">
    <span className="hb-brand-mark"><Flower2 size={19} strokeWidth={2.1}/></span>
    <span>Hita<span>Bloom</span></span>
  </Link>;
}

function isCurrent(path: string, href: string) {
  return href === '/doctor' ? path === href : path === href || path.startsWith(`${href}/`);
}

export function Header() {
  const [path, setPath] = useLocation();
  const { state, session, logout, update } = useDemo();
  const links = session?.role === 'doctor' ? doctorLinks : patientLinks;
  function signOut() {
    logout();
    setPath('/login');
  }
  return <header className="hb-topbar">
    <div className="hb-topbar-inner">
      <Brand href={session?.role === 'doctor' ? '/doctor' : session?.role === 'patient' ? '/world' : '/'}/>
      {session ? <nav className="hb-desktop-nav" aria-label={session.role === 'doctor' ? 'Doctor navigation' : 'Patient navigation'}>
        {links.map(({ href, label, icon: Icon }) => <Link
          href={href}
          key={href}
          className={`hb-nav-link ${isCurrent(path, href) ? 'is-active' : ''}`}
          aria-current={isCurrent(path, href) ? 'page' : undefined}
          data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
        ><Icon size={15}/><span>{label}</span></Link>)}
      </nav> : <div className="hb-guest-nav">
        <Link href="/login?role=patient" className="hb-text-link" data-testid="link-login">Sign in</Link>
        <Link href="/signup" className="hb-button hb-button-small" data-testid="link-signup">Create account <ArrowRight size={15}/></Link>
      </div>}
      {session && <div className="hb-user-tools">
        {session.role === 'patient' && <div className="hb-mini-stats">
          <span><Sparkles size={14}/>{state.xp} XP</span>
          <span><Activity size={14}/>{state.streak} day streak</span>
        </div>}
        <Link href={session.role === 'doctor' ? '/doctor/profile' : '/profile'} className="hb-user-chip" aria-label="Open profile" data-testid="link-profile">
          {session.role === 'doctor' ? <DoctorAvatar small/> : <PatientAvatar style={state.avatarStyle} label={state.name} small/>}
          <span className="hb-user-name">{session.name}</span>
        </Link>
        <button className="hb-icon-button hb-signout" type="button" onClick={signOut} aria-label="Sign out" title="Sign out" data-testid="button-sign-out"><LogOut size={17}/></button>
      </div>}
    </div>
    {session && <nav className="hb-mobile-nav" aria-label="Mobile navigation">
      {links.map(({ href, label, icon: Icon }) => <Link
        href={href}
        key={href}
        className={`hb-mobile-link ${isCurrent(path, href) ? 'is-active' : ''}`}
        aria-current={isCurrent(path, href) ? 'page' : undefined}
        data-testid={`mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
      ><Icon size={18}/><span>{label}</span></Link>)}
      <Link href={session.role === 'doctor' ? '/doctor/profile' : '/profile'} className={`hb-mobile-link ${isCurrent(path, session.role === 'doctor' ? '/doctor/profile' : '/profile') ? 'is-active' : ''}`} data-testid="mobile-nav-profile"><Settings2 size={18}/><span>Profile</span></Link>
    </nav>}
  </header>;
}

import { BitmojiAvatar, BitmojiAvatarSvg } from './components/BitmojiAvatar';
export { BitmojiAvatar, BitmojiAvatarSvg };

export function PatientAvatar({
  style,
  label = 'Patient',
  small = false,
  full = false,
  size,
  className = '',
}: {
  style?: AvatarStyle;
  label?: string;
  small?: boolean;
  full?: boolean;
  size?: 'xs' | 'small' | 'medium' | 'large' | 'preview';
  className?: string;
}) {
  const resolvedSize = size ?? (small ? 'small' : full ? 'preview' : 'medium');
  return (
    <BitmojiAvatar
      style={style}
      label={label}
      size={resolvedSize}
      className={className}
    />
  );
}

export function DoctorAvatar({
  small = false,
  large = false,
  size,
  className = '',
}: {
  small?: boolean;
  large?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const resolvedSize = size ?? (small ? 'small' : large ? 'large' : 'medium');
  const sizeClasses: Record<string, string> = {
    small: 'w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px]',
    medium: 'w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]',
    large: 'w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px]',
  };
  const dim = sizeClasses[resolvedSize] || sizeClasses.medium;

  return (
    <span
      className={`doctor-avatar inline-flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden relative shadow-sm border border-sky-300/60 bg-gradient-to-b from-blue-100 to-indigo-100 ${dim} ${className}`}
      role="img"
      aria-label="Illustration of Dr. Maya"
      data-testid="img-avatar-dr.-maya"
    >
      <img
        src="/assets/characters/dr-maya.png"
        alt="Dr. Maya"
        className="w-full h-full object-cover object-top"
      />
    </span>
  );
}

import { Character, CHARACTER_REGISTRY, resolveCharacterMeta } from './components/Character';
export { Character, CHARACTER_REGISTRY, resolveCharacterMeta };
export type { CharacterProps, CharacterMeta, CharacterId } from './components/Character';

export function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return <div className="hb-page-heading">
    <div><span className="hb-eyebrow">{eyebrow}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    {action && <div className="hb-heading-action">{action}</div>}
  </div>;
}

export function GlassPanel({ children, className = '', testId }: { children: ReactNode; className?: string; testId?: string }) {
  return <section className={`hb-glass-panel ${className}`} data-testid={testId}>{children}</section>;
}

export function AppFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { state, session, update } = useDemo();
  return <div className={`hb-shell ${className}`}>
    <div className="hb-ambient hb-ambient-one"/><div className="hb-ambient hb-ambient-two"/>
    <Header/>
    {session?.role === 'patient' && state.notification && <div className="hb-notification" role="status" data-testid="status-notification">
      <Bell size={16}/><span>{state.notification}</span>
      <button type="button" aria-label="Dismiss notification" onClick={() => update({ notification: '' })} data-testid="button-dismiss-notification">Dismiss</button>
    </div>}
    <main className="hb-main">{children}</main>
    {session?.role === 'patient' && <div className="hb-safety-strip"><ShieldCheck size={14}/> Learning and wellbeing support, not diagnosis or treatment.</div>}
  </div>;
}

export function Disclaimer() {
  return <p className="hb-disclaimer"><ShieldCheck size={14}/> HitaBloom supports learning and wellbeing. It does not diagnose, prescribe, or change medical advice. Your clinician leads your care.</p>;
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const progress = Math.max(0, Math.min(100, value));
  return <div className="hb-progress-wrap" role="progressbar" aria-label={label ?? 'Progress'} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} data-testid={`progress-${(label ?? 'garden').toLowerCase().replaceAll(' ', '-')}`}>
    <span style={{ width: `${progress}%` }}/></div>;
}

const metricIcons = { activity: Activity, trophy: Trophy, heart: Heart, users: Users, calendar: CalendarDays, flower: Flower2, message: MessageCircle, book: BookOpen, care: Stethoscope, leaf: Leaf };
export function Metric({ icon = 'leaf', value, label, tone = '' }: { icon?: keyof typeof metricIcons; value: string | number; label: string; tone?: string }) {
  const Icon = metricIcons[icon] ?? Leaf;
  return <div className={`hb-metric ${tone}`} data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}>
    <span className="hb-metric-icon"><Icon size={18}/></span>
    <span><strong>{value}</strong><small>{label}</small></span>
  </div>;
}

export function TinyGarden({ label = 'A small garden island' }: { label?: string }) {
  return <div className="hb-garden-art" role="img" aria-label={label}>
    <div className="hb-garden-orb"/><div className="hb-garden-hill hill-back"/><div className="hb-garden-hill hill-front"/>
    <span className="hb-garden-arch arch-one"/><span className="hb-garden-arch arch-two"/>
    <i className="hb-garden-star star-one"/><i className="hb-garden-star star-two"/>
    <Character label="Mango"/>
  </div>;
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return <label className="hb-label" htmlFor={htmlFor}>{children}</label>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="hb-empty-state"><span className="hb-empty-icon"><Flower2 size={21}/></span><h3>{title}</h3><p>{body}</p>{action}</div>;
}

export function JourneyStep({ number, title, body, complete = false }: { number: number; title: string; body: string; complete?: boolean }) {
  return <div className={`hb-journey-step ${complete ? 'is-complete' : ''}`}>
    <span>{complete ? <Check size={16}/> : number}</span><div><strong>{title}</strong><small>{body}</small></div>
  </div>;
}

export function Tag({ children, tone = '' }: { children: ReactNode; tone?: string }) {
  return <span className={`hb-tag ${tone}`}>{children}</span>;
}

export function ButtonLink({ href, children, secondary = false, small = false, className = '' }: { href: string; children: ReactNode; secondary?: boolean; small?: boolean; className?: string }) {
  return <Link href={href} className={`hb-button ${secondary ? 'hb-button-secondary' : ''} ${small ? 'hb-button-small' : ''} ${className}`} data-testid={`link-${href.replaceAll('/', '-').replace(/^-/, '')}`}>{children}</Link>;
}

export function JoinDoctorButton() {
  return <Link href="/care" className="hb-text-link"><Stethoscope size={15}/> View Dr. Maya’s care plan</Link>;
}
