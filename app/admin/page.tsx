// app/admin/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Users, TrendingUp, Activity,
  Star, Clock, CheckCircle, Download, Shield, Database,
  Cpu, BarChart3, Calendar, RefreshCw
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2'];

const MOCK_DAILY_USERS = [
  { day: 'Mon', users: 124, sessions: 210 },
  { day: 'Tue', users: 189, sessions: 310 },
  { day: 'Wed', users: 234, sessions: 400 },
  { day: 'Thu', users: 198, sessions: 340 },
  { day: 'Fri', users: 267, sessions: 440 },
  { day: 'Sat', users: 312, sessions: 520 },
  { day: 'Sun', users: 278, sessions: 460 },
];

const MOCK_FEATURE_USAGE = [
  { name: 'AI Chat', value: 42 },
  { name: 'Eligibility', value: 24 },
  { name: 'FAQ', value: 17 },
  { name: 'Booth Finder', value: 11 },
  { name: 'Documents', value: 6 },
];

const MOCK_ENGAGEMENT_TREND = [
  { week: 'W1', sessions: 890, queries: 450 },
  { week: 'W2', sessions: 1240, queries: 720 },
  { week: 'W3', sessions: 1680, queries: 980 },
  { week: 'W4', sessions: 2100, queries: 1360 },
];

const DATE_RANGES = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'all', label: 'All Time' },
];

export default function AdminPage() {
  const { popularQuestions, messages } = useStore();
  const [dateRange, setDateRange] = useState('7d');
  const [lastRefresh] = useState(new Date());

  const topQuestions = useMemo(() => {
    return Object.entries(popularQuestions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([q, count]) => ({ question: q.slice(0, 60) + (q.length > 60 ? '...' : ''), count }));
  }, [popularQuestions]);

  const exportCSV = () => {
    if (topQuestions.length === 0) {
      toast.error('No data to export');
      return;
    }
    const header = 'Question,Count\n';
    const rows = topQuestions.map(q => `"${q.question}",${q.count}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `election_analytics_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const statCards = [
    { label: 'Total Messages', value: messages.length, icon: MessageSquare, color: 'text-blue-600 bg-blue-100', gradient: 'from-blue-500 to-indigo-600', trend: '+12%' },
    { label: 'Unique Questions', value: Object.keys(popularQuestions).length, icon: Users, color: 'text-purple-600 bg-purple-100', gradient: 'from-purple-500 to-violet-600', trend: '+8%' },
    { label: 'Avg. Engagement', value: '3.4m', icon: Clock, color: 'text-green-600 bg-green-100', gradient: 'from-green-500 to-emerald-600', trend: '+5%' },
    { label: 'Resolution Rate', value: '94%', icon: CheckCircle, color: 'text-amber-600 bg-amber-100', gradient: 'from-amber-500 to-orange-600', trend: '+2%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl">
            <BarChart3 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Monitor platform usage, popular queries, and system health</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-bold border border-green-200 shadow-sm">
            <Activity size={14} className="animate-pulse" /> Live
          </div>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-white text-gray-700 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        <Calendar size={16} className="text-gray-400 mr-1" />
        {DATE_RANGES.map((range) => (
          <button
            key={range.id}
            onClick={() => setDateRange(range.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              dateRange === range.id
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {range.label}
          </button>
        ))}
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
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${card.color} shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    {card.trend}
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily users bar chart */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-base">
            <TrendingUp size={18} className="text-blue-500" />
            Daily Active Users & Sessions
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={MOCK_DAILY_USERS} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '12px 16px' }}
              />
              <Bar dataKey="users" fill="#2563eb" radius={[6, 6, 0, 0]} name="Users" />
              <Bar dataKey="sessions" fill="#c7d2fe" radius={[6, 6, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature usage pie */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
            <Star size={18} className="text-purple-500" />
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
                strokeWidth={3}
                stroke="#fff"
              >
                {MOCK_FEATURE_USAGE.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-3">
            {MOCK_FEATURE_USAGE.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Popular questions */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
              <MessageSquare size={18} className="text-green-500" />
              Top Questions (This Session)
            </h2>
            {topQuestions.length > 0 && (
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{topQuestions.length} tracked</span>
            )}
          </div>
          {topQuestions.length === 0 ? (
            <div className="text-center py-14 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">No questions yet</p>
              <p className="text-xs text-gray-400 mt-1">Start chatting with the AI assistant to see data here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topQuestions.map((q, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-200 text-gray-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate font-medium group-hover:text-gray-900 transition-colors">{q.question}</p>
                    <div className="w-full bg-gray-50 rounded-full h-1.5 mt-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${Math.min(100, (q.count / (topQuestions[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-gray-600 shrink-0 bg-gray-100 px-2 py-0.5 rounded-md">{q.count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Engagement trend */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-base">
            <Activity size={18} className="text-orange-500" />
            Engagement Trend (4 Weeks)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_ENGAGEMENT_TREND}>
              <defs>
                <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#sessionGrad)"
                dot={{ fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Line type="monotone" dataKey="queries" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
            <Shield size={18} className="text-indigo-500" />
            System Status
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <RefreshCw size={12} /> Last refreshed: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Gemini AI', status: 'Operational', icon: Cpu, color: 'bg-green-50 text-green-700 border-green-200' },
            { name: 'Firebase', status: 'Operational', icon: Database, color: 'bg-green-50 text-green-700 border-green-200' },
            { name: 'Google Maps', status: 'Operational', icon: Star, color: 'bg-green-50 text-green-700 border-green-200' },
            { name: 'Speech API', status: 'Operational', icon: Activity, color: 'bg-green-50 text-green-700 border-green-200' },
          ].map((service) => (
            <div key={service.name} className={`flex items-center gap-3 p-4 rounded-2xl border ${service.color}`}>
              <service.icon size={20} />
              <div>
                <p className="text-sm font-bold">{service.name}</p>
                <p className="text-[10px] font-semibold opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {service.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Real-time data from Zustand session store. Connect Firebase Analytics for persistent tracking.
      </p>
    </div>
  );
}
