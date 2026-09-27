import { useState, useMemo } from 'react';
import { Job, UserProfile } from '../types';
import { calculateMatchScore, getMatchLabel, getMatchBgColor } from '../utils/jobMatcher';
import { Search, SlidersHorizontal, Sparkles, MapPin, DollarSign, Clock, ChevronDown, ChevronUp, Zap, Bookmark, BookmarkCheck } from 'lucide-react';

interface Props {
  jobs: Job[];
  profile: UserProfile;
  onApply: (job: Job) => void;
  onToggleSave: (jobId: string) => void;
  onViewJob: (job: Job) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  isLoading: boolean;
}

export default function JobDiscovery({ jobs, profile, onApply, onToggleSave, onViewJob, onSearch, searchQuery, isLoading }: Props) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'salary'>('match');
  const [showFilters, setShowFilters] = useState(false);

  const scoredJobs = useMemo(() => {
    return jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, profile),
    }));
  }, [jobs, profile]);

  const filteredJobs = useMemo(() => {
    let result = scoredJobs.filter(j => j.matchScore >= minMatchScore);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'match':
        result.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'date':
        result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'salary':
        result.sort((a, b) => b.salary.max - a.salary.max);
        break;
    }

    return result;
  }, [scoredJobs, searchQuery, minMatchScore, sortBy]);

  const avgMatch = filteredJobs.length > 0
    ? Math.round(filteredJobs.reduce((sum, j) => sum + j.matchScore, 0) / filteredJobs.length)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Job Discovery</h1>
          <p className="text-gray-500 mt-1">
            {filteredJobs.length} remote jobs found • Avg match: {avgMatch}%
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="AI is searching for matching remote jobs..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Match Score: {minMatchScore}%</label>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minMatchScore}
                onChange={e => setMinMatchScore(parseInt(e.target.value))}
                className="w-40 accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'match' | 'date' | 'salary')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="match">Best Match</option>
                <option value="date">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* AI Insight Banner */}
      {profile.skills.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI Insight</span>
          </div>
          <p className="text-sm text-indigo-100">
            Based on your {profile.skills.length} skills and {profile.yearsExperience} years of experience, 
            we found <strong className="text-white">{filteredJobs.filter(j => j.matchScore >= 70).length} great matches</strong> for you. 
            {filteredJobs.filter(j => j.matchScore >= 85).length > 0 && 
              ` ${filteredJobs.filter(j => j.matchScore >= 85).length} are excellent matches!`}
          </p>
        </div>
      )}

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No jobs match your criteria</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or completing your profile</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => {
            const matchLabel = getMatchLabel(job.matchScore);
            const matchBg = getMatchBgColor(job.matchScore);
            const isExpanded = expandedJob === job.id;

            return (
              <div
                key={job.id}
                className={`bg-white rounded-xl border transition-all ${
                  job.matchScore >= 70 ? 'border-indigo-200 shadow-sm' : 'border-gray-200'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {job.companyLogo}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleSave(job.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            {job.saved ? <BookmarkCheck className="w-5 h-5 text-indigo-600" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />{job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${(job.salary.min / 1000).toFixed(0)}K - ${(job.salary.max / 1000).toFixed(0)}K
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {Math.floor((Date.now() - new Date(job.postedDate).getTime()) / 86400000)}d ago
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.tags.slice(0, 5).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className={`flex-shrink-0 text-center px-4 py-2 rounded-xl border ${matchBg}`}>
                      <div className="text-2xl font-bold text-gray-900">{job.matchScore}%</div>
                      <div className={`text-xs font-medium ${matchLabel.color}`}>{matchLabel.label}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 font-medium"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Less' : 'More'} details
                      </button>
                      <button
                        onClick={() => onViewJob(job)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View Full Details
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.applied ? (
                        <span className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                          ✓ Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => onApply(job)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Zap className="w-4 h-4" />
                          Quick Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    <p className="text-sm text-gray-700">{job.description}</p>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {job.benefits.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-md border border-green-200">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
