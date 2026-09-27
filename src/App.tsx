import { useState, useEffect, useCallback } from 'react';
import { UserProfile, Job, Application, ViewType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateJobs } from './data/mockJobs';
import { calculateMatchScore } from './utils/jobMatcher';
import { generateCoverLetter } from './utils/coverLetterGenerator';
import UserProfileView from './components/UserProfileView';
import JobDiscovery from './components/JobDiscovery';
import ApplicationsTracker from './components/ApplicationsTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import JobDetailModal from './components/JobDetailModal';
import CoverLetterModal from './components/CoverLetterModal';
import {
  Search, Send, BarChart3, User, Menu, X,
  Sparkles, Zap, ChevronRight
} from 'lucide-react';

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  title: '',
  yearsExperience: 0,
  skills: [],
  desiredRoles: [],
  desiredSalaryMin: 0,
  desiredSalaryMax: 0,
  education: '',
  summary: '',
  resumeFileName: '',
  location: '',
};

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('discovery');
  const [profile, setProfile] = useLocalStorage<UserProfile>('ai-job-profile', defaultProfile);
  const [applications, setApplications] = useLocalStorage<Application[]>('ai-job-applications', []);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applyToast, setApplyToast] = useState<string | null>(null);

  // Generate jobs when profile changes or on initial load
  const searchJobs = useCallback(() => {
    setIsLoading(true);
    const field = profile.desiredRoles.length > 0
      ? profile.desiredRoles.join(',')
      : profile.skills.slice(0, 3).map(s => s.name).join(',');

    setTimeout(() => {
      const newJobs = generateJobs(field || 'fullstack', 30);
      const scoredJobs = newJobs.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job, profile),
        applied: applications.some(a => a.jobId === job.id),
      }));
      setJobs(scoredJobs);
      setIsLoading(false);
    }, 800);
  }, [profile, applications]);

  useEffect(() => {
    searchJobs();
  }, []);

  const handleApply = (job: Job) => {
    const matchScore = calculateMatchScore(job, profile);
    const coverLetter = generateCoverLetter(job, profile);
    const today = new Date().toISOString().split('T')[0];

    const newApp: Application = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      appliedDate: today,
      status: 'submitted',
      matchScore,
      coverLetter,
      salary: job.salary,
    };

    setApplications(prev => [newApp, ...prev]);
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j));
    setApplyToast(`${job.title} at ${job.company}`);
    setTimeout(() => setApplyToast(null), 3000);
  };

  const handleToggleSave = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, saved: !j.saved } : j));
  };

  const navItems = [
    { id: 'discovery' as ViewType, label: 'AI Discovery', icon: Search, badge: jobs.filter(j => !j.applied && j.matchScore >= 70).length },
    { id: 'applications' as ViewType, label: 'Applications', icon: Send, badge: applications.length },
    { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart3 },
    { id: 'profile' as ViewType, label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apply Toast */}
      {applyToast && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <div>
              <p className="text-sm font-semibold">Application Submitted!</p>
              <p className="text-xs text-green-100">{applyToast}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">AI JobHunter</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-5 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">AI JobHunter</h1>
                <p className="text-xs text-gray-500">Smart Job Search</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Profile Status */}
            <div className="mt-4 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-indigo-900">
                  {profile.name || 'Set up profile'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (profile.skills.length * 10) + (profile.title ? 30 : 0) + (profile.name ? 20 : 0) + (profile.yearsExperience > 0 ? 20 : 0))}%` }}
                  ></div>
                </div>
                <span className="text-xs text-indigo-600 font-medium">
                  {profile.skills.length > 0 && profile.title ? '✓' : 'Incomplete'}
                </span>
              </div>
              <button
                onClick={() => { setCurrentView('profile'); setSidebarOpen(false); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 mt-1.5 flex items-center gap-0.5 font-medium"
              >
                Edit profile <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 lg:p-8 overflow-x-hidden">
          {currentView === 'profile' && (
            <UserProfileView profile={profile} onSave={(p) => { setProfile(p); searchJobs(); }} />
          )}
          {currentView === 'discovery' && (
            <JobDiscovery
              jobs={jobs}
              profile={profile}
              onApply={handleApply}
              onToggleSave={handleToggleSave}
              onViewJob={setSelectedJob}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
              isLoading={isLoading}
            />
          )}
          {currentView === 'applications' && (
            <ApplicationsTracker
              applications={applications}
              onViewCoverLetter={setSelectedApplication}
            />
          )}
          {currentView === 'analytics' && (
            <AnalyticsDashboard applications={applications} />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          profile={profile}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}
      {selectedApplication && (
        <CoverLetterModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}

export default App;
