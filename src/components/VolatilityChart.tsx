
import { MarketData } from '@/types/market';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VolatilityChartProps {
  data: MarketData[];
}

export const VolatilityChart = ({ data }: VolatilityChartProps) => {
  const chartData = data.map(item => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volatility: item.volatility,
    volume: item.volume / 1000000 // Convert to millions
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [
              name === 'volatility' ? `${value.toFixed(2)}%` : `${value.toFixed(2)}M`,
              name === 'volatility' ? 'Volatility' : 'Volume'
            ]}
          />
          <Bar 
            dataKey="volatility" 
            fill="#f59e0b"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
