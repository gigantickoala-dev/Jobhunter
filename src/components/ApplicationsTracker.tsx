import { Application } from '../types';
import { getMatchLabel } from '../utils/jobMatcher';
import { FileText, Clock, CheckCircle, XCircle, Briefcase, Send } from 'lucide-react';

interface Props {
  applications: Application[];
  onViewCoverLetter: (app: Application) => void;
}

const statusConfig: Record<Application['status'], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  queued: { label: 'Queued', color: 'text-gray-700', bg: 'bg-gray-100', icon: <Clock className="w-3.5 h-3.5" /> },
  submitted: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-100', icon: <Send className="w-3.5 h-3.5" /> },
  reviewed: { label: 'Under Review', color: 'text-purple-700', bg: 'bg-purple-100', icon: <Briefcase className="w-3.5 h-3.5" /> },
  interview: { label: 'Interview', color: 'text-amber-700', bg: 'bg-amber-100', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  offer: { label: 'Offer', color: 'text-green-700', bg: 'bg-green-100', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function ApplicationsTracker({ applications, onViewCoverLetter }: Props) {
  const sortedApps = [...applications].sort((a, b) =>
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status !== 'queued').length,
    interviewing: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'offer').length,
    avgMatch: applications.length > 0
      ? Math.round(applications.reduce((sum, a) => sum + a.matchScore, 0) / applications.length)
      : 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">Track all your submitted applications</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.submitted}</p>
          <p className="text-xs text-gray-500 mt-0.5">Submitted</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{stats.interviewing}</p>
          <p className="text-xs text-gray-500 mt-0.5">Interviews</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.offers}</p>
          <p className="text-xs text-gray-500 mt-0.5">Offers</p>
        </div>
        <div className="bg-white rounded-xl border border-indigo-200 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-700">{stats.avgMatch}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Avg Match</p>
        </div>
      </div>

      {/* Applications List */}
      {sortedApps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500 text-sm mt-1">Start applying to jobs from the Discovery tab</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedApps.map(app => {
            const status = statusConfig[app.status];
            const matchLabel = getMatchLabel(app.matchScore);

            return (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {app.companyLogo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{app.jobTitle}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{app.company} • ${app.salary.min / 1000}K - ${app.salary.max / 1000}K</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        Applied {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`text-xs font-medium ${matchLabel.color}`}>
                        {app.matchScore}% match
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onViewCoverLetter(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Cover Letter
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
