import { Job, UserProfile } from '../types';
import { calculateMatchScore, getMatchLabel, getMatchBgColor } from '../utils/jobMatcher';
import { generateCoverLetter } from '../utils/coverLetterGenerator';
import { X, MapPin, DollarSign, Clock, Zap, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  job: Job;
  profile: UserProfile;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export default function JobDetailModal({ job, profile, onClose, onApply }: Props) {
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const matchScore = calculateMatchScore(job, profile);
  const matchLabel = getMatchLabel(matchScore);
  const matchBg = getMatchBgColor(matchScore);
  const coverLetter = generateCoverLetter(job, profile);

  const userSkillNames = profile.skills.map(s => s.name.toLowerCase());
  const matchedReqs = job.requirements.filter(req =>
    userSkillNames.some(skill => req.toLowerCase().includes(skill) || skill.includes(req.toLowerCase()))
  );
  const unmatchedReqs = job.requirements.filter(req => !matchedReqs.includes(req));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
            {job.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-600 font-medium">{job.company}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
              <span className="inline-flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />${(job.salary.min / 1000).toFixed(0)}K - ${(job.salary.max / 1000).toFixed(0)}K</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.postedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-center px-4 py-2 rounded-xl border ${matchBg}`}>
              <div className="text-2xl font-bold text-gray-900">{matchScore}%</div>
              <div className={`text-xs font-medium ${matchLabel.color}`}>{matchLabel.label}</div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About the Role</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements Match */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Requirements Match</h3>
            <div className="space-y-2">
              {matchedReqs.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{req}</span>
                  <span className="text-xs text-green-600 font-medium ml-auto">✓ Match</span>
                </div>
              ))}
              {unmatchedReqs.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                  <span className="text-gray-500">{req}</span>
                  <span className="text-xs text-gray-400 font-medium ml-auto">Gap</span>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Responsibilities</h3>
            <ul className="space-y-1.5">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((b, i) => (
                <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200">{b}</span>
              ))}
            </div>
          </div>

          {/* AI Cover Letter Preview */}
          {showCoverLetter && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  AI-Generated Cover Letter
                </h3>
                <button
                  onClick={() => navigator.clipboard.writeText(coverLetter)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Copy to clipboard
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">{coverLetter}</pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={() => setShowCoverLetter(!showCoverLetter)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <FileText className="w-4 h-4" />
            {showCoverLetter ? 'Hide' : 'Preview'} Cover Letter
          </button>
          <div className="flex items-center gap-2">
            {job.applied ? (
              <span className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                ✓ Already Applied
              </span>
            ) : (
              <button
                onClick={() => { onApply(job); onClose(); }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Apply with AI
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
