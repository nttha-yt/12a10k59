import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface GroupScoreChartProps {
  groupSummaries: {
    group: number;
    avgScore: number;
    totalScore: number;
  }[];
}

export const GroupScoreChart: React.FC<GroupScoreChartProps> = ({ groupSummaries }) => {
  const { isDark } = useTheme();

  const data = groupSummaries.map(g => ({
    name: `Tổ ${g.group}`,
    score: Number(g.avgScore.toFixed(1))
  }));

  const gridStroke = isDark ? '#334155' : '#E2E8F0';
  const textFill = isDark ? '#94A3B8' : '#64748B';
  const cursorFill = isDark ? 'rgba(51, 65, 85, 0.4)' : '#F1F5F9';

  return (
    <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors duration-200">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm sm:text-base flex items-center justify-between">
        <span>Điểm Thi Đua Các Tổ</span>
        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">Điểm TB/HS</span>
      </h3>
      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textFill, fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: textFill, fontSize: 12 }} domain={[0, 100]} />
            <Tooltip 
              cursor={{ fill: cursorFill }} 
              contentStyle={{ 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                color: isDark ? '#F1F5F9' : '#0F172A',
                fontSize: '12px',
                fontWeight: '600',
              }}
              formatter={(value: any) => [`${value} đ`, 'Điểm TB']}
            />
            <Bar dataKey="score" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Điểm TB/HS" maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
