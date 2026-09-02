import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface GroupScoreChartProps {
  groupSummaries: {
    group: number;
    totalScore: number;
  }[];
}

export const GroupScoreChart: React.FC<GroupScoreChartProps> = ({ groupSummaries }) => {
  const data = groupSummaries.map(g => ({
    name: `Tổ ${g.group}`,
    score: Number(g.avgScore.toFixed(1))
  }));

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-slate-800 mb-4">Điểm Thi Đua Các Tổ</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#F1F5F9' }} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Điểm TB/HS" maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
