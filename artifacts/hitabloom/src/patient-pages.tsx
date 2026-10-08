import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Brain, Check, CheckCircle2, ChevronRight, Clock3,
  Flower2, Heart, Leaf, LockKeyhole, Mail, MessageCircle, Send, ShieldCheck, Sparkles, Star,
  Stethoscope, Trophy, Users, Wind,
} from 'lucide-react';
import {
  areas, languages, useDemo, demoAccounts, type DemoRole, type DemoState,
} from './data';
import { analyzeSymptom, answerCharacterQuestion, explainDoctorInstructions, generateBodyExplanation, generateCulturalContext, suggestQuest } from './services';
import {
  AppFrame, ButtonLink, Character, Disclaimer, DoctorAvatar, EmptyState, FieldLabel,
  GlassPanel, JourneyStep, Metric, PageHeading, PatientAvatar, ProgressBar, Tag, TinyGarden,
} from './hb-ui';

function DemoAccountList({ role, onChoose }: { role: DemoRole; onChoose: (email: string) => void }) {
  return <div className="hb-demo-account-list">
    <div className="hb-demo-account-title"><Users size={15}/><span>{role === 'doctor' ? 'Doctor demo account' : 'Patient demo accounts'}</span></div>
    {demoAccounts.filter((account) => account.role === role).map((account) =>
      <button type="button" className="hb-demo-account" key={account.id} onClick={() => onChoose(account.email)} data-testid={`button-demo-${account.id}`}>
        <span className="hb-demo-avatar">{account.role === 'doctor' ? <Stethoscope size={15}/> : account.name.slice(0, 1)}</span>
        <span><strong>{account.name}</strong><small>{account.email}{account.role === 'patient' ? ` · ${account.language}` : ''}</small></span>
        <ArrowRight size={15}/>
      </button>)}
    <p className="hb-microcopy">Demo accounts use any non-empty password. Nothing is sent to a real sign-in provider.</p>
  </div>;
}

export function Landing() {
  const { session } = useDemo();
  const patientHref = session?.role === 'patient' ? '/world' : '/login?role=patient';
  const doctorHref = session?.role === 'doctor' ? '/doctor' : '/login?role=doctor';
  return <AppFrame className="hb-landing-page">
    <section className="hb-landing-hero">
      <div className="hb-hero-copy">
        <Tag><Sparkles size={13}/> A little learning. A lot of growing.</Tag>
        <h1>A healthier you,<br/><span>a brighter world.</span></h1>
        <p>Meet your body’s tiny teachers. Explore a friendly health-learning garden where your doctor leads the care and every small step helps you bloom.</p>
        <div className="hb-hero-actions">
          <ButtonLink href={patientHref}>Start your journey <ArrowRight size={17}/></ButtonLink>
          <ButtonLink href={doctorHref} secondary><Stethoscope size={16}/> I’m a doctor</ButtonLink>
        </div>
        <div className="hb-trust-row">
          <span><ShieldCheck size={15}/> Doctor-guided</span>
          <span><Flower2 size={15}/> Culturally curious</span>
          <span><Heart size={15}/> Made for you</span>
        </div>
      </div>
      <div className="hb-hero-world" aria-label="A floating fantasy garden with friendly body guides">
        <div className="hb-moon-orbit orbit-one"/><div className="hb-moon-orbit orbit-two"/>
        <div className="hb-floating-island"><span className="hb-island-tree tree-one"/><span className="hb-island-tree tree-two"/><span className="hb-island-path"/>
          <span className="hb-island-flower bloom-one"/><span className="hb-island-flower bloom-two"/>
        </div>
        <div className="hb-hero-character hero-luma"><Character label="Luma"/></div>
        <div className="hb-hero-character hero-cora"><Character label="Cora"/></div>
        <span className="hb-orbit-dot dot-one"/><span className="hb-orbit-dot dot-two"/><span className="hb-orbit-dot dot-three"/>
        <span className="hb-world-caption">A world that grows with you</span>
      </div>
    </section>
    <section className="hb-landing-lower">
      <div className="hb-section-heading">
        <span className="hb-eyebrow">How HitaBloom works</span>
        <h2>Care is a journey, not a checklist.</h2>
        <p>Explore your body, learn at your own pace, and keep your clinician in the loop.</p>
      </div>
      <div className="hb-process-grid">
        <GlassPanel className="hb-process-card"><span className="hb-step-index">01</span><BookOpen size={21}/><h3>Start with your words</h3><p>Share a symptom or question in the language that feels like home. The match is for learning, not diagnosis.</p></GlassPanel>
        <GlassPanel className="hb-process-card"><span className="hb-step-index">02</span><Character label="Bri"/><h3>Meet your body guides</h3><p>Friendly characters explain how body systems work and when to speak with your clinician.</p></GlassPanel>
        <GlassPanel className="hb-process-card"><span className="hb-step-index">03</span><DoctorAvatar/><h3>Grow with your doctor</h3><p>Dr. Maya reviews wellbeing quests and writes your care instructions. AI never changes her plan.</p></GlassPanel>
      </div>
      <Disclaimer/>
    </section>
  </AppFrame>;
}

export function Login() {
  const { login, patients } = useDemo();
  const [, setPath] = useLocation();
  const initialRole: DemoRole = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState<DemoRole>(initialRole);
  const [email, setEmail] = useState(demoAccounts.find((account) => account.role === initialRole)?.email ?? '');
  const [password, setPassword] = useState('');
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
      setPath(patient?.onboardingComplete ? '/world' : '/onboarding');
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

  return <AppFrame className="hb-auth-page">
    <div className="hb-auth-layout">
      <section className="hb-auth-art">
        <span className="hb-eyebrow">Welcome to the garden</span>
        <h1>Small steps.<br/><span>More confident care.</span></h1>
        <p>Sign in to continue your personal learning journey or review your patients as Dr. Maya.</p>
        <TinyGarden label="A little island garden under the stars"/>
        <div className="hb-auth-assurance"><ShieldCheck size={16}/> Mock sign-in for this demo. No real account provider is connected.</div>
      </section>
      <GlassPanel className="hb-auth-card">
        <div className="hb-auth-heading"><span className="hb-eyebrow">Your HitaBloom space</span><h2>Sign in</h2><p>Choose a role, then use one of the ready-to-try demo accounts.</p></div>
        <div className="hb-role-switch" role="tablist" aria-label="Choose sign-in role">
          <button type="button" role="tab" aria-selected={role === 'patient'} className={role === 'patient' ? 'is-selected' : ''} onClick={() => chooseRole('patient')} data-testid="tab-patient-login"><Heart size={15}/> Patient</button>
          <button type="button" role="tab" aria-selected={role === 'doctor'} className={role === 'doctor' ? 'is-selected' : ''} onClick={() => chooseRole('doctor')} data-testid="tab-doctor-login"><Stethoscope size={15}/> Doctor</button>
        </div>
        <form className="hb-form" onSubmit={submit}>
          <FieldLabel htmlFor="login-email">Email address</FieldLabel>
          <input id="login-email" className="hb-input" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" data-testid="input-login-email"/>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <input id="login-password" className="hb-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Any non-empty demo password" data-testid="input-login-password"/>
          {error && <p className="hb-form-error" role="alert" data-testid="status-login-error">{error}</p>}
          <button className="hb-button hb-button-full" type="submit" data-testid="button-login">Sign in <ArrowRight size={16}/></button>
        </form>
        <div className="hb-divider"><span>or try a demo account</span></div>
        <DemoAccountList role={role} onChoose={(nextEmail) => completeLogin(role, nextEmail, 'demo')}/>
        {role === 'patient' && <p className="hb-auth-footer">New to the garden? <Link href="/signup" data-testid="link-create-account">Create a demo patient account</Link></p>}
      </GlassPanel>
    </div>
  </AppFrame>;
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
  return <AppFrame className="hb-auth-page">
    <div className="hb-auth-layout">
      <section className="hb-auth-art">
        <span className="hb-eyebrow">Your own corner of the world</span>
        <h1>Make space<br/><span>to grow.</span></h1>
        <p>Create a local demo patient profile. Dr. Maya will be its assigned clinician in this demonstration.</p>
        <div className="hb-signup-garden"><TinyGarden label="A colorful garden island"/><Character label="Moss"/></div>
      </section>
      <GlassPanel className="hb-auth-card">
        <div className="hb-auth-heading"><span className="hb-eyebrow">Patient account</span><h2>Create your profile</h2><p>This account stays in this browser and is not a real medical record.</p></div>
        <form className="hb-form" onSubmit={submit}>
          <FieldLabel htmlFor="signup-name">Your name</FieldLabel>
          <input id="signup-name" className="hb-input" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="What should we call you?" data-testid="input-signup-name"/>
          <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
          <input id="signup-email" className="hb-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" data-testid="input-signup-email"/>
          <FieldLabel htmlFor="signup-password">Demo password</FieldLabel>
          <input id="signup-password" className="hb-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={4} placeholder="At least 4 characters" data-testid="input-signup-password"/>
          <FieldLabel htmlFor="signup-language">Preferred language</FieldLabel>
          <select id="signup-language" className="hb-input" value={language} onChange={(event) => setLanguage(event.target.value)} data-testid="select-signup-language">{languages.map((item) => <option key={item}>{item}</option>)}</select>
          {error && <p className="hb-form-error" role="alert" data-testid="status-signup-error">{error}</p>}
          <button className="hb-button hb-button-full" type="submit" data-testid="button-signup">Create demo account <ArrowRight size={16}/></button>
        </form>
        <p className="hb-auth-footer">Already have a profile? <Link href="/login" data-testid="link-back-to-login">Sign in</Link></p>
      </GlassPanel>
    </div>
  </AppFrame>;
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
  return <div className="hb-avatar-controls">{(Object.keys(avatarOptions) as (keyof typeof avatarOptions)[]).map((key) => <label key={key} className="hb-control-label">
    <span>{key === 'hairColor' ? 'Hair color' : key === 'skin' ? 'Skin tone' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
    <select className="hb-input" aria-label={key === 'hairColor' ? 'Hair color' : key} value={key === 'glasses' ? String(avatar.glasses) : avatar[key]} onChange={(event) => update({ ...avatar, [key]: key === 'glasses' ? event.target.value === 'true' : event.target.value } as DemoState['avatarStyle'])} data-testid={`select-avatar-${key}`}>
      {avatarOptions[key].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select>
  </label>)}</div>;
}

export function Onboarding() {
  const { state, update } = useDemo();
  const [, setPath] = useLocation();
  const [step, setStep] = useState<'language' | 'avatar'>('language');
  const [language, setLanguage] = useState(state.language);
  const [avatar, setAvatar] = useState(state.avatarStyle);
  function continueToWorld() {
    update({ language, avatarStyle: avatar, onboardingComplete: true });
    setPath('/world');
  }
  return <AppFrame className="hb-onboarding-page">
    <PageHeading eyebrow={`${state.name}’s world · step ${step === 'language' ? '01' : '02'} of 02`} title={step === 'language' ? 'Let’s make this garden yours.' : 'Create a familiar face.'} subtitle={step === 'language' ? 'Choose the language that feels comfortable. English subtitles remain available.' : 'Customize a small avatar to represent you in the garden.'}/>
    <div className="hb-onboarding-layout">
      <GlassPanel className="hb-onboarding-card">
        <div className="hb-onboarding-progress"><span className={step === 'language' ? 'is-current' : 'is-done'}>01</span><i/><span className={step === 'avatar' ? 'is-current' : ''}>02</span></div>
        {step === 'language' ? <>
          <Tag><BookOpen size={14}/> Your language</Tag>
          <h2>Which language should we use?</h2>
          <div className="hb-language-grid">{languages.map((item) => <button type="button" key={item} className={`hb-language-choice ${language === item ? 'is-selected' : ''}`} onClick={() => setLanguage(item)} aria-pressed={language === item} data-testid={`button-language-${item.toLowerCase()}`}><span className="hb-language-check">{language === item ? <Check size={15}/> : <span/>}</span><strong>{item}</strong><small>{item === state.language ? 'Your current preference' : 'Character dialogue and learning'}</small></button>)}</div>
          <button className="hb-button" type="button" onClick={() => { update({ language }); setStep('avatar'); }} data-testid="button-language-continue">Continue to avatar <ArrowRight size={16}/></button>
        </> : <>
          <Tag><Sparkles size={14}/> Your personal avatar</Tag>
          <div className="hb-avatar-preview"><PatientAvatar style={avatar} label={state.name}/><div><strong>{state.name}</strong><small>Your guide in the garden</small></div></div>
          <AvatarControls avatar={avatar} update={setAvatar}/>
          <div className="hb-inline-actions">
            <button className="hb-button hb-button-secondary" type="button" onClick={() => setStep('language')} data-testid="button-back-to-language"><ArrowLeft size={15}/> Back</button>
            <button className="hb-button" type="button" onClick={continueToWorld} data-testid="button-enter-world">Enter my world <ArrowRight size={16}/></button>
          </div>
        </>}
      </GlassPanel>
      <div className="hb-onboarding-side"><TinyGarden label="Your garden is waiting"/><GlassPanel><h3>Designed around you</h3><p>Your avatar and language preference are stored locally in this demo. You can change them from your profile at any time.</p><div className="hb-small-note"><ShieldCheck size={15}/> Your personal journey is visible only in the patient view.</div></GlassPanel></div>
    </div>
  </AppFrame>;
}

export function World() {
  const { state, update } = useDemo();
  const [, setPath] = useLocation();
  const progressByArea: Record<string, number> = {
    'Brain Garden': state.brain, 'Heart Garden': state.heart, 'Lung Valley': state.lung,
    'Bone Mountains': state.bone, 'Muscle Meadow': state.muscle, 'Cultural Garden': state.cultural,
  };
  const baseUnlocked: Record<string, boolean> = {
    'Brain Garden': true, 'Heart Garden': true, 'Lung Valley': state.lungUnlocked || state.lung > 0 || (state.analyzed && state.learningArea === 'Lung Valley'),
    'Bone Mountains': state.bone > 0 || (state.analyzed && state.learningArea === 'Bone Mountains'),
    'Muscle Meadow': state.muscle > 0 || (state.analyzed && state.learningArea === 'Muscle Meadow'),
    'Cultural Garden': true,
  };
  const iconByName: Record<string, typeof Brain> = { brain: Brain, heart: Heart, wind: Wind, bone: Activity, activity: Activity, flower: Flower2 };
  function openArea(name: string) {
    if (name === 'Cultural Garden') setPath('/cultural');
    else setPath('/character');
  }
  return <AppFrame className="hb-world-page">
    <PageHeading eyebrow={`${state.name}’s learning garden`} title={<>Good day, <span className="hb-title-accent">{state.name}.</span></>} subtitle="Every small step helps your garden find its color." action={<ButtonLink href="/journey"><MessageCircle size={16}/> Tell us how you’re feeling</ButtonLink>}/>
    <section className="hb-world-banner">
      <div className="hb-world-banner-copy"><Tag><Sparkles size={13}/> Your world is growing</Tag><h2>A garden of things you’re learning.</h2><p>Explore a body area, meet its guide, or start with a question. This world teaches; it never diagnoses.</p><div className="hb-banner-actions"><ButtonLink href="/journey">Share a symptom or question <ArrowRight size={15}/></ButtonLink><ButtonLink href="/progress" secondary>See your progress</ButtonLink></div></div>
      <div className="hb-world-landscape" aria-label="A glowing floating island garden"><div className="hb-world-moon"/><span className="hb-world-hill hill-a"/><span className="hb-world-hill hill-b"/><span className="hb-world-castle"/><span className="hb-world-path"/><div className="hb-world-guide"><Character label="Luma"/></div><span className="hb-world-firefly firefly-a"/><span className="hb-world-firefly firefly-b"/></div>
    </section>
    <div className="hb-world-stats"><Metric icon="activity" value={`${state.streak} days`} label="steady streak"/><Metric icon="trophy" value={`${state.xp} XP`} label="earned by learning"/><Metric icon="flower" value={`${state.recoveryTokens}`} label="recovery tokens"/></div>
    <section className="hb-world-section">
      <div className="hb-section-heading hb-section-inline"><div><span className="hb-eyebrow">Choose your next path</span><h2>Explore the body gardens</h2><p>Open areas are for learning. Locked paths can wait until you’re ready.</p></div><Link href="/cultural" className="hb-text-link">Cultural wellness <ChevronRight size={15}/></Link></div>
      <div className="hb-area-grid">{areas.map((area) => {
        const unlocked = baseUnlocked[area.name] ?? area.unlocked;
        const progress = progressByArea[area.name] ?? area.progress;
        const Icon = iconByName[area.icon] ?? Flower2;
        return <button type="button" key={area.name} className={`hb-area-card ${unlocked ? '' : 'is-locked'} ${progress >= 100 ? 'is-bloomed' : ''}`} disabled={!unlocked} onClick={() => {
          if (area.name !== 'Cultural Garden') update({ learningArea: area.name });
          openArea(area.name);
        }} data-testid={`button-area-${area.name.toLowerCase().replaceAll(' ', '-')}`}>
          <span className="hb-area-icon">{unlocked ? <Icon size={20}/> : <LockKeyhole size={18}/>}</span>
          <span className="hb-area-copy"><strong>{area.name}</strong><small>{unlocked ? progress === 100 ? 'In full bloom' : `${progress}% explored` : 'A path for later'}</small></span>
          {unlocked && <ChevronRight size={16}/>}
        </button>;
      })}</div>
    </section>
    <div className="hb-world-lower">
      <GlassPanel className="hb-next-step-card"><span className="hb-eyebrow">Your next little step</span><h3>{state.questStatus === 'active' ? state.questTitle : state.questStatus === 'pending' ? 'Dr. Maya is reviewing your quest' : 'Start with what you notice'}</h3><p>{state.questStatus === 'active' ? 'A doctor-approved quest is ready whenever you are.' : state.questStatus === 'pending' ? 'It will appear in your quest list only after Dr. Maya approves it.' : 'You can share a symptom, question, or body area to begin learning.'}</p><ButtonLink href={state.questStatus === 'active' || state.questStatus === 'completed' ? '/quests' : '/journey'}>{state.questStatus === 'active' || state.questStatus === 'completed' ? 'Open my quest' : 'Start my journey'} <ArrowRight size={15}/></ButtonLink></GlassPanel>
      <GlassPanel className="hb-world-progress-card"><div className="hb-progress-card-head"><span className="hb-eyebrow">World progress</span><Link href="/progress" className="hb-text-link">Details <ChevronRight size={14}/></Link></div><div className="hb-progress-copy"><span>Learning areas explored</span><strong>{Object.values(baseUnlocked).filter(Boolean).length} of {areas.length}</strong></div><ProgressBar value={Math.round(Object.values(baseUnlocked).filter(Boolean).length / areas.length * 100)} label="Areas explored"/><p>Growth is not a race. Rest is part of the journey too.</p></GlassPanel>
    </div>
  </AppFrame>;
}

export function Journey() {
  const { state, update } = useDemo();
  const [symptom, setSymptom] = useState(state.symptom);
  const [error, setError] = useState('');
  const [, setPath] = useLocation();
  function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = symptom.trim();
    if (!cleaned) {
      setError('Add a symptom or question first, or return to your world to explore without one.');
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
  return <AppFrame className="hb-journey-page">
    <PageHeading eyebrow="Patient journey · step 01" title="Start with what you’re feeling." subtitle="Share a symptom or a question. HitaBloom matches your words to a learning topic only; it does not identify a cause." action={<ButtonLink href="/world" secondary><ArrowLeft size={15}/> Back to my world</ButtonLink>}/>
    <div className="hb-journey-layout">
      <GlassPanel className="hb-symptom-card">
        <div className="hb-symptom-card-top"><Tag><MessageCircle size={13}/> Your words stay yours</Tag><span className="hb-step-count">01 <i/> 03</span></div>
        <h2>What would you like to learn about?</h2>
        <p>You can share a symptom, body concern, or question. This helps us choose a learning area, not make a diagnosis.</p>
        <form onSubmit={analyze}>
          <FieldLabel htmlFor="symptom">Your symptom or question</FieldLabel>
          <textarea id="symptom" className="hb-input hb-textarea" rows={5} value={symptom} onChange={(event) => { setSymptom(event.target.value); setError(''); }} placeholder="For example, a mild cough or sore throat" data-testid="input-symptom"/>
          <div className="hb-privacy-note"><ShieldCheck size={15}/><span>If symptoms feel severe or urgent, contact local emergency services or your clinician right away.</span></div>
          {error && <p className="hb-form-error" role="alert" data-testid="status-symptom-error">{error}</p>}
          <button className="hb-button" type="submit" data-testid="button-analyze">Find a learning area <ArrowRight size={16}/></button>
        </form>
      </GlassPanel>
      <aside className="hb-journey-aside">
        <GlassPanel className="hb-step-list"><span className="hb-eyebrow">Your path</span><JourneyStep number={1} title="Share what you notice" body="Use your own words." complete={state.analyzed}/><JourneyStep number={2} title="Learn with a body guide" body="Explore general body knowledge." complete={state.analyzed && !!state.learningArea}/><JourneyStep number={3} title="Grow with Dr. Maya" body="Your doctor approves quests and writes your care plan."/></GlassPanel>
        {state.analyzed && <GlassPanel className="hb-learning-result" testId="card-learning-area">
          <Tag><BookOpen size={13}/> Educational match only</Tag>
          <h3><Sparkles size={19}/>{state.learningArea}</h3>
          <p>Your words connect to this learning topic. This does not identify a cause or diagnose a condition.</p>
          <button className="hb-button hb-button-small" type="button" onClick={() => setPath('/character')} data-testid="button-meet-guide">Meet your guide <ChevronRight size={15}/></button>
        </GlassPanel>}
        <Disclaimer/>
      </aside>
    </div>
  </AppFrame>;
}

export function CharacterPage() {
  const { state, update } = useDemo();
  const [draft, setDraft] = useState('');
  const explanation = generateBodyExplanation(state.learningArea, state.language);
  const guide = explanation.guide;
  const [, setPath] = useLocation();
  const hasQuestion = Boolean(state.followup.trim());
  const answer = answerCharacterQuestion(state.followup, state.language, state.symptom);
  function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    update({ followup: draft.trim() });
    setDraft('');
  }
  return <AppFrame className="hb-character-page">
    <PageHeading eyebrow={`${state.learningArea || 'Body guide'} · learn together`} title="A friendly face for a big question." subtitle="This guide shares general body knowledge. For personal care, Dr. Maya is the right person to ask." action={<ButtonLink href="/world" secondary><ArrowLeft size={15}/> My world</ButtonLink>}/>
    <div className="hb-character-layout">
      <section className="hb-guide-stage">
        <div className="hb-stage-spark spark-a"/><div className="hb-stage-spark spark-b"/><span className="hb-stage-label">A learning moment</span>
        <Character label={guide.name} large/>
        <div className="hb-guide-caption"><strong>{guide.name}</strong><span>Your {state.learningArea || 'body'} learning guide</span></div>
      </section>
      <GlassPanel className="hb-guide-chat">
        <Tag><BookOpen size={13}/> General learning</Tag>
        <h2>Meet {guide.name}.</h2>
        <div className="hb-chat-bubble hb-guide-bubble"><span className="hb-chat-author">{guide.name} says</span><p>{explanation.text}</p><small>English subtitle: {explanation.englishSubtitle}</small></div>
        {hasQuestion && <div className="hb-chat-bubble hb-user-bubble"><span className="hb-chat-author">You asked</span><p>{state.followup}</p></div>}
        {hasQuestion && <div className="hb-chat-bubble hb-guide-bubble"><span className="hb-chat-author">{guide.name} replies</span><p>{answer.text}</p><small>English subtitle: People can have different experiences. Dr. Maya can discuss your own symptoms.</small></div>}
        <form className="hb-message-compose" onSubmit={ask}>
          <label className="hb-sr-only" htmlFor="character-question">Ask a follow-up</label>
          <input id="character-question" className="hb-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a general body question" data-testid="input-follow-up"/>
          <button className="hb-icon-submit" type="submit" aria-label="Send question" data-testid="button-send-question"><Send size={17}/></button>
        </form>
        <div className="hb-guide-footer"><Link href="/cultural" className="hb-text-link"><Flower2 size={15}/> Cultural wellness</Link><Link href="/care" className="hb-text-link"><Stethoscope size={15}/> Doctor’s plan</Link></div>
        <Disclaimer/>
      </GlassPanel>
    </div>
  </AppFrame>;
}

export function Cultural() {
  const { state } = useDemo();
  const [culture, setCulture] = useState('India');
  const entry = generateCulturalContext(culture);
  return <AppFrame className="hb-cultural-page">
    <PageHeading eyebrow="Cultural garden · knowledge with context" title="Wisdom deserves context." subtitle="Explore traditions with curiosity and respect. Cultural practices are not a substitute for medical care." action={<ButtonLink href="/world" secondary><ArrowLeft size={15}/> My world</ButtonLink>}/>
    <div className="hb-cultural-layout">
      <div className="hb-cultural-art"><TinyGarden label="Cultural wellness garden"/><div className="hb-cultural-culture-list">{['India', 'Greece', 'Nigeria'].map((place) => <button key={place} className={culture === place ? 'is-active' : ''} onClick={() => setCulture(place)} type="button" data-testid={`button-culture-${place.toLowerCase()}`}><span className="hb-culture-initial">{place.slice(0, 1)}</span>{place}<ChevronRight size={15}/></button>)}</div></div>
      <GlassPanel className="hb-cultural-detail">
        <Tag><Flower2 size={13}/> {culture} · contextual note</Tag>
        {entry ? <>
          <h2>{entry.title}</h2>
          <p className="hb-cultural-context"><strong>Traditional context</strong>{entry.context}</p>
          <p>{entry.tradition}</p>
          <div className="hb-evidence-box"><span><ShieldCheck size={15}/> Modern evidence</span><p>{entry.evidence}</p></div>
          <div className="hb-safety-box"><strong>Safety comes first</strong><p>Check with your clinician before using herbs or supplements, especially alongside medication, pregnancy, allergies, or ongoing conditions. Dr. Maya’s care plan takes priority.</p></div>
          <p className="hb-microcopy">These are educational examples, not treatment recommendations. Customs differ between families and communities.</p>
          <ButtonLink href="/care">See Dr. Maya’s care plan <ArrowRight size={15}/></ButtonLink>
        </> : <EmptyState title="No reviewed entry for this topic" body="HitaBloom will not infer or invent a tradition. Ask Dr. Maya before trying a practice or supplement."/>}
      </GlassPanel>
    </div>
    <div className="hb-topic-context"><span>Personal topic</span><strong>{state.symptom || 'No symptom shared'}</strong><small>{state.learningArea ? `Learning area: ${state.learningArea}` : 'This cultural note is general and is not based on a symptom.'}</small></div>
  </AppFrame>;
}

export function Care() {
  const { state } = useDemo();
  const explanation = explainDoctorInstructions(state.carePlan, state.language);
  return <AppFrame className="hb-care-page">
    <PageHeading eyebrow="Care, in your doctor’s words" title="Your plan comes from Dr. Maya." subtitle="This clinician-authored plan is the source of truth. HitaBloom does not add to or change care instructions." action={<ButtonLink href="/messages" secondary><MessageCircle size={15}/> Message Dr. Maya</ButtonLink>}/>
    <div className="hb-care-layout">
      <GlassPanel className="hb-care-plan-card">
        <div className="hb-care-author"><DoctorAvatar small/><div><strong>Dr. Maya</strong><small>General Care · assigned clinician</small></div><Tag><Stethoscope size={13}/> Clinician authored</Tag></div>
        {state.carePlan ? <div className="hb-doctor-quote"><span>Care plan</span><p>{explanation.verbatim}</p></div> : <EmptyState title="No care plan yet" body="Dr. Maya has not added a personal care plan. You can message her from your inbox." action={<ButtonLink href="/messages">Message Dr. Maya <ArrowRight size={15}/></ButtonLink>}/>}
        {state.followUp && <div className="hb-followup-note"><Clock3 size={16}/><div><strong>Follow-up</strong><p>{state.followUp}</p></div></div>}
        <div className="hb-care-alert"><ShieldCheck size={16}/><p>For worsening or concerning symptoms, contact Dr. Maya. For an emergency, seek urgent local care.</p></div>
      </GlassPanel>
      <aside className="hb-care-side">
        <GlassPanel><span className="hb-eyebrow">A clear boundary</span><h3>Exactly as written</h3><p>{explanation.explanation} HitaBloom will not silently translate, add, remove, or alter Dr. Maya’s instructions.</p><div className="hb-plan-language"><span>Plan language</span><strong>{explanation.displayLanguage} · original instructions</strong></div></GlassPanel>
        <GlassPanel className="hb-care-topic"><Tag><Sparkles size={13}/> Your learning topic</Tag><h3>{state.learningArea || 'Not selected yet'}</h3><p>{state.symptom ? `You shared: “${state.symptom}”` : 'You have not shared a symptom. You can still explore the learning garden.'}</p><Link href="/journey" className="hb-text-link">Start a learning journey <ChevronRight size={15}/></Link></GlassPanel>
        <Disclaimer/>
      </aside>
    </div>
  </AppFrame>;
}

export function Quests() {
  const { state, update } = useDemo();
  function completeQuest() {
    update({
      questStatus: 'completed',
      xp: state.xp + 50,
      streak: state.streak + 1,
      questsCompleted: state.questsCompleted + 1,
      lungUnlocked: true,
      lung: Math.max(state.lung, 12),
      notification: `Well done, ${state.name}. Your garden grew with you today.`,
      badges: state.badges.includes('First Quest') ? state.badges : [...state.badges, 'First Quest'],
    });
  }
  return <AppFrame className="hb-quests-page">
    <PageHeading eyebrow="Small steps, approved by your doctor" title="Your wellbeing quest." subtitle="A quest becomes active only after Dr. Maya reviews and approves it." action={<ButtonLink href="/world" secondary><ArrowLeft size={15}/> My world</ButtonLink>}/>
    <div className="hb-quest-layout">
      <GlassPanel className="hb-quest-card">
        <div className="hb-quest-top"><span className={`hb-status-pill status-${state.questStatus}`}>{state.questStatus === 'none' ? 'No quest yet' : state.questStatus === 'pending' ? 'Waiting for Dr. Maya' : state.questStatus}</span><Sparkles size={21}/></div>
        {state.questStatus === 'none' ? <EmptyState title="No quest is assigned" body="After you share a learning topic, Dr. Maya may review a gentle wellbeing quest. Nothing becomes active without her approval." action={<ButtonLink href="/journey">Start with a question <ArrowRight size={15}/></ButtonLink>}/> : <>
          <span className="hb-eyebrow">{state.questStatus === 'pending' ? 'Doctor review in progress' : state.questStatus === 'active' ? 'Doctor-approved' : state.questStatus === 'completed' ? 'Garden milestone' : 'No active quest'}</span>
          <h2>{state.questStatus === 'rejected' ? 'Let’s find another step.' : state.questTitle}</h2>
          <p>{state.questStatus === 'pending' ? 'This suggestion is not active yet. Dr. Maya is taking a careful look.' : state.questStatus === 'rejected' ? 'Dr. Maya declined this suggestion. Message her if you want to discuss a different step.' : state.questNote}</p>
          {state.questStatus === 'pending' && <div className="hb-quest-wait"><Clock3 size={17}/><span>No activity is assigned until Dr. Maya approves it.</span></div>}
          {state.questStatus === 'active' && <div className="hb-quest-duration"><Clock3 size={17}/><span>{state.questMinutes} minutes · go at your own pace</span></div>}
          {state.questStatus === 'active' && <button className="hb-button" type="button" onClick={completeQuest} data-testid="button-complete-quest"><CheckCircle2 size={17}/> Mark as complete <Sparkles size={15}/></button>}
          {state.questStatus === 'completed' && <div className="hb-quest-celebration"><span className="hb-celebration-mark"><Flower2 size={22}/></span><div><strong>Quest complete · +50 XP</strong><small>Your garden has a new path to explore.</small></div></div>}
          {state.questStatus === 'rejected' && <ButtonLink href="/messages" secondary>Message Dr. Maya <MessageCircle size={15}/></ButtonLink>}
        </>}
      </GlassPanel>
      <aside className="hb-quest-aside"><TinyGarden label="Your growing garden"/><GlassPanel><Tag><ShieldCheck size={13}/> Human-in-the-loop</Tag><h3>Care stays personal.</h3><p>HitaBloom can suggest a small step, but Dr. Maya decides what is appropriate for you. Her instructions are always the authority.</p><Link href="/care" className="hb-text-link">View your care plan <ChevronRight size={15}/></Link></GlassPanel></aside>
    </div>
  </AppFrame>;
}

export function Progress() {
  const { state } = useDemo();
  const explored = [
    ['Brain Garden', state.brain], ['Heart Garden', state.heart], ['Lung Valley', state.lung],
    ['Bone Mountains', state.bone], ['Muscle Meadow', state.muscle], ['Cultural Garden', state.cultural],
  ] as const;
  const totalProgress = Math.round(explored.reduce((sum, [, value]) => sum + value, 0) / explored.length);
  return <AppFrame className="hb-progress-page">
    <PageHeading eyebrow="Your growth, your pace" title="Look how far you’ve grown." subtitle="Little moments count. This is your personal wellbeing-learning garden." action={<ButtonLink href="/profile" secondary>My profile <ChevronRight size={15}/></ButtonLink>}/>
    <GlassPanel className="hb-profile-hero">
      <PatientAvatar style={state.avatarStyle} label={state.name}/>
      <div className="hb-profile-hero-main"><Tag><Sparkles size={13}/> Garden keeper</Tag><h2>{state.name}</h2><p>Growing with Dr. Maya · {state.language}</p></div>
      <div className="hb-profile-facts"><span><strong>{state.streak}</strong><small>day streak</small></span><span><strong>{state.xp}</strong><small>total XP</small></span><span><strong>{state.questsCompleted}</strong><small>quests complete</small></span></div>
    </GlassPanel>
    <div className="hb-progress-metrics"><Metric icon="activity" value={state.streak} label="day streak"/><Metric icon="trophy" value={state.xp} label="total XP"/><Metric icon="heart" value={state.recoveryTokens} label="recovery tokens"/></div>
    <div className="hb-progress-layout">
      <GlassPanel className="hb-garden-progress">
        <div className="hb-progress-title"><div><span className="hb-eyebrow">Your learning map</span><h2>Garden areas</h2></div><strong>{totalProgress}%</strong></div>
        <ProgressBar value={totalProgress} label="Overall garden progress"/>
        <div className="hb-area-progress-list">{explored.map(([name, value]) => <div className="hb-area-progress-row" key={name} data-testid={`row-progress-${name.toLowerCase().replaceAll(' ', '-')}`}><span className="hb-area-progress-mark"><Flower2 size={15}/></span><span className="hb-area-progress-name">{name}</span><ProgressBar value={value} label={`${name} progress`}/><strong>{value}%</strong></div>)}</div>
      </GlassPanel>
      <aside className="hb-badges-column"><GlassPanel><span className="hb-eyebrow">Milestones</span><h2>Moments worth keeping</h2><div className="hb-badge-list">{(state.badges.length ? state.badges : ['First Bloom']).map((badge) => <span className="hb-badge" key={badge}><Star size={14}/>{badge}</span>)}</div></GlassPanel><GlassPanel><span className="hb-eyebrow">A steady rhythm</span><h3>{state.streak} days of showing up</h3><p>When life interrupts, Dr. Maya can offer a Recovery Token to restore your streak. Rest is part of the journey too.</p><Link href="/care" className="hb-text-link">See your doctor’s plan <ChevronRight size={15}/></Link></GlassPanel></aside>
    </div>
  </AppFrame>;
}

export function Messages() {
  const { state, messages, sendMessage } = useDemo();
  const [draft, setDraft] = useState('');
  const thread = messages.filter((message) => message.patientId === state.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    sendMessage(state.id, draft, 'patient');
    setDraft('');
  }
  return <AppFrame className="hb-messages-page">
    <PageHeading eyebrow="Your care team" title="Messages with Dr. Maya." subtitle="Share a question or check in. This local demo does not send real messages." action={<ButtonLink href="/care" secondary><Stethoscope size={15}/> Care plan</ButtonLink>}/>
    <GlassPanel className="hb-thread-card">
      <div className="hb-thread-header"><DoctorAvatar small/><div><strong>Dr. Maya</strong><small>Assigned clinician · General Care</small></div><span className="hb-online-dot">Demo inbox</span></div>
      <div className="hb-thread-body" aria-live="polite" data-testid="list-patient-messages">
        {thread.length === 0 ? <EmptyState title="Your conversation starts here" body="Send Dr. Maya a message. Replies in this demo appear in the same thread."/> : thread.map((message) => <article className={`hb-message ${message.from === 'patient' ? 'from-patient' : 'from-doctor'}`} key={message.id} data-testid={`message-${message.id}`}><span>{message.from === 'patient' ? 'You' : 'Dr. Maya'}{message.kind !== 'message' ? ` · ${message.kind}` : ''}</span><p>{message.body}</p><small>{new Date(message.createdAt).toLocaleString()}</small></article>)}
      </div>
      <form className="hb-message-compose hb-thread-compose" onSubmit={submit}>
        <label className="hb-sr-only" htmlFor="patient-message">Write a message to Dr. Maya</label>
        <input id="patient-message" className="hb-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message…" data-testid="input-patient-message"/>
        <button className="hb-button" type="submit" disabled={!draft.trim()} data-testid="button-send-patient-message"><Send size={16}/> Send</button>
      </form>
      <p className="hb-microcopy"><ShieldCheck size={13}/> If this is an emergency, contact local emergency services instead of sending a message.</p>
    </GlassPanel>
  </AppFrame>;
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
  return <AppFrame className="hb-profile-page">
    <PageHeading eyebrow="Your space" title="A profile that feels like yours." subtitle="Manage your avatar and language. These settings are saved only in this browser."/>
    <div className="hb-profile-layout">
      <GlassPanel className="hb-profile-edit">
        <div className="hb-profile-edit-head"><PatientAvatar style={state.avatarStyle} label={state.name}/><div><h2>{state.name}</h2><p>{state.email}</p><Tag><Heart size={13}/> Patient · Dr. Maya</Tag></div></div>
        <div className="hb-profile-setting"><FieldLabel htmlFor="profile-language">Preferred language</FieldLabel><select id="profile-language" className="hb-input" value={state.language} onChange={(event) => update({ language: event.target.value })} data-testid="select-profile-language">{languages.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="hb-profile-setting"><span className="hb-label">Avatar appearance</span><AvatarControls avatar={state.avatarStyle} update={(avatarStyle) => update({ avatarStyle })}/></div>
        <div className="hb-profile-links"><Link href="/care" className="hb-setting-link"><Stethoscope size={16}/> View care plan <ChevronRight size={15}/></Link><Link href="/messages" className="hb-setting-link"><Mail size={16}/> Messages <ChevronRight size={15}/></Link></div>
        <button className="hb-button hb-button-danger" type="button" onClick={resetDemo} data-testid="button-reset-demo">Reset demo data</button>
      </GlassPanel>
      <aside className="hb-profile-side"><TinyGarden label={`${state.name}'s garden`}/><GlassPanel><span className="hb-eyebrow">Your privacy in this demo</span><h3>This profile stays on this device.</h3><p>HitaBloom here uses browser storage for demonstration only. Do not enter sensitive health information or real account credentials.</p><div className="hb-small-note"><ShieldCheck size={15}/> No real medical record or authentication service is connected.</div></GlassPanel><Disclaimer/></aside>
    </div>
  </AppFrame>;
}
