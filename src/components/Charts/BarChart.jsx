import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const BarChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis 
            type="number" 
            stroke={textColor} 
            tick={{ fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke={textColor} 
            tick={{ fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: isDark ? '#F1F5F9' : '#0F172A' }}
            cursor={{ fill: isDark ? '#334155' : '#F1F5F9' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Bar dataKey="solar" name="Solar" stackId="a" fill="#14B8A6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="wind" name="Wind" stackId="a" fill="#3B82F6" radius={[0, 4, 4, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
