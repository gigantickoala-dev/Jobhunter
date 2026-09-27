import { JobApplication, STATUS_CONFIG } from '../types';
import { Briefcase, Send, Users, Trophy, XCircle, Clock, TrendingUp, Sparkles } from 'lucide-react';

interface DashboardProps {
  applications: JobApplication[];
  onLoadSampleData?: () => void;
}

export default function Dashboard({ applications, onLoadSampleData }: DashboardProps) {
  const total = applications.length;
  const applied = applications.filter(a => a.status === 'applied').length;
  const interviewing = applications.filter(a => a.status === 'interview').length;
  const offers = applications.filter(a => a.status === 'offer').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const saved = applications.filter(a => a.status === 'saved').length;
  const screening = applications.filter(a => a.status === 'screening').length;

  const responseRate = total > 0 ? Math.round(((screening + interviewing + offers + rejected) / Math.max(total - saved, 1)) * 100) : 0;

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statusCounts = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
    status: key,
    ...config,
    count: applications.filter(a => a.status === key).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your job search progress</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Welcome / Empty State */}
      {applications.length === 0 && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome to JobTracker!</h2>
              <p className="mt-2 text-indigo-100">
                Start tracking your job applications to stay organized. You can add applications manually or load sample data to see how everything works.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {onLoadSampleData && (
                  <button
                    onClick={onLoadSampleData}
                    className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm"
                  >
                    Load Sample Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Briefcase className="w-6 h-6 text-indigo-600" />}
          label="Total Applications"
          value={total}
          bgColor="bg-indigo-50"
          borderColor="border-indigo-200"
        />
        <StatCard
          icon={<Send className="w-6 h-6 text-blue-600" />}
          label="Applied"
          value={applied}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-amber-600" />}
          label="Interviewing"
          value={interviewing}
          bgColor="bg-amber-50"
          borderColor="border-amber-200"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-green-600" />}
          label="Offers"
          value={offers}
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            {statusCounts.map(item => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.bgColor} border ${item.color.replace('text-', 'border-')}`}></span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
                <p className="text-xs text-gray-500">Response Rate</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rejected}</p>
                <p className="text-xs text-gray-500">Rejections</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{saved}</p>
                <p className="text-xs text-gray-500">Not Yet Applied</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Recent Activity</h3>
          {recentApplications.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map(app => (
                <div key={app.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${STATUS_CONFIG[app.status].bgColor} border ${STATUS_CONFIG[app.status].color.replace('text-', 'border-')}`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{app.position}</p>
                    <p className="text-xs text-gray-500 truncate">{app.company}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor, borderColor }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}
