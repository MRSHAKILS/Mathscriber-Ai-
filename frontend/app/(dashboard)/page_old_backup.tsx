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
import Sidebar from '@/components/editor/Sidebar';
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

            {/* Stats continue below... */}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
