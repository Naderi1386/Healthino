import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import type { DailyLog } from '../../../core/db/types';

export interface PerformanceChartProps {
  dailyLogs: DailyLog[];
}

interface ChartDataItem {
  name: string;
  green: number;
  yellow: number;
  red: number;
  dateStr: string;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  dataKey: string | number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black p-3.5 rounded-xl shadow-lg border border-white/5 text-white font-sans text-xs select-none">
        <p className="font-semibold mb-2 text-white/90 tracking-wide border-b border-white/10 pb-1">
          {label} Details
        </p>
        <div className="space-y-1.5 min-w-[110px]">
          {payload.map((entry) => {
            const emoji = entry.dataKey === 'green' ? '🟢' : entry.dataKey === 'yellow' ? '🟡' : '🔴';
            return (
              <div key={entry.dataKey} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-1.5 text-white/70">
                  <span>{emoji}</span>
                  <span>{entry.name}</span>
                </div>
                <span className="font-bold text-white">{entry.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ dailyLogs }) => {
  const chartData: ChartDataItem[] = dailyLogs.map((log) => {
    const green = log.tags.filter((t) => t.includes('🟢')).length;
    const yellow = log.tags.filter((t) => t.includes('🟡')).length;
    const red = log.tags.filter((t) => t.includes('🔴')).length;
    const d = new Date(log.date + 'T00:00:00');
    const formattedName = isNaN(d.getTime())
      ? log.date
      : d.toLocaleDateString('en-US', { weekday: 'short' });

    return { name: formattedName, green, yellow, red, dateStr: log.date };
  });

  return (
    <div className="w-full h-[260px] font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }} barGap={0}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(28, 36, 33, 0.06)" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#1C2421', opacity: 0.6, fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#1C2421', opacity: 0.6, fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(28, 36, 33, 0.02)', radius: 4 }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconSize={8}
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '16px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(28, 36, 33, 0.7)',
            }}
          />
          <Bar dataKey="green" name="Green Tags" stackId="a" fill="var(--color-accent-primary)" />
          <Bar dataKey="yellow" name="Yellow Tags" stackId="a" fill="var(--color-accent-secondary)" />
          <Bar dataKey="red" name="Red Tags" stackId="a" fill="var(--color-alert)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
