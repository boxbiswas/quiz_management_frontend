import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentDashboardStats } from '../../../redux/slices/studentDashboardSlice';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Target, Globe, ArrowRight, Activity, Zap, CheckCircle2, XCircle, BarChart3, HelpCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Helper for relative time
const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-warm-200 shadow-xl rounded-xl p-4 text-sm font-body">
                <p className="text-ink-500 text-xs mb-1 font-medium">{new Date(label).toLocaleDateString()}</p>
                <p className="text-amber-600 font-display font-semibold text-xl">{payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

const StudentDashboardContent = () => {
    const dispatch = useDispatch();
    const { statistics, recentAttempts, performanceData, loading } = useSelector(state => state.studentDashboard);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchStudentDashboardStats());
    }, [dispatch]);

    if (loading || !statistics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-ink-500 font-medium font-body animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">
                        Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                    </h1>
                    <p className="font-body text-ink-700">Here's an overview of your learning progress and performance.</p>
                </div>
                <Link to="/student/quizzes" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-body font-semibold transition-all shadow-md active:scale-[0.98] shrink-0">
                    <Globe className="w-6 h-6" />
                    Browse Quizzes
                </Link>
            </div>

            {/* Quick Stats Grid - Expanded */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {/* Total Taken */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-5 flex flex-col transition-all hover:shadow-glass-md hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <Target className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Quizzes</span>
                    </div>
                    <h3 className="font-display font-semibold text-3xl text-ink-900 leading-none mb-1">{statistics.totalAttempts}</h3>
                    <p className="text-xs text-ink-500 font-medium">Total Taken</p>
                </div>

                {/* Average Score */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-5 flex flex-col transition-all hover:shadow-glass-md hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Avg.</span>
                    </div>
                    <h3 className="font-display font-semibold text-3xl text-ink-900 leading-none mb-1">{statistics.averageScore}%</h3>
                    <p className="text-xs text-ink-500 font-medium">Average Score</p>
                </div>

                {/* Highest Score */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-5 flex flex-col transition-all hover:shadow-glass-md hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Best</span>
                    </div>
                    <h3 className="font-display font-semibold text-3xl text-ink-900 leading-none mb-1">{statistics.highestScore}%</h3>
                    <p className="text-xs text-ink-500 font-medium">Highest Score</p>
                </div>

                {/* Passed */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-5 flex flex-col transition-all hover:shadow-glass-md hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-sage-500/5 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Passed</span>
                    </div>
                    <h3 className="font-display font-semibold text-3xl text-sage-700 leading-none mb-1">{statistics.passedAttempts}</h3>
                    <p className="text-xs text-ink-500 font-medium">Quizzes Passed</p>
                </div>

                {/* Failed */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-5 flex flex-col transition-all hover:shadow-glass-md hover:-translate-y-0.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">Failed</span>
                    </div>
                    <h3 className="font-display font-semibold text-3xl text-rose-700 leading-none mb-1">{statistics.failedAttempts}</h3>
                    <p className="text-xs text-ink-500 font-medium">Quizzes Failed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Chart */}
                <div className="lg:col-span-2">
                    <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-md border border-white/50 p-6 md:p-8 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-display font-semibold text-xl text-ink-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-amber-500" />
                                    Performance Over Time
                                </h3>
                                <p className="text-sm font-body text-ink-500 mt-1">Your score progression across all completed quizzes.</p>
                            </div>
                        </div>

                        {performanceData && performanceData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={performanceData}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                            tick={{ fontSize: 12, fill: '#737373' }}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis 
                                            domain={[0, 100]}
                                            tickFormatter={(val) => `${val}%`}
                                            tick={{ fontSize: 12, fill: '#737373' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="#f59e0b" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorScore)" 
                                            activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-warm-200 rounded-xl">
                                <BarChart3 className="w-12 h-12 text-warm-300 mb-3" />
                                <p className="text-ink-500 font-medium text-center">Not enough data to display</p>
                                <p className="text-ink-400 text-sm text-center max-w-xs mt-1">Take a few quizzes to see your performance chart grow!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="lg:col-span-1">
                    <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-md border border-white/50 p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-semibold text-lg text-ink-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-500" />
                                Recent Activity
                            </h3>
                            {recentAttempts.length > 0 && (
                                <Link to="/student/history" className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors">
                                    View all
                                </Link>
                            )}
                        </div>

                        {recentAttempts.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-warm-200 rounded-xl">
                                <Clock className="w-8 h-8 text-warm-300 mb-2" />
                                <p className="text-sm font-medium text-ink-600">No activity yet</p>
                                <p className="text-xs text-ink-400 mt-1">Take a quiz to see it here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentAttempts.map(attempt => {
                                    const isCompleted = attempt.status === 'PASSED' || attempt.status === 'FAILED';
                                    const isPassed = attempt.status === 'PASSED';
                                    
                                    return (
                                        <Link 
                                            key={attempt.id} 
                                            to={isCompleted ? `/student/attempts/${attempt.id}/results` : `/student/history`}
                                            className="block p-4 rounded-xl border border-warm-100 bg-white/50 hover:bg-white hover:border-amber-200 hover:shadow-sm transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-display font-medium text-ink-900 line-clamp-1 flex-1 group-hover:text-amber-700 transition-colors">
                                                    {attempt.quizTitle}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-ink-500 mb-3">{timeAgo(attempt.date)}</p>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                    !isCompleted ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    isPassed ? 'bg-sage-50 text-sage-600 border-sage-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                                                }`}>
                                                    {!isCompleted ? 'In Progress' : isPassed ? 'Passed' : 'Failed'}
                                                </span>
                                                
                                                {isCompleted ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-body font-semibold text-sm text-ink-900">
                                                            {attempt.score}%
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-ink-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                                                        Resume <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardContent;
