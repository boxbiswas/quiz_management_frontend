import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAttempts } from '../../../redux/slices/studentAttemptSlice';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Target, Play, ArrowRight, Activity, Zap } from 'lucide-react';

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

const StudentDashboardContent = () => {
    const dispatch = useDispatch();
    const { myAttempts, historyLoading } = useSelector(state => state.studentAttempt);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchMyAttempts());
    }, [dispatch]);

    // Calculate stats
    const completedAttempts = myAttempts.filter(a => a.status === 'PASSED' || a.status === 'FAILED');
    const passedAttempts = completedAttempts.filter(a => a.status === 'PASSED');
    
    const totalQuizzes = completedAttempts.length;
    const passRate = totalQuizzes > 0 ? Math.round((passedAttempts.length / totalQuizzes) * 100) : 0;
    const averageScore = totalQuizzes > 0 ? Math.round(completedAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalQuizzes) : 0;

    const recentAttempts = myAttempts.slice(0, 3); // Get top 3

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-10">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="font-body text-ink-700">Here's an overview of your learning progress.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {/* Stat 1 */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <Trophy className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Quizzes Taken</p>
                        <h3 className="font-display font-semibold text-3xl text-ink-900 leading-none">{totalQuizzes}</h3>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center shrink-0">
                        <Target className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Pass Rate</p>
                        <h3 className="font-display font-semibold text-3xl text-ink-900 leading-none">{passRate}%</h3>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-sm border border-white/50 p-6 flex items-center gap-5 transition-transform hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Zap className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Avg. Score</p>
                        <h3 className="font-display font-semibold text-3xl text-ink-900 leading-none">{averageScore}%</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-lg shadow-amber-500/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        
                        <div className="relative z-10">
                            <h2 className="font-display font-bold text-3xl mb-3">Ready for a challenge?</h2>
                            <p className="text-amber-100 font-body mb-8 max-w-md text-lg">
                                Discover new quizzes across various categories and put your knowledge to the test.
                            </p>
                            
                            <Link to="/student/quizzes" className="inline-flex items-center gap-2 bg-white text-amber-600 hover:bg-warm-50 px-8 py-3.5 rounded-full font-body font-semibold transition-all shadow-md active:scale-[0.98]">
                                <Play className="w-5 h-5 fill-current" />
                                Browse Quizzes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Sidebar */}
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

                        {historyLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : recentAttempts.length === 0 ? (
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
                                        <div key={attempt.id} className="p-4 rounded-xl border border-warm-100 bg-white/50 hover:bg-white transition-colors group">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-display font-medium text-ink-900 line-clamp-1 flex-1">
                                                    {attempt.quiz?.title}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-ink-500 mb-3">{timeAgo(attempt.startedAt)}</p>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                    !isCompleted ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    isPassed ? 'bg-sage-50 text-sage-600 border-sage-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                                                }`}>
                                                    {!isCompleted ? 'In Progress' : isPassed ? 'Passed' : 'Failed'}
                                                </span>
                                                
                                                {isCompleted ? (
                                                    <span className="font-body font-semibold text-sm text-ink-900">
                                                        {attempt.percentage}%
                                                    </span>
                                                ) : (
                                                    <Link to={`/student/quizzes/${attempt.quizId}/take`} className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                                                        Resume <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
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
