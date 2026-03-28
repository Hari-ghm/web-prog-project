import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const PieChart = ({ solar, wind }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const data = [
    { name: 'Solar', value: solar },
    { name: 'Wind', value: wind }
  ];
  
  const COLORS = ['#14B8A6', '#3B82F6'];
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: isDark ? '#F1F5F9' : '#0F172A' }}
          />
          <Legend iconType="circle" />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-[-10px] pointer-events-none">
        <div className="text-ms font-bold">{solar + wind}</div>
        <div className="text-[10px] text-gray-500">MWh Total</div>
      </div>
    </div>
  );
};

export default PieChart;
