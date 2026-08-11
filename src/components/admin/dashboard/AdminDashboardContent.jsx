import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats } from '../../../redux/slices/adminDashboardSlice';
import { Users, BookOpen, Activity, Trophy, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md border border-warm-200 shadow-xl rounded-xl p-4 text-sm font-body z-50">
                <p className="text-ink-500 text-xs mb-1 font-medium">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="font-display font-semibold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AdminDashboardContent = () => {
    const dispatch = useDispatch();
    const {
        statistics,
        passFailAnalytics,
        popularQuizzes,
        popularCategories,
        charts,
        loading
    } = useSelector(state => state.adminDashboard);

    useEffect(() => {
        dispatch(fetchAdminDashboardStats());
    }, [dispatch]);

    if (loading || !statistics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-ink-500 font-medium font-body animate-pulse">Loading analytics...</p>
            </div>
        );
    }

    // Format Pass/Fail Data for PieChart
    const passFailData = [
        { name: 'Passed', value: passFailAnalytics.passed },
        { name: 'Failed', value: passFailAnalytics.failed },
    ];
    const COLORS = ['#10b981', '#ef4444']; // Emerald-500 for passed, Red-500 for failed

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="font-display font-semibold text-3xl text-ink-900 tracking-tight">Platform Analytics</h1>
                <p className="font-body text-ink-500 mt-1">High-level overview of platform health and student engagement.</p>
            </div>

            {/* Core Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs text-ink-500 uppercase tracking-wider font-semibold">Total Students</span>
                    </div>
                    <h3 className="font-display font-semibold text-4xl text-ink-900">{statistics.totalStudents}</h3>
                </div>

                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs text-ink-500 uppercase tracking-wider font-semibold">Total Quizzes</span>
                    </div>
                    <h3 className="font-display font-semibold text-4xl text-ink-900">{statistics.totalQuizzes}</h3>
                </div>

                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs text-ink-500 uppercase tracking-wider font-semibold">Total Attempts</span>
                    </div>
                    <h3 className="font-display font-semibold text-4xl text-ink-900">{statistics.totalAttempts}</h3>
                </div>

                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs text-ink-500 uppercase tracking-wider font-semibold">Average Score</span>
                    </div>
                    <h3 className="font-display font-semibold text-4xl text-ink-900">{statistics.averageScore}%</h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Main Time Series Chart */}
                <div className="xl:col-span-2 bg-white/70 backdrop-blur-glass rounded-2xl shadow-glass-sm border border-white/50 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-display font-semibold text-lg text-ink-900">Quiz Attempts (Last 30 Days)</h3>
                    </div>
                    <div className="h-[300px]">
                        {charts?.attemptsOverTime?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.attemptsOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        tick={{ fontSize: 12, fill: '#78716c' }}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#78716c' }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        name="Attempts"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fill="url(#colorAttempts)"
                                        activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-ink-400 font-medium">No attempt data available</div>
                        )}
                    </div>
                </div>

                {/* Pass/Fail Pie Chart */}
                <div className="bg-white/70 backdrop-blur-glass rounded-2xl shadow-glass-sm border border-white/50 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <PieChartIcon className="w-5 h-5 text-ink-500" />
                        <h3 className="font-display font-semibold text-lg text-ink-900">Pass / Fail Ratio</h3>
                    </div>
                    <p className="text-xs text-ink-500 mb-4">Overall success rate across all quizzes.</p>
                    <div className="h-[250px]">
                        {passFailAnalytics?.passed > 0 || passFailAnalytics?.failed > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={passFailData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {passFailData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-ink-400 font-medium">No pass/fail data available</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Quizzes Bar Chart */}
                <div className="bg-white/70 backdrop-blur-glass rounded-2xl shadow-glass-sm border border-white/50 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-amber-500" />
                        <h3 className="font-display font-semibold text-lg text-ink-900">Most Popular Quizzes</h3>
                    </div>
                    <div className="h-[300px]">
                        {popularQuizzes?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={popularQuizzes} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                    <XAxis 
                                        dataKey="title" 
                                        tick={{ fontSize: 12, fill: '#78716c' }} 
                                        axisLine={false} 
                                        tickLine={false}
                                        angle={-35}
                                        textAnchor="end"
                                        height={45}
                                    />
                                    <YAxis 
                                        type="number" 
                                        tick={{ fontSize: 12, fill: '#78716c' }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        allowDecimals={false} 
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef3c7', opacity: 0.4 }} />
                                    <Bar dataKey="attempts" name="Attempts" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-ink-400 font-medium">No quiz data available</div>
                        )}
                    </div>
                </div>

                {/* Popular Categories Bar Chart */}
                <div className="bg-white/70 backdrop-blur-glass rounded-2xl shadow-glass-sm border border-white/50 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        <h3 className="font-display font-semibold text-lg text-ink-900">Most Popular Categories</h3>
                    </div>
                    <div className="h-[300px]">
                        {popularCategories?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={popularCategories} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 12, fill: '#78716c' }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        angle={-35}
                                        textAnchor="end"
                                        height={45}
                                    />
                                    <YAxis 
                                        type="number" 
                                        tick={{ fontSize: 12, fill: '#78716c' }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        allowDecimals={false} 
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eff6ff', opacity: 0.4 }} />
                                    <Bar dataKey="attempts" name="Attempts" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-ink-400 font-medium">No category data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardContent;
