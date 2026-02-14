
import React, { useState } from 'react';
import { Roadmap, RoadmapTask } from '../types';
import { ChevronRight, Target, BookOpen, Wrench, Globe, CheckCircle2 } from 'lucide-react';

interface Props {
  roadmap: Roadmap[];
}

export const RoadmapView: React.FC<Props> = ({ roadmap }) => {
  const [activeWeek, setActiveWeek] = useState(1);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Learn': return <BookOpen className="w-4 h-4" />;
      case 'Build': return <Wrench className="w-4 h-4" />;
      case 'Network': return <Globe className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const currentWeek = roadmap.find(w => w.week === activeWeek) || roadmap[0];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {roadmap.map((w) => (
          <button
            key={w.week}
            onClick={() => setActiveWeek(w.week)}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${
              activeWeek === w.week 
              ? 'bg-white text-black border-white' 
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            Week {w.week}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Weekly Focus: {currentWeek.focus}</h3>
            <p className="text-zinc-400 text-sm">Targeted skill acquisition phase.</p>
          </div>
          <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
            <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-1">Checkpoint</span>
            <p className="text-sm font-semibold text-white">{currentWeek.checkpoint}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentWeek.tasks.map((task, idx) => (
            <div key={idx} className="group p-5 rounded-xl bg-black border border-zinc-800 hover:border-zinc-500 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono uppercase">Day {task.day}</span>
                <span className="text-zinc-600 group-hover:text-white transition-colors">
                  {getIcon(task.category)}
                </span>
              </div>
              <h4 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">{task.title}</h4>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{task.description}</p>
              
              {task.resources && task.resources.length > 0 && (
                <div className="space-y-1">
                   <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">Resources</span>
                   {task.resources.map((res, i) => (
                     <a key={i} href="#" className="block text-xs text-blue-500 hover:underline truncate">
                       {res}
                     </a>
                   ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
