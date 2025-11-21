import React, { useMemo } from 'react';
import { CandidateAnalysis } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Star, Award, AlertTriangle, CheckCircle, User, TrendingUp, Download } from 'lucide-react';

interface ResultsDashboardProps {
  candidates: CandidateAnalysis[];
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ candidates, onReset }) => {
  // Sort candidates by score desc
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => b.matchScore - a.matchScore);
  }, [candidates]);

  const averageScore = useMemo(() => {
    if (candidates.length === 0) return 0;
    const sum = candidates.reduce((acc, curr) => acc + curr.matchScore, 0);
    return Math.round(sum / candidates.length);
  }, [candidates]);

  const topCandidate = sortedCandidates[0];

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#22c55e'; // Green-500
    if (score >= 70) return '#3b82f6'; // Blue-500
    if (score >= 50) return '#eab308'; // Yellow-500
    return '#ef4444'; // Red-500
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <User className="w-24 h-24 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Candidates Screened</p>
            <h3 className="text-3xl font-bold text-slate-900">{candidates.length}</h3>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            All processed
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
           <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Average Match Score</p>
            <h3 className="text-3xl font-bold text-slate-900">{averageScore}%</h3>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ width: `${averageScore}%`, backgroundColor: getScoreColor(averageScore) }}
            />
          </div>
        </div>

        {topCandidate && (
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <p className="text-sm font-medium text-blue-100">Top Match</p>
              </div>
              <h3 className="text-2xl font-bold truncate">{topCandidate.name}</h3>
              <p className="text-blue-100 text-sm mt-1 opacity-90 truncate">{topCandidate.educationLevel}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-3xl font-bold">{topCandidate.matchScore}%</span>
              <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm backdrop-blur-sm transition-colors">
                View Details
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">Ranked Candidates</h2>
            <button 
                onClick={onReset}
                className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
                New Search
            </button>
          </div>
          
          <div className="space-y-4">
            {sortedCandidates.map((candidate, index) => (
              <div 
                key={candidate.id} 
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 truncate flex items-center gap-2">
                        {index + 1}. {candidate.name}
                        {index === 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScoreBadgeColor(candidate.matchScore)}`}>
                        {candidate.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">
                      {candidate.summary}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-green-700 flex items-center gap-1 mb-1">
                                <TrendingUp className="w-3 h-3" /> Strengths
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {candidate.keyStrengths.slice(0, 3).map((s, i) => (
                                    <span key={i} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs border border-green-100">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                             <p className="font-semibold text-red-700 flex items-center gap-1 mb-1">
                                <AlertTriangle className="w-3 h-3" /> Missing / Weakness
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {candidate.missingSkills.slice(0, 3).map((s, i) => (
                                    <span key={i} className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs border border-red-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 min-w-fit border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                    <div className="text-center">
                        <span className="block text-xs text-slate-400 uppercase font-bold">Exp</span>
                        <span className="text-lg font-bold text-slate-700">{candidate.experienceYears}y</span>
                    </div>
                     <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Download Report">
                        <Download className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts / Analytics Sidebar */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Score Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[...sortedCandidates].reverse()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                tick={{fontSize: 10, fill: '#64748b'}} 
                                interval={0} 
                                angle={-45} 
                                textAnchor="end" 
                                height={60}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                cursor={{fill: '#f8fafc'}}
                            />
                            <Bar dataKey="matchScore" radius={[4, 4, 0, 0]} barSize={20}>
                                {sortedCandidates.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.matchScore)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Insights</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-blue-500 mt-1.5"></div>
                        <span>
                            Top candidate <strong>{topCandidate.name}</strong> matches {topCandidate.matchScore}% of requirements.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-blue-500 mt-1.5"></div>
                        <span>
                            Average experience level is <strong>{Math.round(candidates.reduce((a, b) => a + b.experienceYears, 0) / candidates.length)} years</strong>.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-blue-500 mt-1.5"></div>
                        <span>
                            Processed <strong>{candidates.length}</strong> resumes in total.
                        </span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;