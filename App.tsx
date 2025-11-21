import React, { useState, useCallback } from 'react';
import { AnalysisStatus, CandidateAnalysis, ProcessingStats } from './types';
import { analyzeResume } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultsDashboard from './components/ResultsDashboard';
import { Loader2, Search, Play, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [results, setResults] = useState<CandidateAnalysis[]>([]);
  const [stats, setStats] = useState<ProcessingStats>({ total: 0, completed: 0, success: 0, failed: 0 });

  const handleStartAnalysis = useCallback(async () => {
    if (!jobDescription.trim() || files.length === 0) return;

    setStatus(AnalysisStatus.PROCESSING);
    setResults([]);
    setStats({ total: files.length, completed: 0, success: 0, failed: 0 });

    const resultsArray: CandidateAnalysis[] = [];

    // Process files in parallel with Promise.all 
    // Note: In production with 100+ files, you'd want to batch this (e.g., 5 at a time)
    const promises = files.map(async (file, index) => {
      const result = await analyzeResume(file, jobDescription, `file-${index}`);
      
      setStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        success: result.status === 'success' ? prev.success + 1 : prev.success,
        failed: result.status === 'error' ? prev.failed + 1 : prev.failed
      }));

      return result;
    });

    const completedResults = await Promise.all(promises);
    setResults(completedResults);
    setStatus(AnalysisStatus.COMPLETE);
  }, [files, jobDescription]);

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setFiles([]);
    setResults([]);
    setJobDescription('');
    setStats({ total: 0, completed: 0, success: 0, failed: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Phase */}
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Resume Shortlister</h2>
              <p className="text-lg text-slate-600">Upload resumes and a job description to instantly find your top candidates.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <div>
                <label htmlFor="jd" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                   <Search className="w-4 h-4" /> Job Description
                </label>
                <textarea
                  id="jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here (Requirements, Responsibilities, etc.)"
                  className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm leading-relaxed resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Candidate Resumes
                </label>
                <FileUpload 
                  files={files} 
                  onFilesChange={setFiles} 
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleStartAnalysis}
                  disabled={!jobDescription.trim() || files.length === 0}
                  className={`
                    w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white shadow-sm transition-all
                    ${!jobDescription.trim() || files.length === 0 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.99]'}
                  `}
                >
                  <Play className="w-5 h-5" />
                  Analyze {files.length > 0 ? `${files.length} Candidates` : 'Resumes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing Phase */}
        {status === AnalysisStatus.PROCESSING && (
          <div className="max-w-xl mx-auto mt-20 text-center animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-20"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-sm border border-blue-100">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Candidates</h3>
                <p className="text-slate-500 mb-6">Our AI is reading resumes and matching skills against your job description.</p>
                
                <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                    <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Processed: {stats.completed}/{stats.total}</span>
                    <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
                </div>
            </div>
          </div>
        )}

        {/* Results Phase */}
        {status === AnalysisStatus.COMPLETE && (
          <ResultsDashboard candidates={results} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;