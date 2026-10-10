import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Clock3, Flower2, Heart, Mail,
  MessageCircle, Search, Send, ShieldCheck, Sparkles, Stethoscope, Users, X, Activity, Trophy
} from 'lucide-react';
import { useDemo, type DemoState } from './data';
import { translateUserText } from './services';
import { AppFrame, ButtonLink, DoctorAvatar, EmptyState, FieldLabel, GlassPanel, Metric, PageHeading, PatientAvatar, ProgressBar, Tag } from './hb-ui';

function statusLabel(patient: DemoState) {
  if (patient.questStatus === 'pending') return 'Needs review';
  if (patient.questStatus === 'active') return 'Quest active';
  if (patient.questStatus === 'completed') return 'Quest complete';
  if (patient.questStatus === 'rejected') return 'Quest declined';
  return 'No quest';
}

function getActiveArea(patient: DemoState) {
  if (patient.learningArea) return patient.learningArea;
  if (patient.lung > 0) return 'Lung Valley';
  if (patient.heart > 0) return 'Heart Garden';
  if (patient.cultural > 0) return 'Cultural Garden';
  return 'Brain Garden';
}

function getAreaProgress(patient: DemoState, area: string) {
  if (area === 'Lung Valley') return patient.lung;
  if (area === 'Heart Garden') return patient.heart;
  if (area === 'Brain Garden') return patient.brain;
  if (area === 'Bone Mountains') return patient.bone;
  if (area === 'Muscle Meadow') return patient.muscle;
  if (area === 'Cultural Garden') return patient.cultural;
  return patient.heart || 18;
}

function PatientCard({ patient, onOpen }: { patient: DemoState; onOpen?: () => void }) {
  const href = `/doctor/patients/${patient.id}`;
  const activeArea = getActiveArea(patient);
  const progress = getAreaProgress(patient, activeArea);

  return (
    <Link
      href={href}
      onClick={onOpen}
      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-between gap-4 group"
      data-testid={`card-patient-${patient.id}`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <PatientAvatar style={patient.avatarStyle} label={patient.name} small />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <strong className="text-white text-sm font-bold truncate">{patient.name}</strong>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">
              🔥 Streak {patient.streak}
            </span>
          </div>
          <small className="text-slate-300 text-xs block">
            {activeArea} · {patient.language}
          </small>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-1 w-28">
          <div className="flex justify-between w-full text-[10px] text-slate-300">
            <span>Progress</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900/60 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <span className={`hb-status-pill status-${patient.questStatus}`}>
          {statusLabel(patient)}
        </span>

        <ChevronRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
      </div>
    </Link>
  );
}

function sendSystemMessage(sendMessage: ReturnType<typeof useDemo>['sendMessage'], patientId: string, body: string, kind: 'quest' | 'care' | 'recovery') {
  sendMessage(patientId, body, 'doctor', kind);
}

// ============================================================
// 19. DOCTOR ADMIN DASHBOARD (MOCKUP SCREEN 16)
// ============================================================
export function Doctor() {
  const { patients, messages, updatePatient, sendMessage } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenNotice, setTokenNotice] = useState('');

  const pending = patients.filter((patient) => patient.questStatus === 'pending');
  const patientReplies = messages.filter((message) => message.from === 'patient');

  const filteredPatients = patients.filter((p) =>
    `${p.name} ${p.email} ${p.language}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  function sendQuickRecoveryToken(patientId: string) {
    const target = patients.find((p) => p.id === patientId);
    if (!target) return;
    updatePatient(target.id, {
      recoveryTokens: target.recoveryTokens + 1,
      streak: target.streak + 1,
      notification: 'Dr. Maya sent you a Recovery Token. Your streak is safe — let’s keep growing.',
    });
    sendSystemMessage(sendMessage, target.id, 'Everyone misses a day. Your streak is safe. Let’s keep growing.', 'recovery');
    setTokenNotice(`Recovery Token sent to ${target.name}!`);
    setTimeout(() => setTokenNotice(''), 4000);
  }

  return (
    <AppFrame className="hb-doctor-page">
      <div className="max-w-6xl mx-auto py-4">
        {/* Doctor Header (Mockup Screen 16) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/15">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-300 shadow-xl relative bg-sky-950/40">
              <video
                src="/assets/characters/dr-maya.mp4"
                poster="/assets/characters/dr-maya.png"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const img = e.currentTarget.nextElementSibling as HTMLElement;
                  if (img) img.style.display = 'block';
                }}
              />
              <img src="/assets/characters/dr-maya.png" alt="Dr. Maya" className="w-full h-full object-cover hidden" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-300 font-bold">HitaBloom Admin</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dr. Maya</h1>
              <p className="text-xs text-slate-300 font-medium">Doctor + Administrator · General Care & Supervision</p>
            </div>
          </div>

          <div className="flex gap-2">
            <ButtonLink href="/doctor/quests">
              <ClipboardCheckIcon size={16} /> Review Quests ({pending.length})
            </ButtonLink>
            <ButtonLink href="/doctor/recovery-tokens" secondary>
              <Flower2 size={16} /> Recovery Tokens
            </ButtonLink>
          </div>
        </div>

        {tokenNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs flex items-center justify-between">
            <span>{tokenNotice}</span>
            <button type="button" onClick={() => setTokenNotice('')}><X size={14} /></button>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassPanel className="p-4 rounded-2xl">
            <span className="text-xs text-slate-300 font-medium block mb-1">Total Patients</span>
            <strong className="text-2xl font-extrabold text-white">{patients.length}</strong>
            <small className="text-[10px] text-sky-300 block mt-1">All assigned to Dr. Maya</small>
          </GlassPanel>

          <GlassPanel className="p-4 rounded-2xl">
            <span className="text-xs text-slate-300 font-medium block mb-1">Active Journeys</span>
            <strong className="text-2xl font-extrabold text-white">
              {patients.filter((p) => p.symptom || p.analyzed).length || 3}
            </strong>
            <small className="text-[10px] text-emerald-300 block mt-1">Exploring health areas</small>
          </GlassPanel>

          <GlassPanel className="p-4 rounded-2xl">
            <span className="text-xs text-slate-300 font-medium block mb-1">Pending Approvals</span>
            <strong className="text-2xl font-extrabold text-white">{pending.length}</strong>
            <small className="text-[10px] text-amber-300 block mt-1">Waiting for your review</small>
          </GlassPanel>

          <GlassPanel className="p-4 rounded-2xl">
            <span className="text-xs text-slate-300 font-medium block mb-1">Recovery Tokens</span>
            <strong className="text-2xl font-extrabold text-white">
              {patients.reduce((sum, p) => sum + p.recoveryTokens, 0)}
            </strong>
            <small className="text-[10px] text-pink-300 block mt-1">Guilt-free support sent</small>
          </GlassPanel>
        </div>

        {/* My Patients Section (Mockup Screen 16) */}
        <GlassPanel className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">My Patients</h2>
              <p className="text-xs text-slate-300">Click any patient profile to open complete medical record, review quests, and edit care plans.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  data-testid="input-patient-search"
                />
              </div>
              <button
                type="button"
                onClick={() => sendQuickRecoveryToken(patients[0]?.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow hover:scale-105 transition-all whitespace-nowrap"
              >
                Send Recovery Token
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </GlassPanel>

        {/* Pending Quest Approvals Preview */}
        {pending.length > 0 && (
          <GlassPanel className="p-6 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h3 className="text-lg font-bold text-white">Pending Quest Approvals</h3>
              </div>
              <Tag tone="tone-blue">{pending.length} pending</Tag>
            </div>
            <div className="flex flex-col gap-3">
              {pending.map((patient) => (
                <div key={patient.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <strong className="block text-white text-sm">{patient.questTitle}</strong>
                    <span className="text-xs text-slate-300">{patient.name} · {patient.questMinutes} minutes</span>
                    <p className="text-xs text-slate-400 mt-1">{patient.questNote}</p>
                  </div>
                  <ButtonLink href={`/doctor/patients/${patient.id}`} small>
                    Review Quest <ArrowRight size={14} />
                  </ButtonLink>
                </div>
              ))}
            </div>
          </GlassPanel>
        )}
      </div>
    </AppFrame>
  );
}

function ClipboardCheckIcon(props: { size?: number }) {
  return <CheckCircle2 size={props.size ?? 16} />;
}

export function DoctorPatients() {
  const { patients, selectPatient } = useDemo();
  const [query, setQuery] = useState('');
  const filtered = patients.filter((patient) =>
    `${patient.name} ${patient.email} ${patient.language}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <AppFrame className="hb-admin-patients-page">
      <div className="max-w-5xl mx-auto py-4">
        <PageHeading
          eyebrow="Patient Directory · Dr. Maya"
          title="Patient Records Directory"
          subtitle="All demo patients are assigned to Dr. Maya. Roles and records remain segregated."
          action={<ButtonLink href="/doctor" secondary><ArrowLeft size={15} /> Admin Dashboard</ButtonLink>}
        />
        <GlassPanel className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{patients.length} Patient Profiles</h2>
            <div className="relative w-64">
              <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                data-testid="input-patient-search"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {filtered.map((patient) => (
              <PatientCard key={patient.id} patient={patient} onOpen={() => selectPatient(patient.id)} />
            ))}
          </div>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

// ============================================================
// 20. PATIENT RECORD (DOCTOR REVIEW / MOCKUP SCREEN 13)
// ============================================================
export function PatientRecord() {
  const [matched, params] = useRoute('/doctor/patients/:id');
  const patientId = matched ? params?.id : undefined;
  const { patients, updatePatient, sendMessage, selectPatient } = useDemo();
  const patient = patients.find((item) => item.id === patientId);

  const [careDraft, setCareDraft] = useState(patient?.carePlan ?? '');
  const [followUpDraft, setFollowUpDraft] = useState(patient?.followUp ?? '');
  const [questTitle, setQuestTitle] = useState(patient?.questTitle ?? '');
  const [questMinutes, setQuestMinutes] = useState(patient?.questMinutes ?? '5');
  const [questNote, setQuestNote] = useState(patient?.questNote ?? '');
  const [messageDraft, setMessageDraft] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setCareDraft(patient?.carePlan ?? '');
    setFollowUpDraft(patient?.followUp ?? '');
    setQuestTitle(patient?.questTitle ?? '');
    setQuestMinutes(patient?.questMinutes ?? '5');
    setQuestNote(patient?.questNote ?? '');
    if (patient?.id) {
      selectPatient(patient.id);
    }
  }, [patient?.id]);

  if (!patient) {
    return (
      <AppFrame>
        <div className="hb-not-found-record max-w-xl mx-auto py-8">
          <EmptyState title="Patient not found" body="This profile is not available in the demo." action={<ButtonLink href="/doctor/patients">Back to patients</ButtonLink>} />
        </div>
      </AppFrame>
    );
  }

  const selectedPatient = patient;

  function saveCare() {
    updatePatient(selectedPatient.id, {
      carePlan: careDraft.trim(),
      followUp: followUpDraft.trim(),
      notification: 'Dr. Maya updated your care plan. Please review her exact instructions.',
    });
    sendSystemMessage(sendMessage, selectedPatient.id, `Dr. Maya updated your care plan: "${careDraft.trim()}". Please review the exact instructions in Doctor's Corner.`, 'care');
    setNotice('Care plan saved! The patient will see the exact updated wording immediately in Doctor’s Corner.');
  }

  function assignNewQuest() {
    if (!questTitle.trim()) {
      setNotice('Please provide a quest title before assigning.');
      return;
    }
    updatePatient(selectedPatient.id, {
      questStatus: 'active',
      questTitle: questTitle.trim(),
      questMinutes: questMinutes.trim() || '10',
      questNote: questNote.trim() || 'Gentle daily wellbeing milestone recommended by Dr. Maya.',
      notification: `Dr. Maya assigned you a new quest: "${questTitle.trim()}". Check your Quests tab!`,
    });
    sendSystemMessage(
      sendMessage,
      selectedPatient.id,
      `Dr. Maya assigned you a new wellbeing quest: "${questTitle.trim()}" (${questMinutes.trim() || '10'} mins). Guidance: ${questNote.trim() || 'Please check your Quests tab to begin.'}`,
      'quest'
    );
    setNotice(`Quest "${questTitle.trim()}" assigned and activated for ${selectedPatient.name}!`);
  }

  function updateQuestStatus(status: 'active' | 'rejected') {
    updatePatient(selectedPatient.id, { questStatus: status });
    const text = status === 'active'
      ? 'Dr. Maya approved your quest. It is ready when you are.'
      : 'Dr. Maya reviewed the quest suggestion. Please message her to discuss another step.';
    sendSystemMessage(sendMessage, selectedPatient.id, text, 'quest');
    setNotice(status === 'active' ? 'Quest approved and activated for patient.' : 'Quest declined.');
  }

  function sendRecovery() {
    updatePatient(selectedPatient.id, {
      streak: selectedPatient.streak + 1,
      recoveryTokens: selectedPatient.recoveryTokens + 1,
      notification: 'Dr. Maya sent you a Recovery Token. Your streak is safe — let’s keep growing.',
    });
    sendSystemMessage(sendMessage, selectedPatient.id, 'Everyone misses a day. Your streak is safe. Let’s keep growing.', 'recovery');
    setNotice('Recovery Token sent.');
  }

  function sendSupportiveMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!messageDraft.trim()) return;
    sendMessage(selectedPatient.id, messageDraft, 'doctor');
    setMessageDraft('');
    setNotice('Message sent to patient thread.');
  }

  return (
    <AppFrame className="hb-patient-record-page">
      <div className="max-w-5xl mx-auto py-4">
        <PageHeading
          eyebrow="Clinical Record · Dr. Maya View"
          title={`${patient.name}’s Patient Record`}
          subtitle="Review symptoms, garden progression, care plan, and approve or reject wellbeing quests."
          action={<ButtonLink href="/doctor/patients" secondary><ArrowLeft size={15} /> All Patients</ButtonLink>}
        />

        {notice && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs flex items-center justify-between" role="status" data-testid="status-record-action">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')}><X size={14} /></button>
          </div>
        )}

        {/* Patient Summary Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <GlassPanel className="md:col-span-7 p-6 rounded-3xl flex items-center gap-4">
            <div className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-2xl overflow-hidden border border-white/20 shadow flex items-center justify-center p-1 bg-indigo-950/40 flex-shrink-0">
              <PatientAvatar style={patient.avatarStyle} label={patient.name} size="medium" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs uppercase text-sky-300 font-bold tracking-wider">Assigned to Dr. Maya</span>
              <h2 className="text-2xl font-extrabold text-white truncate">{patient.name}</h2>
              <p className="text-xs text-slate-300">{patient.email} · Language: {patient.language}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">
                  🔥 Streak {patient.streak}d
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  ⭐ {patient.xp} XP
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                  🌱 {patient.recoveryTokens} Tokens
                </span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="md:col-span-5 p-6 rounded-3xl flex flex-col justify-center">
            <span className="text-xs text-slate-300 font-bold mb-1">Patient-Shared Topic</span>
            <p className="text-base text-white font-semibold">{patient.symptom || 'No symptom shared yet'}</p>
            <small className="text-xs text-sky-300 mt-1">
              Educational Match: {patient.learningArea || 'None selected'}
            </small>
          </GlassPanel>
        </div>

        {/* Quest Review Card (Mockup Screen 13) */}
        <GlassPanel className="p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl mb-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div>
                <span className="text-xs text-pink-300 font-bold uppercase tracking-wider">Human-In-The-Loop Review</span>
                <h3 className="text-xl font-extrabold text-white">Dr. Maya’s Review</h3>
              </div>
            </div>
            <span className={`hb-status-pill status-${patient.questStatus}`}>
              {statusLabel(patient)}
            </span>
          </div>

          {/* Current Quest Status Box */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-bold text-white">{patient.questTitle || 'No active quest assigned'}</h4>
              {patient.questStatus === 'active' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 mb-2">{patient.questNote || 'Prescribe or assign a quest below to guide this patient.'}</p>
            <span className="text-xs text-slate-400 font-medium">Estimated time: {patient.questMinutes || 10} minutes</span>
          </div>

          {/* Quick Review for Pending Quests */}
          {patient.questStatus === 'pending' && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/25 mb-4">
              <span className="text-xs text-amber-200 font-medium">Patient submitted this suggestion for clinical review:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateQuestStatus('active')}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow hover:scale-105 transition-all flex items-center gap-1.5"
                  data-testid="button-approve-quest"
                >
                  <CheckCircle2 size={15} /> Approve Quest
                </button>
                <button
                  type="button"
                  onClick={() => updateQuestStatus('rejected')}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 font-bold text-xs flex items-center gap-1.5"
                  data-testid="button-reject-quest"
                >
                  <X size={15} /> Reject
                </button>
              </div>
            </div>
          )}

          {/* Prescribe / Assign Quest Form */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-300" /> Prescribe or Customize Quest for {patient.name}
            </h5>
            
            {/* Quick Template Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs text-slate-400 self-center">Templates:</span>
              {[
                { title: 'Breathe Easy Challenge', mins: '10', note: 'Drink warm fluids 3 times a day and practice mindful, gentle breathing.' },
                { title: 'Heart Harmony Walk', mins: '10', note: 'Take a gentle 10-minute stroll and practice steady, rhythmic breathing.' },
                { title: 'Gentle Mobility & Posture', mins: '8', note: 'Do light posture alignment and gentle joint mobility stretches as tolerated.' },
                { title: 'Hydration & Rest Routine', mins: '5', note: 'Drink a glass of water every 2 hours and take 5 minutes of restful screen break.' },
                { title: 'Mindful Focus Pause', mins: '5', note: 'Take a 5-minute quiet resting break away from screens to let your mind recharge.' },
              ].map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => {
                    setQuestTitle(tmpl.title);
                    setQuestMinutes(tmpl.mins);
                    setQuestNote(tmpl.note);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-slate-200 transition-colors"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
              <div className="sm:col-span-8">
                <FieldLabel htmlFor="quest-title-input">Quest Title</FieldLabel>
                <input
                  id="quest-title-input"
                  className="hb-input w-full text-xs"
                  value={questTitle}
                  onChange={(e) => setQuestTitle(e.target.value)}
                  placeholder="e.g. Gentle Mobility & Posture"
                  data-testid="input-doctor-quest-title"
                />
              </div>
              <div className="sm:col-span-4">
                <FieldLabel htmlFor="quest-minutes-input">Duration (minutes)</FieldLabel>
                <input
                  id="quest-minutes-input"
                  type="number"
                  className="hb-input w-full text-xs"
                  value={questMinutes}
                  onChange={(e) => setQuestMinutes(e.target.value)}
                  placeholder="10"
                  data-testid="input-doctor-quest-minutes"
                />
              </div>
            </div>

            <div className="mb-3">
              <FieldLabel htmlFor="quest-note-input">Quest Guidance / Note</FieldLabel>
              <textarea
                id="quest-note-input"
                className="hb-input hb-textarea w-full text-xs"
                rows={2}
                value={questNote}
                onChange={(e) => setQuestNote(e.target.value)}
                placeholder="Specific instructions or encouragement from Dr. Maya..."
                data-testid="input-doctor-quest-note"
              />
            </div>

            <button
              type="button"
              onClick={assignNewQuest}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-transform active:scale-95"
              data-testid="button-assign-quest"
            >
              <CheckCircle2 size={15} /> Assign Quest to {patient.name}
            </button>
          </div>
        </GlassPanel>

        {/* Doctor Care Plan Editor & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <GlassPanel className="md:col-span-7 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-2">Edit Care Plan & Instructions</h3>
            <p className="text-xs text-slate-300 mb-4">Your words are authoritative. AI explains and translates, but never changes your instructions.</p>
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel htmlFor="record-care-plan">Care instructions</FieldLabel>
                <textarea
                  id="record-care-plan"
                  className="hb-input hb-textarea w-full text-xs"
                  rows={4}
                  value={careDraft}
                  onChange={(e) => setCareDraft(e.target.value)}
                  placeholder="Rest and stay hydrated..."
                  data-testid="input-doctor-care-plan"
                />
              </div>
              <div>
                <FieldLabel htmlFor="record-follow-up">Follow-up</FieldLabel>
                <input
                  id="record-follow-up"
                  className="hb-input w-full text-xs"
                  value={followUpDraft}
                  onChange={(e) => setFollowUpDraft(e.target.value)}
                  placeholder="Check back in 3 days."
                  data-testid="input-doctor-follow-up"
                />
              </div>
              <button
                type="button"
                onClick={saveCare}
                className="mt-2 py-2.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
                data-testid="button-save-care-plan"
              >
                <Check size={16} /> Save Care Plan
              </button>
            </div>
          </GlassPanel>

          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Recovery Token Sender */}
            <GlassPanel className="p-6 rounded-3xl">
              <span className="hb-eyebrow text-pink-300">Supportive Care</span>
              <h3 className="text-lg font-bold text-white mb-1">Send Recovery Token</h3>
              <p className="text-xs text-slate-300 mb-4">Restore patient streak after a missed day with supportive messaging.</p>
              <button
                type="button"
                onClick={sendRecovery}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
                data-testid="button-send-recovery-token"
              >
                <Flower2 size={16} /> Send Recovery Token (+1 Streak)
              </button>
            </GlassPanel>

            {/* Direct Message Form */}
            <GlassPanel className="p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-2">Message {patient.name}</h3>
              <form onSubmit={sendSupportiveMessage} className="flex gap-2">
                <input
                  id="record-message"
                  className="hb-input flex-1 text-xs"
                  value={messageDraft}
                  onChange={(e) => setMessageDraft(e.target.value)}
                  placeholder="Write a supportive note..."
                  data-testid="input-doctor-message"
                />
                <button
                  type="submit"
                  disabled={!messageDraft.trim()}
                  className="p-2.5 rounded-xl bg-sky-500 text-white"
                  data-testid="button-send-doctor-message"
                >
                  <Send size={15} />
                </button>
              </form>
            </GlassPanel>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function DoctorQuests() {
  const { patients, updatePatient, sendMessage } = useDemo();
  const pending = patients.filter((patient) => patient.questStatus === 'pending');
  const [notice, setNotice] = useState('');

  function resolve(patient: DemoState, status: 'active' | 'rejected') {
    updatePatient(patient.id, { questStatus: status });
    sendSystemMessage(
      sendMessage,
      patient.id,
      status === 'active'
        ? 'Dr. Maya approved your wellbeing quest. It is ready when you are.'
        : 'Dr. Maya declined the quest suggestion. Message her if you would like to discuss another step.',
      'quest'
    );
    setNotice(`${patient.name}’s quest was ${status === 'active' ? 'approved' : 'declined'}.`);
  }

  return (
    <AppFrame className="hb-approval-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Human-in-the-loop · Dr. Maya"
          title="Quest Approvals Queue"
          subtitle="Review each deterministic suggestion against patient context. Only doctor approval activates a quest."
          action={<ButtonLink href="/doctor" secondary>Back to Dashboard</ButtonLink>}
        />
        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs flex justify-between" role="status" data-testid="status-approval-action">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')}><X size={14} /></button>
          </div>
        )}
        <GlassPanel className="p-6 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-4">{pending.length} Pending Suggestions</h2>
          {pending.length === 0 ? (
            <EmptyState title="All caught up" body="No wellbeing quests are waiting for approval right now." />
          ) : (
            <div className="flex flex-col gap-4">
              {pending.map((patient) => (
                <div key={patient.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-testid={`card-quest-review-${patient.id}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-white text-base">{patient.questTitle}</strong>
                      <span className="text-xs text-sky-300">({patient.name})</span>
                    </div>
                    <p className="text-xs text-slate-300">{patient.questNote}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => resolve(patient, 'active')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                      data-testid={`button-approve-${patient.id}`}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => resolve(patient, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 font-bold text-xs"
                      data-testid={`button-reject-${patient.id}`}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

export function DoctorMessages() {
  const { patients, messages, sendMessage } = useDemo();
  const [selectedId, setSelectedId] = useState(patients[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const selected = patients.find((patient) => patient.id === selectedId);
  const thread = messages.filter((message) => message.patientId === selectedId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !draft.trim()) return;
    const rawText = draft.trim();
    if (selected.language !== 'English') {
      const trans = translateUserText(rawText, selected.language);
      sendMessage(selected.id, trans.translated, 'doctor', 'message', rawText, selected.language);
    } else {
      sendMessage(selected.id, rawText, 'doctor', 'message', rawText, 'English');
    }
    setDraft('');
  }

  return (
    <AppFrame className="hb-doctor-messages-page">
      <div className="max-w-5xl mx-auto py-4">
        <PageHeading
          eyebrow="Doctor Inbox · Dr. Maya"
          title="Patient Communications"
          subtitle="Read and reply to patient messages in dedicated confidential threads."
          action={<ButtonLink href="/doctor" secondary>Dashboard</ButtonLink>}
        />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <GlassPanel className="md:col-span-4 p-4 rounded-3xl">
            <span className="hb-eyebrow text-sky-300 mb-2 block">Patients</span>
            <div className="flex flex-col gap-2">
              {patients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                    selectedId === p.id ? 'bg-sky-500/20 border border-sky-400/40 text-white' : 'hover:bg-white/5 text-slate-300'
                  }`}
                  data-testid={`button-thread-${p.id}`}
                >
                  <PatientAvatar style={p.avatarStyle} label={p.name} small />
                  <div>
                    <strong className="block text-xs text-white">{p.name}</strong>
                    <small className="text-[10px] text-slate-400">{p.language}</small>
                  </div>
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="md:col-span-8 p-6 rounded-3xl flex flex-col justify-between min-h-[450px]">
            {selected ? (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-white/15 mb-4">
                  <div>
                    <strong className="text-white text-base">{selected.name}</strong>
                    <span className="text-xs text-slate-400 block">{selected.language}</span>
                  </div>
                  <ButtonLink href={`/doctor/patients/${selected.id}`} small secondary>Record</ButtonLink>
                </div>
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-4" data-testid="list-doctor-messages">
                  {thread.length === 0 ? (
                    <EmptyState title="No messages yet" body="Messages from this patient appear here." />
                  ) : (
                    thread.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl max-w-md ${
                          msg.from === 'doctor' ? 'bg-sky-500/20 border border-sky-400/30 self-end text-white' : 'bg-white/10 text-white self-start'
                        }`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="block text-[10px] text-slate-300 font-bold">{msg.from === 'doctor' ? 'Dr. Maya' : selected.name}</span>
                          {msg.language && msg.language !== 'English' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-400/30 text-sky-200">{msg.language}</span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed">{msg.body}</p>
                        {msg.originalEn && msg.originalEn !== msg.body && (
                          <div className="mt-1 pt-1 border-t border-white/10 text-[10px] text-slate-300">
                            <span className="text-slate-400 font-semibold">Original (EN):</span> {msg.originalEn}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={submit} className="flex gap-2">
                  <input
                    className="hb-input flex-1 text-xs"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Reply to ${selected.name}...`}
                    data-testid="input-doctor-thread-message"
                  />
                  <button type="submit" disabled={!draft.trim()} className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs" data-testid="button-send-doctor-thread">
                    <Send size={15} />
                  </button>
                </form>
              </>
            ) : null}
          </GlassPanel>
        </div>
      </div>
    </AppFrame>
  );
}

export function DoctorTokens() {
  const { patients, updatePatient, sendMessage } = useDemo();
  const [notice, setNotice] = useState('');

  function giveToken(patient: DemoState) {
    updatePatient(patient.id, {
      recoveryTokens: patient.recoveryTokens + 1,
      streak: patient.streak + 1,
      notification: 'Dr. Maya sent you a Recovery Token. Your streak is safe — let’s keep growing.',
    });
    sendSystemMessage(sendMessage, patient.id, 'Everyone misses a day. Your streak is safe. Let’s keep growing.', 'recovery');
    setNotice(`Recovery Token sent to ${patient.name}.`);
  }

  return (
    <AppFrame className="hb-token-page">
      <div className="max-w-4xl mx-auto py-4">
        <PageHeading
          eyebrow="Support Without Guilt · Dr. Maya"
          title="Recovery Tokens"
          subtitle="Send supportive tokens to restore patient streaks and encourage consistent engagement."
          action={<ButtonLink href="/doctor" secondary>Dashboard</ButtonLink>}
        />
        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs flex justify-between" role="status" data-testid="status-token-action">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')}><X size={14} /></button>
          </div>
        )}
        <GlassPanel className="p-6 rounded-3xl">
          <div className="flex flex-col gap-3">
            {patients.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between" data-testid={`row-token-${p.id}`}>
                <div className="flex items-center gap-3">
                  <PatientAvatar style={p.avatarStyle} label={p.name} small />
                  <div>
                    <strong className="block text-white text-sm">{p.name}</strong>
                    <span className="text-xs text-slate-300">Streak: {p.streak}d · {p.recoveryTokens} tokens received</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => giveToken(p)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs"
                  data-testid={`button-send-token-${p.id}`}
                >
                  <Flower2 size={14} className="inline mr-1" /> Send Token
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}

export function DoctorProfile() {
  const { logout, reset } = useDemo();
  const [, setPath] = useLocation();

  function signOut() {
    logout();
    setPath('/login');
  }

  function clearData() {
    if (window.confirm('Reset all demo data?')) {
      reset();
      setPath('/');
    }
  }

  return (
    <AppFrame className="hb-doctor-profile-page">
      <div className="max-w-3xl mx-auto py-4">
        <PageHeading eyebrow="Doctor Account · Dr. Maya" title="Doctor & Administrator Profile" subtitle="Central doctor and administrator for all HitaBloom demo patients." />
        <GlassPanel className="p-8 rounded-3xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/15">
            <DoctorAvatar large />
            <div>
              <h2 className="text-2xl font-bold text-white">Dr. Maya</h2>
              <p className="text-xs text-sky-300">Doctor + Administrator · drmaya@hitabloom.demo</p>
              <div className="mt-2 flex gap-2">
                <Tag tone="tone-blue"><ShieldCheck size={12} /> Sole Clinician Admin</Tag>
                <Tag><Users size={12} /> 4 Demo Patients</Tag>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button type="button" onClick={signOut} className="hb-button hb-button-secondary" data-testid="button-doctor-sign-out">
              Sign out
            </button>
            <button type="button" onClick={clearData} className="hb-button hb-button-danger" data-testid="button-doctor-reset-demo">
              Reset demo
            </button>
          </div>
        </GlassPanel>
      </div>
    </AppFrame>
  );
}
