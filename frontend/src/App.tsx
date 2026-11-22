import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell';
import { PublicIssueFeedPage } from './pages/PublicIssueFeedPage/PublicIssueFeedPage';
import { ReportIssuePage } from './pages/ReportIssuePage/ReportIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage/IssueDetailPage';
import { AuthorityTriageDashboardPage } from './pages/AuthorityTriageDashboardPage/AuthorityTriageDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/"           element={<PublicIssueFeedPage />} />
          <Route path="/report"     element={<ReportIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
          <Route path="/triage"     element={<AuthorityTriageDashboardPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
