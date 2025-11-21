import React from 'react';
import { BrainCircuit, Briefcase } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TalentScout AI</h1>
            <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Documentation</a>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="w-4 h-4" />
            <span>HR Professional Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;