import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAttempts } from '../../../redux/slices/studentAttemptSlice';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, History as HistoryIcon, ArrowRight, Calendar, Activity, BookOpen, Clock } from 'lucide-react';

// Helper for formatting date
const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
};

const HistoryContent = () => {
    const dispatch = useDispatch();
    const { myAttempts, historyLoading, error } = useSelector(state => state.studentAttempt);

    useEffect(() => {
        dispatch(fetchMyAttempts());
    }, [dispatch]);

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">My History</h1>
                <p className="font-body text-ink-700">Review your past quiz attempts and track your progress.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex gap-3 items-center">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            {historyLoading && myAttempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                    <p className="text-ink-500 font-medium">Loading history...</p>
                </div>
            ) : myAttempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-white/50 backdrop-blur-md rounded-xl2 border border-white">
                    <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                        <HistoryIcon className="w-6 h-6 text-ink-500" />
                    </div>
                    <h3 className="font-display font-medium text-xl text-ink-900 mb-1">No attempts yet</h3>
                    <p className="text-ink-500 text-sm mb-6">You haven't taken any quizzes. Head over to the Discover Quizzes tab to get started!</p>
                    <Link to="/student/quizzes" className="bg-ink-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ink-800 transition-all flex items-center gap-2">
                        Discover Quizzes <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAttempts.map((attempt) => {
                        const isCompleted = attempt.status === 'PASSED' || attempt.status === 'FAILED';
                        const isPassed = attempt.status === 'PASSED';

                        return (
                            <div key={attempt.id} className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-sm border border-white/50 p-6 flex flex-col transition-all hover:shadow-glass-md group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-flex items-center text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                        !isCompleted ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                        isPassed ? 'bg-sage-50 text-sage-600 border-sage-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                                    }`}>
                                        {!isCompleted ? 'In Progress' : isPassed ? 'Passed' : 'Failed'}
                                    </span>
                                    
                                    {attempt.quiz?.category && (
                                        <span className="text-xs font-body font-medium text-ink-500 flex items-center gap-1.5 bg-warm-100 px-2 py-1 rounded">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {attempt.quiz.category.name}
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="font-display font-semibold text-xl text-ink-900 mb-1 line-clamp-2">
                                    {attempt.quiz?.title || "Unknown Quiz"}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-xs font-body text-ink-500 mb-6">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(attempt.startedAt)}
                                </div>

                                {isCompleted ? (
                                    <div className="grid grid-cols-2 gap-3 mb-6 bg-warm-50/50 p-3 rounded-xl border border-warm-200/50">
                                        <div>
                                            <p className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mb-0.5">Score</p>
                                            <p className="font-body font-semibold text-ink-900 text-lg leading-none">{attempt.score}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mb-0.5">Percentage</p>
                                            <p className={`font-body font-semibold text-lg leading-none ${isPassed ? 'text-sage-600' : 'text-rose-600'}`}>
                                                {attempt.percentage}%
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6 flex-1 flex items-center justify-center p-4 bg-amber-50/50 rounded-xl border border-amber-200/50 text-amber-700 text-sm text-center">
                                        <Clock className="w-4 h-4 mr-2 shrink-0" />
                                        This attempt is currently in progress.
                                    </div>
                                )}

                                <div className="mt-auto">
                                    {isCompleted ? (
                                        <Link 
                                            to={`/student/attempts/${attempt.id}/results`}
                                            className="w-full bg-white border border-warm-200 text-ink-900 hover:bg-warm-50 font-body font-medium text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:border-ink-200"
                                        >
                                            Review Attempt
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    ) : (
                                        <Link 
                                            to={`/student/quizzes/${attempt.quizId}/take`}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-body font-medium text-sm py-2.5 rounded-xl transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                                        >
                                            Resume Attempt
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryContent;
