"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface AnalyticsData {
  revenue: { date: string; amount: number }[];
  bets: { date: string; count: number; wins: number; losses: number }[];
  userActivity: { date: string; active: number; new: number }[];
}

export const AnalyticsGraphs = () => {
  const [data, setData] = useState<AnalyticsData>({
    revenue: [],
    bets: [],
    userActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Generate mock data for now
      const mockData = generateMockData(timeRange);
      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (range: string): AnalyticsData => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const dates = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - i - 1));
      return d.toISOString().split('T')[0];
    });

    return {
      revenue: dates.map((date) => ({
        date,
        amount: Math.floor(Math.random() * 5000) + 2000,
      })),
      bets: dates.map((date) => ({
        date,
        count: Math.floor(Math.random() * 1000) + 500,
        wins: Math.floor(Math.random() * 400) + 200,
        losses: Math.floor(Math.random() * 400) + 200,
      })),
      userActivity: dates.map((date) => ({
        date,
        active: Math.floor(Math.random() * 500) + 200,
        new: Math.floor(Math.random() * 50) + 10,
      })),
    };
  };

  const totalRevenue = data.revenue.reduce((sum, d) => sum + d.amount, 0);
  const totalBets = data.bets.reduce((sum, d) => sum + d.count, 0);
  const totalWins = data.bets.reduce((sum, d) => sum + d.wins, 0);
  const totalLosses = data.bets.reduce((sum, d) => sum + d.losses, 0);
  const winRate = totalBets > 0 ? ((totalWins / totalBets) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analytics & Insights</h3>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-md px-3 py-1 text-sm ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp size={12} />
            <span>12.5% vs last period</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Bets</p>
            <Activity size={16} className="text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">{totalBets.toLocaleString()}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-blue-400">
            <TrendingUp size={12} />
            <span>8.3% vs last period</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <TrendingUp size={16} className="text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{winRate}%</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {totalWins} wins / {totalLosses} losses
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">House Edge</p>
            <TrendingDown size={16} className="text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold">7.6%</div>
          <div className="mt-1 text-xs text-orange-400">
            <TrendingDown size={12} className="inline" />
            <span className="ml-1">-2.1% vs last period</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h4 className="mb-4 text-sm font-semibold">Revenue Trend</h4>
        <div className="relative h-64">
          <svg className="h-full w-full" viewBox="0 0 800 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 50}
                x2="800"
                y2={i * 50}
                stroke="currentColor"
                strokeOpacity="0.1"
                className="text-muted-foreground"
              />
            ))}
            
            {/* Revenue line */}
            <polyline
              points={data.revenue
                .map((d, i) => {
                  const x = (i / (data.revenue.length - 1)) * 800;
                  const y = 200 - (d.amount / 7000) * 180;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="rgb(0, 255, 0)"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]"
            />

            {/* Points */}
            {data.revenue.map((d, i) => {
              const x = (i / (data.revenue.length - 1)) * 800;
              const y = 200 - (d.amount / 7000) * 180;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="rgb(0, 255, 0)"
                  className="drop-shadow-[0_0_4px_rgba(0,255,0,0.8)]"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Wins vs Losses Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="mb-4 text-sm font-semibold">Wins vs Losses</h4>
          <div className="relative h-64">
            <svg className="h-full w-full" viewBox="0 0 400 200">
              {/* Grid */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 50}
                  x2="400"
                  y2={i * 50}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="text-muted-foreground"
                />
              ))}

              {/* Wins bars */}
              {data.bets.slice(0, 10).map((d, i) => {
                const x = (i / 10) * 360 + 20;
                const height = (d.wins / 600) * 180;
                return (
                  <rect
                    key={`win-${i}`}
                    x={x}
                    y={200 - height}
                    width="14"
                    height={height}
                    fill="rgb(0, 255, 0)"
                    opacity="0.7"
                  />
                );
              })}

              {/* Losses bars */}
              {data.bets.slice(0, 10).map((d, i) => {
                const x = (i / 10) * 360 + 20;
                const height = (d.losses / 600) * 180;
                return (
                  <rect
                    key={`loss-${i}`}
                    x={x + 16}
                    y={200 - height}
                    width="14"
                    height={height}
                    fill="rgb(255, 0, 0)"
                    opacity="0.7"
                  />
                );
              })}
            </svg>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-primary" />
              <span>Wins</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-red-500" />
              <span>Losses</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h4 className="mb-4 text-sm font-semibold">User Activity</h4>
          <div className="relative h-64">
            <svg className="h-full w-full" viewBox="0 0 400 200">
              {/* Grid */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 50}
                  x2="400"
                  y2={i * 50}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  className="text-muted-foreground"
                />
              ))}

              {/* Active users line */}
              <polyline
                points={data.userActivity
                  .slice(0, 10)
                  .map((d, i) => {
                    const x = (i / 9) * 360 + 20;
                    const y = 200 - (d.active / 700) * 180;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="rgb(0, 255, 0)"
                strokeWidth="2"
              />

              {/* New users line */}
              <polyline
                points={data.userActivity
                  .slice(0, 10)
                  .map((d, i) => {
                    const x = (i / 9) * 360 + 20;
                    const y = 200 - (d.new / 60) * 180;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="rgb(255, 102, 0)"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-primary" />
              <span>Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-secondary" />
              <span>New Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};