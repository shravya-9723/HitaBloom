import { type ComponentType, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { DemoProvider } from './data';
import { useDemo, type DemoRole } from './data';
import {
  Landing, Login, SignUp, Onboarding, Journey, CharacterPage, Cultural, Care, Quests, World, Progress,
  Messages, Profile, Doctor, DoctorPatients, PatientRecord, DoctorQuests, DoctorMessages, DoctorTokens, DoctorProfile,
} from './pages';

const queryClient = new QueryClient();
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function RoleGate({ role, children }: { role: DemoRole; children: ReactNode }) {
  const { session } = useDemo();
  if (!session) return <Redirect to="/login"/>;
  if (session.role !== role) return <Redirect to={session.role === 'doctor' ? '/doctor' : '/world'}/>;
  return <>{children}</>;
}
function protect(Page: ComponentType, role: DemoRole) {
  return function ProtectedPage() {
    return <RoleGate role={role}><Page/></RoleGate>;
  };
}
const PatientOnboarding = protect(Onboarding, 'patient');
const PatientJourney = protect(Journey, 'patient');
const PatientCharacter = protect(CharacterPage, 'patient');
const PatientCultural = protect(Cultural, 'patient');
const PatientCare = protect(Care, 'patient');
const PatientQuests = protect(Quests, 'patient');
const PatientWorld = protect(World, 'patient');
const PatientProgress = protect(Progress, 'patient');
const PatientMessages = protect(Messages, 'patient');
const PatientProfile = protect(Profile, 'patient');
const DoctorDashboard = protect(Doctor, 'doctor');
const DoctorPatientDirectory = protect(DoctorPatients, 'doctor');
const DoctorPatientRecord = protect(PatientRecord, 'doctor');
const DoctorQuestQueue = protect(DoctorQuests, 'doctor');
const DoctorInbox = protect(DoctorMessages, 'doctor');
const DoctorRecoveryTokens = protect(DoctorTokens, 'doctor');
const DoctorAccountProfile = protect(DoctorProfile, 'doctor');
function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Landing}/>
    <Route path="/login" component={Login}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="/onboarding" component={PatientOnboarding}/>
    <Route path="/journey" component={PatientJourney}/>
    <Route path="/character" component={PatientCharacter}/>
    <Route path="/cultural" component={PatientCultural}/>
    <Route path="/care" component={PatientCare}/>
    <Route path="/quests" component={PatientQuests}/>
    <Route path="/world" component={PatientWorld}/>
    <Route path="/progress" component={PatientProgress}/>
    <Route path="/messages" component={PatientMessages}/>
    <Route path="/profile" component={PatientProfile}/>
    <Route path="/doctor/patients/:id" component={DoctorPatientRecord}/>
    <Route path="/doctor/patients" component={DoctorPatientDirectory}/>
    <Route path="/doctor/quests" component={DoctorQuestQueue}/>
    <Route path="/doctor/messages" component={DoctorInbox}/>
    <Route path="/doctor/recovery-tokens" component={DoctorRecoveryTokens}/>
    <Route path="/doctor/profile" component={DoctorAccountProfile}/>
    <Route path="/doctor" component={DoctorDashboard}/>
    <Route component={NotFound}/>
  </Switch></RoutedErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><DemoProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router/></WouterRouter></DemoProvider><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;
