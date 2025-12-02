'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Upload,
  Zap,
  Camera,
  Pencil,
  FileText,
  Code,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Award,
  Target,
  Rocket,
  Brain,
} from 'lucide-react';
import Navbar from '@/components/home/NavbarNew';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/home/Footer';
import { useAuth } from '@/lib/auth/auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ConversionStats {
  totalConversions: number;
  successRate: number;
  avgProcessingTime: number;
  storageUsed: string;
  todayConversions: number;
  weekConversions: number;
  monthConversions: number;
}

interface RecentConversion {
  id: string;
  taskType: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  processingTime?: number;
}

interface ChartData {
  labels: string[];
  data: number[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ConversionStats>({
    totalConversions: 0,
    successRate: 98.5,
    avgProcessingTime: 1.2,
    storageUsed: '0 MB',
    todayConversions: 0,
    weekConversions: 0,
    monthConversions: 0,
  });
  const [recentConversions, setRecentConversions] = useState<RecentConversion[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12, 19, 15, 25, 22, 30, 28],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const historyResponse = await fetch(`${API_BASE_URL}/api/history/`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const conversions = historyData.results || historyData;

        const total = conversions.length;
        const today = conversions.filter((c: any) => {
          const convDate = new Date(c.created_at);
          const todayDate = new Date();
          return convDate.toDateString() === todayDate.toDateString();
        }).length;

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const week = conversions.filter((c: any) => new Date(c.created_at) >= weekAgo).length;

        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        const month = conversions.filter((c: any) => new Date(c.created_at) >= monthAgo).length;

        const avgTime = conversions.reduce((acc: number, c: any) => acc + (c.processing_time || 1.2), 0) / (total || 1);
        const storage = ((total * 100) / 1024).toFixed(2);

        setStats({
          totalConversions: total,
          successRate: total > 0 ? 98.5 : 0,
          avgProcessingTime: avgTime,
          storageUsed: `${storage} MB`,
          todayConversions: today,
          weekConversions: week,
          monthConversions: month,
        });

        setRecentConversions(
          conversions.slice(0, 5).map((c: any) => ({
            id: c.id,
            taskType: c.task_type || 'equation',
            timestamp: c.created_at,
            status: 'completed' as const,
            processingTime: c.processing_time || 1.2,
          }))
        );

        generateChartData(conversions, selectedPeriod);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (conversions: any[], period: 'week' | 'month' | 'year') => {
    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const count = conversions.filter((c: any) => {
          const convDate = new Date(c.created_at);
          return convDate.toDateString() === date.toDateString();
        }).length;
        data.push(count);
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i -= 5) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const count = conversions.filter((c: any) => {
          const convDate = new Date(c.created_at);
          const startDate = new Date(date);
          const endDate = new Date(date);
          endDate.setDate(endDate.getDate() + 5);
          return convDate >= startDate && convDate < endDate;
        }).length;
        data.push(count);
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        
        const count = conversions.filter((c: any) => {
          const convDate = new Date(c.created_at);
          return convDate.getMonth() === date.getMonth() && convDate.getFullYear() === date.getFullYear();
        }).length;
        data.push(count);
      }
    }

    setChartData({ labels, data });
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'draw': return <Pencil className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTaskLabel = (taskType: string) => {
    switch (taskType) {
      case 'upload': return 'Image Upload';
      case 'camera': return 'Camera Capture';
      case 'draw': return 'Hand Drawn';
      default: return 'Equation';
    }
  };

  const maxChartValue = Math.max(...chartData.data, 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    Dashboard
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Welcome back, <span className="text-purple-400 font-semibold">{user?.email?.split('@')[0] || 'User'}</span>!
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
                      <ArrowUpRight className="w-4 h-4" />
                      {stats.todayConversions > 0 ? '+' + stats.todayConversions : '0'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Total Conversions</p>
                  <p className="text-3xl font-black text-white">{loading ? '...' : stats.totalConversions.toLocaleString()}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      +2.3%
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                  <p className="text-3xl font-black text-white">{loading ? '...' : stats.successRate.toFixed(1)}%</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
                      <ArrowDownRight className="w-4 h-4" />
                      -0.3s
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Avg Processing</p>
                  <p className="text-3xl font-black text-white">{loading ? '...' : stats.avgProcessingTime.toFixed(1)}s</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-orange-400">
                      <ArrowUpRight className="w-4 h-4" />
                      +0.8 MB
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Storage Used</p>
                  <p className="text-3xl font-black text-white">{loading ? '...' : stats.storageUsed}</p>
                </div>
              </motion.div>
            </div>

            {/* Chart and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Activity Overview</h3>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {chartData.data.map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / maxChartValue) * 100}%` }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg min-h-[4px] relative group/bar"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {value}
                          </div>
                        </motion.div>
                        <span className="text-xs text-gray-500">{chartData.labels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link href="/capture"><motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold shadow-lg">
                      <Camera className="w-5 h-5" />
                      <div className="text-left flex-1"><p className="font-bold">Camera Capture</p></div>
                    </motion.button></Link>
                    <Link href="/playground"><motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold shadow-lg">
                      <Pencil className="w-5 h-5" />
                      <div className="text-left flex-1"><p className="font-bold">Playground</p></div>
                    </motion.button></Link>
                    <Link href="/compiler"><motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold shadow-lg">
                      <Code className="w-5 h-5" />
                      <div className="text-left flex-1"><p className="font-bold">LaTeX Compiler</p></div>
                    </motion.button></Link>
                    <Link href="/templates"><motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-semibold shadow-lg">
                      <FileText className="w-5 h-5" />
                      <div className="text-left flex-1"><p className="font-bold">Templates</p></div>
                    </motion.button></Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <Link href="/history" className="text-sm text-purple-400 hover:text-purple-300">View all</Link>
                  </div>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : recentConversions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400"><Brain className="w-12 h-12 mx-auto mb-2 opacity-30" /><p>No conversions yet</p></div>
                    ) : (
                      recentConversions.map((conversion, index) => (
                        <motion.div key={conversion.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + index * 0.1 }} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">{getTaskIcon(conversion.taskType)}</div>
                            <div>
                              <p className="font-semibold text-white">{getTaskLabel(conversion.taskType)}</p>
                              <p className="text-xs text-gray-400">{new Date(conversion.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">{conversion.status}</span>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Performance Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div>
                        <div><p className="text-sm text-gray-400">Today</p><p className="text-xl font-bold text-white">{stats.todayConversions}</p></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                        <div><p className="text-sm text-gray-400">This Week</p><p className="text-xl font-bold text-white">{stats.weekConversions}</p></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"><Rocket className="w-5 h-5 text-white" /></div>
                        <div><p className="text-sm text-gray-400">This Month</p><p className="text-xl font-bold text-white">{stats.monthConversions}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
