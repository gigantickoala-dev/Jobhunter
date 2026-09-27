import { useState } from 'react';
import { JobApplication, ApplicationStatus, ViewMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import { LayoutDashboard, Briefcase, Plus, Menu, X } from 'lucide-react';

function App() {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job-applications', []);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSaveApplication = (data: Omit<JobApplication, 'id' | 'createdAt'>) => {
    if (editingApplication) {
      setApplications(prev =>
        prev.map(app =>
          app.id === editingApplication.id
            ? { ...app, ...data }
            : app
        )
      );
    } else {
      const newApplication: JobApplication = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setApplications(prev => [newApplication, ...prev]);
    }
    setEditingApplication(null);
    setCurrentView('applications');
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setCurrentView('add');
  };

  const handleAddNew = () => {
    setEditingApplication(null);
    setCurrentView('add');
  };

  const handleCancel = () => {
    setEditingApplication(null);
    setCurrentView('applications');
  };

  const handleLoadSampleData = () => {
    const sampleData: JobApplication[] = [
      {
        id: crypto.randomUUID(),
        company: 'Google',
        position: 'Senior Frontend Engineer',
        location: 'Mountain View, CA',
        salary: '$180,000 - $220,000',
        url: 'https://careers.google.com',
        status: 'interview',
        dateApplied: '2026-01-15',
        notes: 'Had phone screen with recruiter. Technical interview scheduled for next week. Focus on React patterns and system design.',
        contactName: 'Sarah Chen',
        contactEmail: 'sarah.chen@google.com',
        tags: ['remote-friendly', 'react', 'senior'],
        createdAt: '2026-01-15T10:00:00Z',
      },
      {
        id: crypto.randomUUID(),
        company: 'Stripe',
        position: 'Software Engineer - Payments',
        location: 'San Francisco, CA',
        salary: '$170,000 - $200,000',
        url: 'https://stripe.com/jobs',
        status: 'applied',
        dateApplied: '2026-01-20',
        notes: 'Applied through referral from Mike. Great company culture.',
        contactName: '',
        contactEmail: '',
        tags: ['payments', 'typescript', 'referral'],
        createdAt: '2026-01-20T14:00:00Z',
      },
      {
        id: crypto.randomUUID(),
        company: 'Airbnb',
        position: 'Full Stack Developer',
        location: 'Remote',
        salary: '$160,000 - $190,000',
        url: 'https://airbnb.com/careers',
        status: 'screening',
        dateApplied: '2026-01-10',
        notes: 'Application under review. HR reached out for initial screening.',
        contactName: 'Lisa Park',
        contactEmail: 'lisa.park@airbnb.com',
        tags: ['remote', 'full-stack', 'travel'],
        createdAt: '2026-01-10T09:00:00Z',
      },
      {
        id: crypto.randomUUID(),
        company: 'Meta',
        position: 'Frontend Engineer',
        location: 'Menlo Park, CA',
        salary: '$175,000 - $210,000',
        url: 'https://metacareers.com',
        status: 'rejected',
        dateApplied: '2025-12-20',
        notes: 'Rejected after technical round. Coding test was on graph algorithms. Need to practice more DSA.',
        contactName: '',
        contactEmail: '',
        tags: ['react', 'dsa'],
        createdAt: '2025-12-20T11:00:00Z',
      },
      {
        id: crypto.randomUUID(),
        company: 'Shopify',
        position: 'Developer Experience Engineer',
        location: 'Remote (Canada)',
        salary: '$140,000 - $170,000',
        url: 'https://shopify.com/careers',
        status: 'saved',
        dateApplied: '',
        notes: 'Interesting role focused on internal tooling. Need to tailor resume.',
        contactName: '',
        contactEmail: '',
        tags: ['remote', 'devex', 'tooling'],
        createdAt: '2026-01-22T16:00:00Z',
      },
      {
        id: crypto.randomUUID(),
        company: 'Vercel',
        position: 'Next.js Developer Advocate',
        location: 'Remote',
        salary: '$150,000 - $180,000',
        url: 'https://vercel.com/careers',
        status: 'offer',
        dateApplied: '2026-01-05',
        notes: 'Received offer! Need to respond by Feb 1. Great team and benefits package.',
        contactName: 'Alex Rivera',
        contactEmail: 'alex@vercel.com',
        tags: ['nextjs', 'remote', 'advocacy'],
        createdAt: '2026-01-05T08:00:00Z',
      },
    ];
    setApplications(sampleData);
  };

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications' as ViewMode, label: 'Applications', icon: Briefcase },
    { id: 'add' as ViewMode, label: 'Add New', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">JobTracker</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
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
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">JobTracker</h1>
                <p className="text-xs text-gray-500">Application Manager</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id || 
                  (item.id === 'applications' && currentView === 'add' && editingApplication);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'add') {
                        handleAddNew();
                      } else {
                        setCurrentView(item.id);
                      }
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {item.id === 'applications' && (
                      <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {applications.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <p className="text-sm font-medium text-indigo-900">Job Search Tips</p>
              <p className="text-xs text-indigo-700 mt-1">
                Track every application and follow up within 1-2 weeks if you haven't heard back.
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 lg:p-8">
          {currentView === 'dashboard' && (
            <Dashboard applications={applications} onLoadSampleData={handleLoadSampleData} />
          )}
          {currentView === 'applications' && (
            <ApplicationList
              applications={applications}
              onEdit={handleEdit}
              onDelete={handleDeleteApplication}
              onStatusChange={handleStatusChange}
              onAddNew={handleAddNew}
            />
          )}
          {currentView === 'add' && (
            <ApplicationForm
              application={editingApplication}
              onSave={handleSaveApplication}
              onCancel={handleCancel}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
