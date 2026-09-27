import { useMemo } from 'react';
import { Application } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Send, Trophy, BarChart3, Calendar } from 'lucide-react';

interface Props {
  applications: Application[];
}

export default function AnalyticsDashboard({ applications }: Props) {
  const analytics = useMemo(() => {
    // Applications per day (last 14 days)
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyApps = last14Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      applications: applications.filter(a => a.appliedDate === date).length,
    }));

    // Match score distribution
    const matchRanges = [
      { range: '0-20%', count: 0 },
      { range: '21-40%', count: 0 },
      { range: '41-60%', count: 0 },
      { range: '61-80%', count: 0 },
      { range: '81-100%', count: 0 },
    ];
    applications.forEach(app => {
      if (app.matchScore <= 20) matchRanges[0].count++;
      else if (app.matchScore <= 40) matchRanges[1].count++;
      else if (app.matchScore <= 60) matchRanges[2].count++;
      else if (app.matchScore <= 80) matchRanges[3].count++;
      else matchRanges[4].count++;
    });

    // Status breakdown
    const statusCounts = [
      { name: 'Queued', value: applications.filter(a => a.status === 'queued').length, color: '#9CA3AF' },
      { name: 'Submitted', value: applications.filter(a => a.status === 'submitted').length, color: '#3B82F6' },
      { name: 'Review', value: applications.filter(a => a.status === 'reviewed').length, color: '#8B5CF6' },
      { name: 'Interview', value: applications.filter(a => a.status === 'interview').length, color: '#F59E0B' },
      { name: 'Offer', value: applications.filter(a => a.status === 'offer').length, color: '#10B981' },
      { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#EF4444' },
    ].filter(s => s.value > 0);

    // Top companies
    const companyCounts: Record<string, number> = {};
    applications.forEach(app => {
      companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Average match score trend
    const sortedByDate = [...applications].sort((a, b) =>
      new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
    );
    const matchTrend = sortedByDate.slice(-10).map((app, i) => ({
      day: i + 1,
      score: app.matchScore,
    }));

    // Summary stats
    const totalApplied = applications.filter(a => a.status !== 'queued').length;
    const avgMatch = applications.length > 0
      ? Math.round(applications.reduce((sum, a) => sum + a.matchScore, 0) / applications.length)
      : 0;
    const highMatchApps = applications.filter(a => a.matchScore >= 70).length;
    const responseRate = totalApplied > 0
      ? Math.round((applications.filter(a => ['reviewed', 'interview', 'offer'].includes(a.status)).length / totalApplied) * 100)
      : 0;

    return { dailyApps, matchRanges, statusCounts, topCompanies, matchTrend, totalApplied, avgMatch, highMatchApps, responseRate };
  }, [applications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Insights into your job application journey</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Applications</p>
              <p className="text-3xl font-bold mt-1">{analytics.totalApplied}</p>
            </div>
            <Send className="w-8 h-8 text-indigo-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Avg Match Score</p>
              <p className="text-3xl font-bold mt-1">{analytics.avgMatch}%</p>
            </div>
            <Target className="w-8 h-8 text-emerald-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">High Match Apps</p>
              <p className="text-3xl font-bold mt-1">{analytics.highMatchApps}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Response Rate</p>
              <p className="text-3xl font-bold mt-1">{analytics.responseRate}%</p>
            </div>
            <Trophy className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Applications Over Time</h3>
          </div>
          {applications.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet — start applying to see trends
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.dailyApps}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366F1" fill="url(#colorApps)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Application Status</h3>
          </div>
          {analytics.statusCounts.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.statusCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.statusCounts.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {analytics.statusCounts.map(status => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm text-gray-600">{status.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{status.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Match Score Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Match Score Distribution</h3>
          </div>
          {applications.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.matchRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Match Score Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Match Score Trend</h3>
          </div>
          {analytics.matchTrend.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.matchTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9CA3AF" label={{ value: 'Application #', position: 'bottom', fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Top Companies Applied To</h3>
        {analytics.topCompanies.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet</p>
        ) : (
          <div className="space-y-3">
            {analytics.topCompanies.map((company, i) => (
              <div key={company.name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">{i + 1}.</span>
                <span className="text-sm font-medium text-gray-900 flex-1">{company.name}</span>
                <div className="flex-1 max-w-[200px]">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(company.count / analytics.topCompanies[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 w-8 text-right">{company.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
