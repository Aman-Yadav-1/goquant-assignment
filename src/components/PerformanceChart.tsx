import { MarketData } from '@/types/market';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  data: MarketData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const chartData = data.map(item => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    performance: item.changePercent,
    price: item.close
  }));

  return (
    <div className="h-64" style={{ zIndex: 1, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip
            wrapperStyle={{ zIndex: 1, position: 'relative' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [
              name === 'performance' ? `${value.toFixed(2)}%` : `$${value.toFixed(2)}`,
              name === 'performance' ? 'Change' : 'Price'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="performance" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#1d4ed8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
