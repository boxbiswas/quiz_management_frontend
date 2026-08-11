import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../../redux/slices/leaderboardSlice';
import { fetchAdminCategories } from '../../redux/slices/adminCategoriesSlice';
import { Trophy, Medal, Search, Filter, Loader2, Award, ChevronDown } from 'lucide-react';

const LeaderboardContent = ({ userRole = 'STUDENT' }) => {
    const dispatch = useDispatch();
    const { rankings, loading, error } = useSelector(state => state.leaderboard);
    const { categories } = useSelector(state => state.adminCategories);

    const [filterType, setFilterType] = useState('overall'); // overall, weekly, monthly, category
    const [filterMetric, setFilterMetric] = useState('highest_score'); // highest_score, average_score, completed_quizzes
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchLeaderboard({
            type: filterType,
            metric: filterMetric,
            categoryId: selectedCategory
        }));
    }, [dispatch, filterType, filterMetric, selectedCategory]);

    const getMedalColor = (rank) => {
        switch (rank) {
            case 1: return 'text-yellow-400 bg-yellow-100/50 border-yellow-200'; // Gold
            case 2: return 'text-slate-400 bg-slate-100/50 border-slate-200'; // Silver
            case 3: return 'text-amber-600 bg-amber-100/50 border-amber-200'; // Bronze
            default: return 'text-ink-400 bg-warm-100 border-warm-200';
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-100" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-slate-400 fill-slate-100" />;
        if (rank === 3) return <Award className="w-5 h-5 text-amber-600 fill-amber-100" />;
        return <span className="font-mono font-bold text-ink-500">#{rank}</span>;
    };

    const formatScore = (score, metric) => {
        if (metric === 'completed_quizzes') return `${score} Quizzes`;
        return `${score}%`;
    };

    const getMetricLabel = () => {
        switch (filterMetric) {
            case 'highest_score': return 'Highest Score';
            case 'average_score': return 'Average Score';
            case 'completed_quizzes': return 'Completed Quizzes';
            default: return 'Score';
        }
    };


    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight">Leaderboard</h1>
                    </div>
                    <p className="font-body text-ink-700 ml-1">See how you rank against other {userRole === 'ADMIN' ? 'students' : 'learners'}.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/60 backdrop-blur-glass p-2 rounded-2xl shadow-glass-sm border border-white/50">
                    {/* Metric Filter */}
                    <div className="relative">
                        <select 
                            value={filterMetric}
                            onChange={(e) => setFilterMetric(e.target.value)}
                            className="appearance-none bg-white hover:bg-warm-50 text-ink-900 font-medium text-sm pl-4 pr-10 py-2.5 rounded-xl border border-warm-200 outline-none focus:ring-2 focus:ring-amber-500/40 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="highest_score">Highest Score</option>
                            <option value="average_score">Average Score</option>
                            <option value="completed_quizzes">Quizzes Completed</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-ink-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="h-8 w-px bg-warm-200"></div>

                    {/* Type Filter */}
                    <div className="relative">
                        <select 
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                if (e.target.value !== 'category') setSelectedCategory('');
                            }}
                            className="appearance-none bg-white hover:bg-warm-50 text-ink-900 font-medium text-sm pl-4 pr-10 py-2.5 rounded-xl border border-warm-200 outline-none focus:ring-2 focus:ring-amber-500/40 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="overall">All Time</option>
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                            <option value="category">By Category</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-ink-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Category Dropdown (Conditional) */}
                    {filterType === 'category' && (
                        <div className="relative animate-in fade-in slide-in-from-left-4 duration-300">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium text-sm pl-4 pr-10 py-2.5 rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500/40 transition-all cursor-pointer shadow-sm"
                            >
                                <option value="">Select Category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-amber-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                    <p className="text-ink-500 font-medium animate-pulse">Updating rankings...</p>
                </div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-3">
                        <Trophy className="w-6 h-6 opacity-50" />
                    </div>
                    <p className="font-semibold mb-1">Failed to load leaderboard</p>
                    <p className="text-sm opacity-80">{error}</p>
                </div>
            ) : rankings.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-glass border border-white/50 p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-glass-sm">
                    <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                        <Filter className="w-6 h-6 text-ink-400" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-ink-900 mb-2">No Rankings Found</h3>
                    <p className="text-ink-500 text-sm max-w-md">There are no quiz attempts matching your current filters. Try selecting a different timeframe or category.</p>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    
                    <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-md border border-white/50 overflow-hidden mt-8">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-warm-200/40 bg-warm-50/50">
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold w-24 text-center">Rank</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Student Name</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold text-right">{getMetricLabel()}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-200/30">
                                {rankings.map((student) => {
                                    const score = filterMetric === 'completed_quizzes' ? student.completedQuizzes : filterMetric === 'average_score' ? student.averageScore : student.highestScore;
                                    return (
                                        <tr key={student.id} className="hover:bg-white/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getMedalColor(student.rank)}`}>
                                                        {getRankIcon(student.rank)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-body font-semibold text-ink-900">{student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-mono font-bold text-ink-900 group-hover:text-amber-600 transition-colors">
                                                    {formatScore(score, filterMetric)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardContent;
