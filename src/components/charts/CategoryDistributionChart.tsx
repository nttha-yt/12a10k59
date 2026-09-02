import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface CategoryDistributionChartProps {
  scoreLogs: {
    category: string;
    points: number;
    weekNumber: number;
  }[];
  currentWeek: number;
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ scoreLogs, currentWeek }) => {
  const { isDark } = useTheme();
  const currentLogs = scoreLogs.filter(l => l.weekNumber === currentWeek);
  
  // Calculate total absolute points per category for the chart
  const categories: Record<string, number> = {
    ne_nep: 0,
    hoc_tap: 0,
    ve_sinh: 0,
    phong_trao: 0,
    khac: 0
  };

  currentLogs.forEach(log => {
    if (categories[log.category] !== undefined) {
      categories[log.category] += Math.abs(log.points);
    }
  });

  const data = [
    { name: 'Nề nếp', value: categories.ne_nep, color: '#3B82F6' },
    { name: 'Học tập', value: categories.hoc_tap, color: '#10B981' },
    { name: 'Vệ sinh', value: categories.ve_sinh, color: '#F59E0B' },
    { name: 'Phong trào', value: categories.phong_trao, color: '#8B5CF6' },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors duration-200">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 text-sm sm:text-base flex items-center justify-between">
        <span>Phân Bổ Vi Phạm / Khen Thưởng</span>
        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">Tuần {currentWeek}</span>
      </h3>
      <div className="flex-1 min-h-[240px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke={isDark ? '#0F172A' : '#FFFFFF'}
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} Điểm`, 'Biến động']}
                contentStyle={{ 
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{
                  color: isDark ? '#94A3B8' : '#64748B',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
            Chưa có biến động điểm trong tuần này
          </div>
        )}
      </div>
    </div>
  );
};
