import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { DemoProvider } from './data';
import { Landing, Onboarding, Journey, CharacterPage, Cultural, Care, Quests, World, Progress, Doctor } from './pages';

const queryClient = new QueryClient();
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Landing}/>
    <Route path="/onboarding" component={Onboarding}/>
    <Route path="/journey" component={Journey}/>
    <Route path="/character" component={CharacterPage}/>
    <Route path="/cultural" component={Cultural}/>
    <Route path="/care" component={Care}/>
    <Route path="/quests" component={Quests}/>
    <Route path="/world" component={World}/>
    <Route path="/progress" component={Progress}/>
    <Route path="/doctor" component={Doctor}/>
    <Route component={NotFound}/>
  </Switch></RoutedErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><DemoProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router/></WouterRouter></DemoProvider><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;
