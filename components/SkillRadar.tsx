
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SkillGap } from '../types';

interface Props {
  gaps: SkillGap[];
}

export const SkillRadar: React.FC<Props> = ({ gaps }) => {
  const data = gaps.slice(0, 6).map(g => ({
    subject: g.skill,
    A: g.importance * 10, // Target/Importance
    B: Math.random() * 40 + 20, // Simulated current level for visual contrast
    fullMark: 100,
  }));

  return (
    <div className="h-[300px] w-full bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Skill Mapping (Market Match)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Market Requirement"
            dataKey="A"
            stroke="#ffffff"
            fill="#ffffff"
            fillOpacity={0.1}
          />
          <Radar
            name="Current Proficiency"
            dataKey="B"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
