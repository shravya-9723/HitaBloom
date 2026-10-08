import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Clock3, Flower2, Heart, Mail,
  MessageCircle, Search, Send, ShieldCheck, Sparkles, Stethoscope, Users, X,
} from 'lucide-react';
import { useDemo, type DemoState } from './data';
import { AppFrame, ButtonLink, DoctorAvatar, EmptyState, FieldLabel, GlassPanel, Metric, PageHeading, PatientAvatar, Tag } from './hb-ui';

function statusLabel(patient: DemoState) {
  if (patient.questStatus === 'pending') return 'Needs review';
  if (patient.questStatus === 'active') return 'Quest active';
  if (patient.questStatus === 'completed') return 'Quest complete';
  if (patient.questStatus === 'rejected') return 'Quest declined';
  return 'No quest';
}

function PatientCard({ patient, onOpen }: { patient: DemoState; onOpen?: () => void }) {
  const href = `/doctor/patients/${patient.id}`;
  return <Link href={href} onClick={onOpen} className="hb-patient-card" data-testid={`card-patient-${patient.id}`}>
    <PatientAvatar style={patient.avatarStyle} label={patient.name} small/>
    <span className="hb-patient-card-main"><strong>{patient.name}</strong><small>{patient.language} · assigned to Dr. Maya</small></span>
    <span className={`hb-status-pill status-${patient.questStatus}`}>{statusLabel(patient)}</span>
    <span className="hb-patient-card-stats"><span>{patient.streak}d</span><span>{patient.xp} XP</span></span>
    <ChevronRight size={17}/>
  </Link>;
}

function sendSystemMessage(sendMessage: ReturnType<typeof useDemo>['sendMessage'], patientId: string, body: string, kind: 'quest' | 'care' | 'recovery') {
  sendMessage(patientId, body, 'doctor', kind);
}

export function Doctor() {
  const { patients, messages } = useDemo();
  const pending = patients.filter((patient) => patient.questStatus === 'pending');
  const patientReplies = messages.filter((message) => message.from === 'patient');
  const recentPatients = [...patients].sort((a, b) => b.streak - a.streak).slice(0, 4);
  return <AppFrame className="hb-doctor-page">
    <PageHeading eyebrow="Dr. Maya’s workspace · human-led care" title={<>Good morning, <span className="hb-title-accent">Dr. Maya.</span></>} subtitle="A shared view of the patient learning journeys assigned to you." action={<div className="hb-doctor-profile-chip"><DoctorAvatar small/><span><strong>Dr. Maya</strong><small>General Care</small></span></div>}/>
    <div className="hb-doctor-metrics"><Metric icon="users" value={patients.length} label="assigned patients"/><Metric icon="care" value={pending.length} label="quest reviews"/><Metric icon="message" value={patientReplies.length} label="patient messages"/><Metric icon="flower" value={patients.reduce((sum, patient) => sum + patient.recoveryTokens, 0)} label="tokens sent"/></div>
    <div className="hb-admin-layout">
      <section className="hb-admin-main">
        <GlassPanel className="hb-admin-section">
          <div className="hb-panel-heading"><div><span className="hb-eyebrow">Patient overview</span><h2>Your patients</h2><p>Each patient sees only their own journey.</p></div><ButtonLink href="/doctor/patients" secondary small>All patients <ChevronRight size={14}/></ButtonLink></div>
          <div className="hb-patient-list">{recentPatients.map((patient) => <PatientCard key={patient.id} patient={patient}/>)}</div>
        </GlassPanel>
        <GlassPanel className="hb-admin-section">
          <div className="hb-panel-heading"><div><span className="hb-eyebrow">Human-in-the-loop</span><h2>Quest approvals</h2><p>Only approved quests become active for patients.</p></div><Tag>{pending.length} pending</Tag></div>
          {pending.length === 0 ? <EmptyState title="No quests waiting for review" body="When a patient shares a learning topic, a safe deterministic suggestion can be reviewed here."/> : <div className="hb-approval-list">{pending.map((patient) => <div className="hb-approval-row" key={patient.id} data-testid={`approval-${patient.id}`}><div><strong>{patient.questTitle}</strong><span>{patient.name} · {patient.questMinutes} minutes</span><small>{patient.questNote}</small></div><ButtonLink href={`/doctor/patients/${patient.id}`} small>Review <ArrowRight size={14}/></ButtonLink></div>)}</div>}
        </GlassPanel>
      </section>
      <aside className="hb-admin-aside">
        <GlassPanel><span className="hb-eyebrow">Your care principles</span><h3>Clinician-led, always.</h3><div className="hb-principle-list"><span><ShieldCheck size={16}/> Your care instructions remain authoritative</span><span><CheckCircle2 size={16}/> Quests need your approval</span><span><Heart size={16}/> Patient growth stays guilt-free</span></div><Link href="/doctor/quests" className="hb-text-link">Open quest reviews <ChevronRight size={14}/></Link></GlassPanel>
        <GlassPanel className="hb-doctor-shortcuts"><span className="hb-eyebrow">Quick access</span><Link href="/doctor/messages"><Mail size={16}/> Messages <ChevronRight size={14}/></Link><Link href="/doctor/recovery-tokens"><Flower2 size={16}/> Recovery Tokens <ChevronRight size={14}/></Link><Link href="/doctor/profile"><Stethoscope size={16}/> Doctor profile <ChevronRight size={14}/></Link></GlassPanel>
      </aside>
    </div>
  </AppFrame>;
}

export function DoctorPatients() {
  const { patients, selectPatient } = useDemo();
  const [query, setQuery] = useState('');
  const filtered = patients.filter((patient) => `${patient.name} ${patient.email} ${patient.language}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <AppFrame className="hb-admin-patients-page">
    <PageHeading eyebrow="Patient directory" title="Every patient, one care team." subtitle="All demo patients are assigned to Dr. Maya. Patient views remain separated by role." action={<div className="hb-doctor-profile-chip"><DoctorAvatar small/><span><strong>Dr. Maya</strong><small>General Care</small></span></div>}/>
    <GlassPanel className="hb-directory-card">
      <div className="hb-directory-top"><div><span className="hb-eyebrow">Assigned patients</span><h2>{patients.length} patient profiles</h2></div><label className="hb-search-field"><Search size={16}/><span className="hb-sr-only">Search patients</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or language" data-testid="input-patient-search"/></label></div>
      {filtered.length ? <div className="hb-patient-list">{filtered.map((patient) => <PatientCard key={patient.id} patient={patient} onOpen={() => selectPatient(patient.id)}/>)}</div> : <EmptyState title="No patients match that search" body="Try a different name, email, or language."/>}
      <p className="hb-microcopy"><ShieldCheck size={13}/> Patients cannot browse or switch to another patient profile.</p>
    </GlassPanel>
  </AppFrame>;
}

export function PatientRecord() {
  const [matched, params] = useRoute('/doctor/patients/:id');
  const patientId = matched ? params?.id : undefined;
  const { patients, updatePatient, sendMessage } = useDemo();
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
  }, [patient?.id]);

  if (!patient) return <AppFrame><div className="hb-not-found-record"><EmptyState title="Patient not found" body="This profile may have been removed from the local demo." action={<ButtonLink href="/doctor/patients">Back to patients</ButtonLink>}/></div></AppFrame>;
  const selectedPatient = patient;

  function saveCare() {
    updatePatient(selectedPatient.id, {
      carePlan: careDraft.trim(),
      followUp: followUpDraft.trim(),
      notification: 'Dr. Maya updated your care plan. Please review her exact instructions.',
    });
    sendSystemMessage(sendMessage, selectedPatient.id, 'Dr. Maya updated your care plan. Please review the exact instructions in your Care plan.', 'care');
    setNotice('Care plan saved. The patient can now read the exact wording.');
  }
  function createQuest() {
    const title = questTitle.trim() || 'A gentle 5-minute pause';
    const note = questNote.trim() || 'Take a short break at a comfortable pace. Skip it if it does not feel right for you.';
    updatePatient(selectedPatient.id, { questStatus: 'pending', questTitle: title, questMinutes: questMinutes || '5', questNote: note });
    sendSystemMessage(sendMessage, selectedPatient.id, 'Dr. Maya drafted a wellbeing quest for review. It is not active yet.', 'quest');
    setNotice('Suggestion saved as pending. It is not active until you approve it.');
  }
  function updateQuestStatus(status: 'active' | 'rejected') {
    updatePatient(selectedPatient.id, { questStatus: status });
    const text = status === 'active' ? 'Dr. Maya approved your quest. It is ready when you are.' : 'Dr. Maya reviewed the quest suggestion. Please message her to discuss another step.';
    sendSystemMessage(sendMessage, selectedPatient.id, text, 'quest');
    setNotice(status === 'active' ? 'Quest approved and sent to the patient.' : 'Quest declined. No quest is active.');
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
    setNotice('Message added to the patient’s thread.');
  }

  return <AppFrame className="hb-patient-record-page">
    <PageHeading eyebrow="Patient record · doctor view" title={`${patient.name}’s learning journey.`} subtitle="Review shared topics, garden progress, the exact care plan, and doctor-approved quests." action={<ButtonLink href="/doctor/patients" secondary><ArrowLeft size={15}/> All patients</ButtonLink>}/>
    {notice && <div className="hb-inline-confirm" role="status" data-testid="status-record-action">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss confirmation"><X size={14}/></button></div>}
    <div className="hb-record-summary">
      <GlassPanel className="hb-record-person"><PatientAvatar style={patient.avatarStyle} label={patient.name}/><div><span className="hb-eyebrow">Assigned to Dr. Maya</span><h2>{patient.name}</h2><p>{patient.email} · {patient.language}</p></div><div className="hb-record-facts"><span><strong>{patient.streak}</strong><small>day streak</small></span><span><strong>{patient.xp}</strong><small>XP</small></span><span><strong>{patient.recoveryTokens}</strong><small>tokens</small></span></div></GlassPanel>
      <GlassPanel className="hb-record-topic"><span className="hb-eyebrow">Patient-shared topic</span><h3>{patient.symptom || 'No symptom shared yet'}</h3><p>{patient.learningArea ? `Educational match: ${patient.learningArea}` : 'No learning area has been selected.'}</p><Tag tone={patient.analyzed ? 'tone-blue' : ''}>{patient.analyzed ? 'Educational only · not a diagnosis' : 'Awaiting patient input'}</Tag></GlassPanel>
    </div>
    <div className="hb-record-columns">
      <section className="hb-record-column">
        <GlassPanel>
          <div className="hb-panel-heading"><div><span className="hb-eyebrow">Learning progress</span><h2>Garden map</h2></div><Sparkles size={19}/></div>
          <div className="hb-record-gardens">{[['Brain Garden', patient.brain], ['Heart Garden', patient.heart], ['Lung Valley', patient.lung], ['Bone Mountains', patient.bone], ['Muscle Meadow', patient.muscle], ['Cultural Garden', patient.cultural]].map(([name, value]) => <div key={name} className="hb-record-garden"><span>{name}</span><div className="hb-mini-progress"><i style={{ width: `${value}%` }}/></div><strong>{value}%</strong></div>)}</div>
        </GlassPanel>
        <GlassPanel className="hb-doctor-form">
          <span className="hb-eyebrow">Doctor authored · authoritative</span><h2>Care plan and follow-up</h2>
          <FieldLabel htmlFor="record-care-plan">Care instructions</FieldLabel><textarea id="record-care-plan" className="hb-input hb-textarea" rows={4} value={careDraft} onChange={(event) => setCareDraft(event.target.value)} placeholder="Write the exact instructions for this patient." data-testid="input-doctor-care-plan"/>
          <FieldLabel htmlFor="record-follow-up">Follow-up</FieldLabel><input id="record-follow-up" className="hb-input" value={followUpDraft} onChange={(event) => setFollowUpDraft(event.target.value)} placeholder="For example, check back in three days" data-testid="input-doctor-follow-up"/>
          <p className="hb-microcopy"><ShieldCheck size={13}/> HitaBloom will display these words as written. It will not add to or change them.</p>
          <button className="hb-button" type="button" onClick={saveCare} data-testid="button-save-care-plan">Save care plan <Check size={15}/></button>
        </GlassPanel>
      </section>
      <section className="hb-record-column">
        <GlassPanel className="hb-doctor-form">
          <div className="hb-panel-heading"><div><span className="hb-eyebrow">Human-in-the-loop</span><h2>Quest review</h2></div><span className={`hb-status-pill status-${patient.questStatus}`}>{statusLabel(patient)}</span></div>
          {patient.questStatus === 'none' || patient.questStatus === 'rejected' ? <div className="hb-quest-editor">
            <p>{patient.questStatus === 'rejected' ? 'Create a new suggestion if it fits this patient’s needs.' : 'Write a gentle suggestion. It will remain pending until you approve it.'}</p>
            <FieldLabel htmlFor="record-quest-title">Quest title</FieldLabel><input id="record-quest-title" className="hb-input" value={questTitle} onChange={(event) => setQuestTitle(event.target.value)} placeholder="A gentle 5-minute pause" data-testid="input-doctor-quest-title"/>
            <FieldLabel htmlFor="record-quest-minutes">Minutes</FieldLabel><input id="record-quest-minutes" className="hb-input" value={questMinutes} onChange={(event) => setQuestMinutes(event.target.value)} inputMode="numeric" data-testid="input-doctor-quest-minutes"/>
            <FieldLabel htmlFor="record-quest-note">Patient guidance</FieldLabel><textarea id="record-quest-note" className="hb-input hb-textarea" rows={3} value={questNote} onChange={(event) => setQuestNote(event.target.value)} placeholder="Keep this optional and suitable for the patient." data-testid="input-doctor-quest-note"/>
            <button className="hb-button" type="button" onClick={createQuest} data-testid="button-create-quest">Save as pending <ArrowRight size={15}/></button>
          </div> : <div className="hb-quest-review-content"><h3>{patient.questTitle}</h3><p>{patient.questNote}</p><span className="hb-quest-duration"><Clock3 size={15}/> {patient.questMinutes} minutes</span>
            {patient.questStatus === 'pending' && <div className="hb-inline-actions"><button className="hb-button" type="button" onClick={() => updateQuestStatus('active')} data-testid="button-approve-quest"><CheckCircle2 size={15}/> Approve</button><button className="hb-button hb-button-secondary" type="button" onClick={() => updateQuestStatus('rejected')} data-testid="button-reject-quest"><X size={15}/> Decline</button></div>}
            {patient.questStatus === 'active' && <p className="hb-small-note"><ShieldCheck size={14}/> Approved. The patient can now see and complete this quest.</p>}
            {patient.questStatus === 'completed' && <p className="hb-small-note"><CheckCircle2 size={14}/> The patient completed this quest.</p>}
          </div>}
        </GlassPanel>
        <GlassPanel className="hb-token-card"><span className="hb-eyebrow">Support without guilt</span><h2>Recovery Token</h2><p>Restore a patient’s streak after a missed day. The token is supportive, not a reward or penalty.</p><div className="hb-token-count"><Flower2 size={21}/><strong>{patient.recoveryTokens}</strong><span>tokens received</span></div><button className="hb-button hb-button-secondary" type="button" onClick={sendRecovery} data-testid="button-send-recovery-token"><Flower2 size={15}/> Send a token</button></GlassPanel>
        <GlassPanel className="hb-record-message"><span className="hb-eyebrow">Doctor-to-patient</span><h2>Send a supportive note</h2><form className="hb-message-compose" onSubmit={sendSupportiveMessage}><label className="hb-sr-only" htmlFor="record-message">Message to {patient.name}</label><input id="record-message" className="hb-input" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder={`Write to ${patient.name}…`} data-testid="input-doctor-message"/><button className="hb-icon-submit" type="submit" aria-label="Send message" disabled={!messageDraft.trim()} data-testid="button-send-doctor-message"><Send size={16}/></button></form><Link href="/doctor/messages" className="hb-text-link">Open all messages <ChevronRight size={14}/></Link></GlassPanel>
      </section>
    </div>
  </AppFrame>;
}

export function DoctorQuests() {
  const { patients, updatePatient, sendMessage } = useDemo();
  const pending = patients.filter((patient) => patient.questStatus === 'pending');
  const [notice, setNotice] = useState('');
  function resolve(patient: DemoState, status: 'active' | 'rejected') {
    updatePatient(patient.id, { questStatus: status });
    sendSystemMessage(sendMessage, patient.id, status === 'active' ? 'Dr. Maya approved your wellbeing quest. It is ready when you are.' : 'Dr. Maya declined the quest suggestion. Message her if you would like to discuss another step.', 'quest');
    setNotice(`${patient.name}’s quest ${status === 'active' ? 'was approved' : 'was declined'}.`);
  }
  return <AppFrame className="hb-approval-page">
    <PageHeading eyebrow="Human-in-the-loop · Dr. Maya" title="Quest review." subtitle="Review each deterministic suggestion against the patient’s context. Only your approval makes a quest active." action={<ButtonLink href="/doctor/patients" secondary>Patient directory <ChevronRight size={15}/></ButtonLink>}/>
    {notice && <div className="hb-inline-confirm" role="status" data-testid="status-approval-action">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss"><X size={14}/></button></div>}
    <GlassPanel className="hb-approval-queue">
      <div className="hb-panel-heading"><div><span className="hb-eyebrow">Waiting for review</span><h2>{pending.length} pending suggestions</h2></div><Tag><ShieldCheck size={13}/> Nothing auto-activates</Tag></div>
      {pending.length === 0 ? <EmptyState title="All caught up" body="No wellbeing quest is waiting for your approval. New suggestions appear here when a patient shares a learning topic."/> : <div className="hb-approval-list">{pending.map((patient) => <article className="hb-approval-card" key={patient.id} data-testid={`card-quest-review-${patient.id}`}>
        <div className="hb-approval-patient"><PatientAvatar style={patient.avatarStyle} label={patient.name} small/><span><strong>{patient.name}</strong><small>{patient.language} · {patient.streak} day streak</small></span><span className="hb-status-pill status-pending">Needs review</span></div>
        <div className="hb-approval-quest"><span className="hb-eyebrow">Suggested wellbeing quest</span><h3>{patient.questTitle}</h3><p>{patient.questNote}</p><span className="hb-quest-duration"><Clock3 size={15}/> {patient.questMinutes} minutes</span></div>
        <div className="hb-approval-context"><strong>Shared topic</strong><span>{patient.symptom || 'No symptom shared'}</span><small>{patient.learningArea || 'No learning area selected'} · not a diagnosis</small></div>
        <div className="hb-approval-actions"><button className="hb-button" type="button" onClick={() => resolve(patient, 'active')} data-testid={`button-approve-${patient.id}`}><CheckCircle2 size={15}/> Approve</button><button className="hb-button hb-button-secondary" type="button" onClick={() => resolve(patient, 'rejected')} data-testid={`button-reject-${patient.id}`}><X size={15}/> Decline</button><ButtonLink href={`/doctor/patients/${patient.id}`} secondary small>Open record <ArrowRight size={14}/></ButtonLink></div>
      </article>)}</div>}
    </GlassPanel>
  </AppFrame>;
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
    sendMessage(selected.id, draft, 'doctor');
    setDraft('');
  }
  return <AppFrame className="hb-doctor-messages-page">
    <PageHeading eyebrow="Patient communication · Dr. Maya" title="Messages." subtitle="Choose a patient thread to read and reply. Each patient can access only their own conversation."/>
    <div className="hb-inbox-layout">
      <GlassPanel className="hb-inbox-list"><span className="hb-eyebrow">Patient threads</span>{patients.map((patient) => {
        const count = messages.filter((message) => message.patientId === patient.id).length;
        return <button type="button" key={patient.id} className={`hb-inbox-patient ${selectedId === patient.id ? 'is-selected' : ''}`} onClick={() => setSelectedId(patient.id)} data-testid={`button-thread-${patient.id}`}><PatientAvatar style={patient.avatarStyle} label={patient.name} small/><span><strong>{patient.name}</strong><small>{count ? `${count} messages` : 'No messages yet'}</small></span><ChevronRight size={15}/></button>;
      })}</GlassPanel>
      {selected ? <GlassPanel className="hb-inbox-thread"><div className="hb-thread-header"><PatientAvatar style={selected.avatarStyle} label={selected.name} small/><div><strong>{selected.name}</strong><small>{selected.language} · patient thread</small></div><ButtonLink href={`/doctor/patients/${selected.id}`} secondary small>Patient record <ChevronRight size={13}/></ButtonLink></div>
        <div className="hb-thread-body" aria-live="polite" data-testid="list-doctor-messages">{thread.length === 0 ? <EmptyState title="No messages yet" body="Messages sent here appear in this patient’s private thread."/> : thread.map((message) => <article key={message.id} className={`hb-message ${message.from === 'doctor' ? 'from-doctor' : 'from-patient'}`} data-testid={`message-${message.id}`}><span>{message.from === 'doctor' ? 'Dr. Maya' : selected.name}{message.kind !== 'message' ? ` · ${message.kind}` : ''}</span><p>{message.body}</p><small>{new Date(message.createdAt).toLocaleString()}</small></article>)}</div>
        <form className="hb-message-compose hb-thread-compose" onSubmit={submit}><label className="hb-sr-only" htmlFor="doctor-thread-message">Write a message to {selected.name}</label><input id="doctor-thread-message" className="hb-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Write to ${selected.name}…`} data-testid="input-doctor-thread-message"/><button className="hb-button" type="submit" disabled={!draft.trim()} data-testid="button-send-doctor-thread"><Send size={16}/> Send</button></form>
      </GlassPanel> : <GlassPanel><EmptyState title="No patient selected" body="Choose a patient to read their thread."/></GlassPanel>}
    </div>
  </AppFrame>;
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
  return <AppFrame className="hb-token-page">
    <PageHeading eyebrow="Support that stays human" title="Recovery Tokens." subtitle="Restore a patient’s streak after a missed day. Tokens are supportive, not a reward or penalty."/>
    {notice && <div className="hb-inline-confirm" role="status" data-testid="status-token-action">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss"><X size={14}/></button></div>}
    <GlassPanel className="hb-token-directory"><div className="hb-panel-heading"><div><span className="hb-eyebrow">Patient token balances</span><h2>Encourage a fresh start</h2></div><Flower2 size={22}/></div>
      <div className="hb-token-list">{patients.map((patient) => <div className="hb-token-row" key={patient.id} data-testid={`row-token-${patient.id}`}><PatientAvatar style={patient.avatarStyle} label={patient.name} small/><div className="hb-token-person"><strong>{patient.name}</strong><small>{patient.streak} day streak · {patient.language}</small></div><div className="hb-token-balance"><strong>{patient.recoveryTokens}</strong><small>tokens</small></div><button className="hb-button hb-button-secondary hb-button-small" type="button" onClick={() => giveToken(patient)} data-testid={`button-send-token-${patient.id}`}><Flower2 size={14}/> Send token</button></div>)}</div>
      <div className="hb-token-quote"><span>“Everyone misses a day. Your streak is safe. Let’s keep growing.”</span><small>Supportive message sent with every token</small></div>
    </GlassPanel>
  </AppFrame>;
}

export function DoctorProfile() {
  const { logout, reset } = useDemo();
  const [, setPath] = useLocation();
  function signOut() {
    logout();
    setPath('/login');
  }
  function clearData() {
    if (window.confirm('Reset all local demo data and sign out? This clears patient changes in this browser.')) {
      reset();
      setPath('/');
    }
  }
  return <AppFrame className="hb-doctor-profile-page">
    <PageHeading eyebrow="Doctor account · demo settings" title="Dr. Maya’s profile." subtitle="The doctor role can view every local demo patient assigned to Dr. Maya."/>
    <div className="hb-doctor-profile-layout">
      <GlassPanel className="hb-doctor-profile-card"><DoctorAvatar/><div><span className="hb-eyebrow">Clinician administrator</span><h2>Dr. Maya</h2><p>General Care · Dr. Maya’s demo clinic</p><Tag><ShieldCheck size={13}/> All demo patients assigned</Tag></div><div className="hb-doctor-profile-details"><span><strong>Account</strong><small>drmaya@hitabloom.demo</small></span><span><strong>Authentication</strong><small>Local mock sign-in only</small></span><span><strong>Patient privacy</strong><small>Patient views are role separated</small></span></div></GlassPanel>
      <aside className="hb-profile-actions"><GlassPanel><span className="hb-eyebrow">Session</span><h3>End this demo session</h3><p>Signing out returns you to the role sign-in screen. Your local demo data remains saved.</p><button className="hb-button hb-button-secondary" type="button" onClick={signOut} data-testid="button-doctor-sign-out"><ArrowRight size={15}/> Sign out</button></GlassPanel><GlassPanel className="hb-reset-card"><span className="hb-eyebrow">Demo maintenance</span><h3>Reset all local data</h3><p>This clears changes to patients and messages in this browser.</p><button className="hb-button hb-button-danger" type="button" onClick={clearData} data-testid="button-doctor-reset-demo">Reset demo</button></GlassPanel></aside>
    </div>
  </AppFrame>;
}
