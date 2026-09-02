import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CategoryDistributionChartProps {
  scoreLogs: {
    category: string;
    points: number;
    weekNumber: number;
  }[];
  currentWeek: number;
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ scoreLogs, currentWeek }) => {
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
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-slate-800 mb-4">Phân Bổ Vi Phạm/Khen Thưởng</h3>
      <div className="flex-1 min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} Điểm`, 'Biến động']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Chưa có biến động điểm trong tuần này
          </div>
        )}
      </div>
    </div>
  );
};
