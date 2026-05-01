// app/admin/page.tsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Users, TrendingUp, Activity,
  Star, Clock, CheckCircle
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2'];

const MOCK_DAILY_USERS = [
  { day: 'Mon', users: 124 },
  { day: 'Tue', users: 189 },
  { day: 'Wed', users: 234 },
  { day: 'Thu', users: 198 },
  { day: 'Fri', users: 267 },
  { day: 'Sat', users: 312 },
  { day: 'Sun', users: 278 },
];

const MOCK_FEATURE_USAGE = [
  { name: 'AI Chat', value: 42 },
  { name: 'Eligibility', value: 24 },
  { name: 'FAQ', value: 17 },
  { name: 'Booth Finder', value: 11 },
  { name: 'Documents', value: 6 },
];

const MOCK_ENGAGEMENT_TREND = [
  { week: 'W1', sessions: 890 },
  { week: 'W2', sessions: 1240 },
  { week: 'W3', sessions: 1680 },
  { week: 'W4', sessions: 2100 },
];

export default function AdminPage() {
  const { popularQuestions, messages } = useStore();

  const topQuestions = useMemo(() => {
    return Object.entries(popularQuestions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([q, count]) => ({ question: q.slice(0, 60) + (q.length > 60 ? '...' : ''), count }));
  }, [popularQuestions]);

  const statCards = [
    {
      label: 'Total Chat Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-100',
      trend: '+12%',
    },
    {
      label: 'Unique Questions Asked',
      value: Object.keys(popularQuestions).length,
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
      trend: '+8%',
    },
    {
      label: 'Avg. Engagement',
      value: '3.4m',
      icon: Clock,
      color: 'text-green-600 bg-green-100',
      trend: '+5%',
    },
    {
      label: 'Resolution Rate',
      value: '94%',
      icon: CheckCircle,
      color: 'text-amber-600 bg-amber-100',
      trend: '+2%',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor platform usage and popular election queries</p>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
          <Activity size={14} className="animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily users bar chart */}
        <div className="card-backlit p-5">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <TrendingUp size={17} className="text-blue-500" />
            Daily Active Users (This Week)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_DAILY_USERS} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="users" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature usage pie */}
        <div className="card-backlit p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star size={17} className="text-purple-500" />
            Feature Usage
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={MOCK_FEATURE_USAGE}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                dataKey="value"
              >
                {MOCK_FEATURE_USAGE.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Tooltip formatter={(v: any) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {MOCK_FEATURE_USAGE.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular questions */}
        <div className="card-backlit p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={17} className="text-green-500" />
            Top Questions (This Session)
          </h2>
          {topQuestions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No questions yet. Start chatting with the AI assistant!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topQuestions.map((q, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">{q.question}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${Math.min(100, (q.count / (topQuestions[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 shrink-0">{q.count}x</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Engagement trend */}
        <div className="card-backlit p-5">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Activity size={17} className="text-orange-500" />
            Engagement Trend (4 Weeks)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_ENGAGEMENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Real-time data from Zustand session store. Connect Firebase Analytics for persistent tracking.
      </p>
    </div>
  );
}
