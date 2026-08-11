import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchAttemptDetails } from '../../../redux/slices/studentAttemptSlice';
import { ArrowLeft, Loader2, Trophy, AlertCircle, Clock, CheckCircle2, XCircle, AlertTriangle, BookOpen } from 'lucide-react';

const QuizResultsContent = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { attemptDetails, attemptReview, detailsLoading, error } = useSelector(state => state.studentAttempt);

    useEffect(() => {
        dispatch(fetchAttemptDetails(id));
    }, [dispatch, id]);

    if (detailsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                <p className="text-ink-500 font-medium">Loading your results...</p>
            </div>
        );
    }

    if (error || !attemptDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                <p className="text-rose-500 font-medium mb-2">Failed to load results</p>
                <p className="text-sm text-ink-500 mb-6">{error || "Results not found"}</p>
                <Link to="/student/quizzes" className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors">
                    Back to Quizzes
                </Link>
            </div>
        );
    }

    const isPassed = attemptDetails.status === 'PASSED';
    
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-6 flex justify-between items-center">
                <Link to="/student/quizzes" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Quizzes
                </Link>
                <span className="text-xs font-mono text-ink-400">
                    Attempt ID: {attemptDetails.id}
                </span>
            </div>

            {/* HERO SECTION */}
            <div className={`relative overflow-hidden rounded-2xl p-8 md:p-12 mb-8 border backdrop-blur-md shadow-glass-lg ${
                isPassed 
                ? 'bg-sage-50/80 border-sage-200/60' 
                : 'bg-rose-50/80 border-rose-200/60'
            }`}>
                
                {/* Decorative blob */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none ${
                    isPassed ? 'bg-sage-300' : 'bg-rose-300'
                }`}></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                    
                    {/* Status Icon & Percentage */}
                    <div className="flex flex-col items-center shrink-0">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-inner ${
                            isPassed ? 'bg-sage-100 text-sage-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                            {isPassed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                        </div>
                        <h2 className={`font-display font-bold text-5xl tracking-tight ${
                            isPassed ? 'text-sage-700' : 'text-rose-700'
                        }`}>
                            {attemptDetails.percentage}%
                        </h2>
                        <p className={`font-mono font-medium text-sm mt-1 tracking-wider uppercase ${
                            isPassed ? 'text-sage-600' : 'text-rose-600'
                        }`}>
                            {isPassed ? 'Passed' : 'Failed'}
                        </p>
                    </div>

                    {/* Quiz Info & Stats */}
                    <div className="flex-1">
                        <h1 className="font-display font-semibold text-3xl text-ink-900 mb-2">
                            {attemptDetails.quiz?.title}
                        </h1>
                        <p className="font-body text-ink-600 mb-6">
                            You needed {attemptDetails.quiz?.passingScore}% to pass this quiz.
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm flex flex-col items-center text-center">
                                <span className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Score</span>
                                <span className="font-body font-bold text-xl text-ink-900">{attemptDetails.score}</span>
                            </div>
                            <div className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm flex flex-col items-center text-center">
                                <span className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Correct</span>
                                <span className="font-body font-bold text-xl text-sage-600">{attemptDetails.correctAnswers}</span>
                            </div>
                            <div className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm flex flex-col items-center text-center">
                                <span className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Incorrect</span>
                                <span className="font-body font-bold text-xl text-rose-600">{attemptDetails.incorrectAnswers}</span>
                            </div>
                            <div className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm flex flex-col items-center text-center">
                                <span className="text-xs font-mono text-ink-500 uppercase tracking-wider mb-1">Time</span>
                                <span className="font-body font-bold text-xl text-ink-900">{formatTime(attemptDetails.timeTaken)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAILED REVIEW */}
            <div>
                <h3 className="font-display font-semibold text-2xl text-ink-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-ink-400" />
                    Detailed Review
                </h3>

                <div className="space-y-6">
                    {attemptReview.map((item, index) => {
                        const isUnanswered = item.selectedOptionId === null;
                        
                        return (
                            <div key={item.questionId} className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl shadow-glass-md border border-white/50 p-6 md:p-8">
                                
                                {/* Question Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-mono font-bold text-sm text-white ${
                                        item.isCorrect ? 'bg-sage-500' : isUnanswered ? 'bg-warm-400' : 'bg-rose-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-display font-medium text-xl text-ink-900 leading-snug">
                                                {item.questionText}
                                            </h4>
                                            <span className="font-mono text-xs font-bold bg-warm-100 text-ink-500 px-2.5 py-1 rounded-full shrink-0">
                                                {item.marks} pt{item.marks !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="pl-12 space-y-3 mb-6">
                                    {item.options.map((option) => {
                                        const isSelected = item.selectedOptionId === option.id;
                                        const isActualCorrect = option.id === item.correctOptionId;
                                        
                                        let optionClasses = "border-warm-200/50 bg-white text-ink-700";
                                        let icon = null;

                                        if (isSelected && isActualCorrect) {
                                            optionClasses = "border-sage-400 bg-sage-50 text-sage-900 font-medium";
                                            icon = <CheckCircle2 className="w-5 h-5 text-sage-500 shrink-0" />;
                                        } else if (isSelected && !isActualCorrect) {
                                            optionClasses = "border-rose-400 bg-rose-50 text-rose-900 font-medium";
                                            icon = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
                                        } else if (!isSelected && isActualCorrect) {
                                            optionClasses = "border-sage-300 bg-sage-50/50 text-sage-800 border-dashed";
                                            icon = <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0" />;
                                        }

                                        return (
                                            <div key={option.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${optionClasses}`}>
                                                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                                    {icon ? icon : <div className="w-2 h-2 rounded-full bg-warm-300"></div>}
                                                </div>
                                                <span className="font-body text-base flex-1">{option.optionText}</span>
                                                {isSelected && (
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400 bg-white/80 px-2 py-0.5 rounded border border-ink-100 shrink-0">
                                                        Your Answer
                                                    </span>
                                                )}
                                                {isActualCorrect && !isSelected && (
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-sage-600 bg-sage-100/80 px-2 py-0.5 rounded border border-sage-200 shrink-0">
                                                        Correct Answer
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {item.explanation && (
                                    <div className="pl-12">
                                        <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 text-sm font-body text-ink-700 flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="block text-ink-900 font-semibold mb-1">Explanation</strong>
                                                <p>{item.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
        </div>
    );
};

export default QuizResultsContent;
