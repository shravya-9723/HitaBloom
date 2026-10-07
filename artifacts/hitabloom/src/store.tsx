import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AvatarStyle, DemoState, Status } from './data';

export type DemoRole = 'patient' | 'doctor';
export type DemoSession = { role: DemoRole; email: string; name: string };
export type DemoMessage = {
  id: string;
  patientId: string;
  from: DemoRole;
  body: string;
  createdAt: string;
  kind: 'message' | 'quest' | 'care' | 'recovery';
};
type PersistedStore = {
  patients: DemoState[];
  session: DemoSession | null;
  activePatientId: string;
  messages: DemoMessage[];
};
export type DemoContextValue = {
  state: DemoState;
  patients: DemoState[];
  messages: DemoMessage[];
  session: DemoSession | null;
  role: DemoRole | null;
  activePatientId: string;
  login: (role: DemoRole, email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string, language: string) => { ok: boolean; error?: string };
  logout: () => void;
  update: (patch: Partial<DemoState>) => void;
  updatePatient: (id: string, patch: Partial<DemoState>) => void;
  selectPatient: (id: string) => void;
  sendMessage: (patientId: string, body: string, from: DemoRole, kind?: DemoMessage['kind']) => void;
  reset: () => void;
};

const storageKey = 'hitabloom-demo-redesign';
const baseAvatar: AvatarStyle = {
  skin: '#bd7957', hair: 'wavy', hairColor: '#49372f', face: 'round',
  outfit: 'sage', glasses: false, accessory: 'flower', expression: 'happy',
};

function patient(overrides: Partial<DemoState> & Pick<DemoState, 'id' | 'name' | 'email' | 'language'>): DemoState {
  return {
    assignedDoctor: 'Dr. Maya',
    onboardingComplete: false,
    avatar: overrides.avatar ?? 'Mango',
    symptom: '',
    analyzed: false,
    learningArea: '',
    followup: '',
    questStatus: 'none',
    questTitle: '',
    questMinutes: '10',
    questNote: '',
    carePlan: '',
    followUp: '',
    xp: 0,
    streak: 0,
    recoveryTokens: 0,
    brain: 0,
    heart: 0,
    lung: 0,
    bone: 0,
    muscle: 0,
    cultural: 0,
    lungUnlocked: false,
    questsCompleted: 0,
    badges: [],
    notification: '',
    ...overrides,
    avatarStyle: { ...baseAvatar, ...overrides.avatarStyle },
  };
}

const seedPatients: DemoState[] = [
  patient({
    id: 'aarav', name: 'Aarav', email: 'aarav@hitabloom.demo', language: 'Telugu',
    streak: 5, xp: 320, brain: 100, heart: 18, cultural: 100,
    carePlan: 'Rest and stay hydrated. Monitor symptoms. Seek in-person care if symptoms worsen or persist.',
    followUp: 'Check back in 3 days.',
    badges: ['First Bloom', '3-Day Streak', 'Brain Explorer'],
    avatarStyle: { skin: '#bd7957', hair: 'wavy', hairColor: '#49372f', face: 'round', outfit: 'sage', glasses: false, accessory: 'flower', expression: 'happy' },
  }),
  patient({
    id: 'priya', name: 'Priya', email: 'priya@hitabloom.demo', language: 'English',
    streak: 12, xp: 820, brain: 100, heart: 18, cultural: 35,
    questStatus: 'pending', questTitle: 'A short mindful breathing break',
    questMinutes: '5', questNote: 'Try the short breathing exercise at a comfortable pace. Stop if it feels uncomfortable.',
    carePlan: 'Rest as needed and follow the instructions in your care plan.',
    badges: ['First Bloom', '3-Day Streak', 'Garden Keeper'],
    avatarStyle: { skin: '#f0c7a1', hair: 'curly', hairColor: '#302a36', face: 'oval', outfit: 'lavender', glasses: true, accessory: 'star', expression: 'curious' },
  }),
  patient({
    id: 'kofi', name: 'Kofi', email: 'kofi@hitabloom.demo', language: 'Yoruba',
    streak: 3, xp: 240, brain: 100, heart: 18, lung: 60, cultural: 25,
    carePlan: 'Take breaks as needed and contact Dr. Maya if your symptoms change.',
    badges: ['First Bloom', '3-Day Streak'],
    avatarStyle: { skin: '#844f3e', hair: 'short', hairColor: '#302a36', face: 'round', outfit: 'coral', glasses: false, accessory: 'none', expression: 'happy' },
  }),
  patient({
    id: 'elena', name: 'Elena', email: 'elena@hitabloom.demo', language: 'Greek',
    streak: 1, xp: 80, cultural: 20,
    carePlan: 'Contact Dr. Maya if you have questions about your care.',
    badges: ['First Bloom'],
    avatarStyle: { skin: '#d99d75', hair: 'long', hairColor: '#7b4b36', face: 'oval', outfit: 'lavender', glasses: false, accessory: 'flower', expression: 'calm' },
  }),
];

export const demoAccounts = [
  ...seedPatients.map(({ id, name, email, language }) => ({ id, name, email, language, role: 'patient' as const })),
  { id: 'dr-maya', name: 'Dr. Maya', email: 'drmaya@hitabloom.demo', language: 'English', role: 'doctor' as const },
];

const seedMessages: DemoMessage[] = [
  { id: 'seed-priya-quest', patientId: 'priya', from: 'doctor', body: 'I’m reviewing a gentle quest for your journey. I’ll let you know once it is approved.', createdAt: '2026-10-07T09:00:00.000Z', kind: 'quest' },
];

function createInitialStore(): PersistedStore {
  return { patients: seedPatients.map((item) => ({ ...item, avatarStyle: { ...item.avatarStyle }, badges: [...item.badges] })), session: null, activePatientId: 'aarav', messages: [...seedMessages] };
}

function restoreStore(): PersistedStore {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return createInitialStore();
    const saved = JSON.parse(raw) as Partial<PersistedStore>;
    const persistedPatients = saved.patients ?? [];
    const restoredPatients = seedPatients.map((seed) => {
      const existing = persistedPatients.find((item) => item.id === seed.id);
      return existing ? { ...seed, ...existing, avatarStyle: { ...seed.avatarStyle, ...existing.avatarStyle } } : seed;
    });
    const newPatients = persistedPatients.filter((item) => !seedPatients.some((seed) => seed.id === item.id));
    return {
      patients: [...restoredPatients, ...newPatients],
      session: saved.session ?? null,
      activePatientId: saved.activePatientId ?? 'aarav',
      messages: saved.messages ?? [...seedMessages],
    };
  } catch {
    return createInitialStore();
  }
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<PersistedStore>(restoreStore);
  const activePatient = store.patients.find((item) => item.id === store.activePatientId) ?? store.patients[0];

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(store));
  }, [store]);

  const login: DemoContextValue['login'] = (role, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!password.trim()) return { ok: false, error: 'Enter a password to continue.' };
    if (role === 'doctor') {
      if (normalizedEmail !== 'drmaya@hitabloom.demo') return { ok: false, error: 'Use Dr. Maya’s demo account to enter the doctor workspace.' };
      setStore((current) => ({ ...current, session: { role, email: normalizedEmail, name: 'Dr. Maya' }, activePatientId: 'aarav' }));
      return { ok: true };
    }
    const account = store.patients.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!account) return { ok: false, error: 'Choose one of the patient demo accounts or create a demo patient account.' };
    setStore((current) => ({ ...current, session: { role, email: normalizedEmail, name: account.name }, activePatientId: account.id }));
    return { ok: true };
  };

  const signup: DemoContextValue['signup'] = (name, email, password, language) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedName) return { ok: false, error: 'Enter your name.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, error: 'Enter a valid email address.' };
    if (password.trim().length < 4) return { ok: false, error: 'Use at least 4 characters for this demo password.' };
    if (store.patients.some((item) => item.email.toLowerCase() === normalizedEmail) || normalizedEmail === 'drmaya@hitabloom.demo') return { ok: false, error: 'An account with that email already exists.' };
    const id = `patient-${Date.now()}`;
    const newPatient = patient({ id, name: normalizedName, email: normalizedEmail, language });
    setStore((current) => ({
      ...current,
      patients: [...current.patients, newPatient],
      session: { role: 'patient', email: normalizedEmail, name: normalizedName },
      activePatientId: id,
    }));
    return { ok: true };
  };

  const updatePatient: DemoContextValue['updatePatient'] = (id, patch) => {
    setStore((current) => ({
      ...current,
      patients: current.patients.map((item) => item.id === id
        ? { ...item, ...patch, avatarStyle: patch.avatarStyle ? { ...item.avatarStyle, ...patch.avatarStyle } : item.avatarStyle }
        : item),
    }));
  };

  const update: DemoContextValue['update'] = (patch) => updatePatient(store.activePatientId, patch);
  const selectPatient: DemoContextValue['selectPatient'] = (id) => {
    if (store.session?.role === 'doctor' && store.patients.some((item) => item.id === id)) {
      setStore((current) => ({ ...current, activePatientId: id }));
    }
  };
  const sendMessage: DemoContextValue['sendMessage'] = (patientId, body, from, kind = 'message') => {
    const patientRecord = store.patients.find((item) => item.id === patientId);
    if (!patientRecord || !body.trim()) return;
    const message: DemoMessage = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${store.messages.length}`,
      patientId,
      from,
      body: body.trim(),
      createdAt: new Date().toISOString(),
      kind,
    };
    setStore((current) => ({
      ...current,
      messages: [...current.messages, message],
      patients: current.patients.map((item) => item.id === patientId
        ? { ...item, notification: from === 'doctor' ? `A note from Dr. Maya: ${body.trim()}` : item.notification }
        : item),
    }));
  };
  const logout = () => setStore((current) => ({ ...current, session: null, activePatientId: 'aarav' }));
  const reset = () => setStore(createInitialStore());

  const value = useMemo<DemoContextValue>(() => ({
    state: activePatient,
    patients: store.patients,
    messages: store.messages,
    session: store.session,
    role: store.session?.role ?? null,
    activePatientId: store.activePatientId,
    login,
    signup,
    logout,
    update,
    updatePatient,
    selectPatient,
    sendMessage,
    reset,
  }), [activePatient, store]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('DemoProvider missing');
  return value;
}

export const patientStatus = (status: Status) => status === 'none' ? 'No quest yet' : status;
