import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchStudentQuizDetails } from '../../../redux/slices/studentQuizzesSlice';
import { startQuizAttempt } from '../../../redux/slices/studentAttemptSlice';
import { ArrowLeft, Loader2, Play, BookOpen, Clock, Target, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const QuizDetailsContent = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentQuiz, loading: quizLoading, error: quizError } = useSelector((state) => state.studentQuizzes);
    const { loading: attemptLoading } = useSelector((state) => state.studentAttempt);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        dispatch(fetchStudentQuizDetails(id));
    }, [dispatch, id]);

    const handleStartClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmStart = async () => {
        setShowConfirmModal(false);
        try {
            await dispatch(startQuizAttempt(id)).unwrap();
            navigate(`/student/quizzes/${id}/take`);
        } catch (err) {
            toast.error(err || "Unable to start quiz.");
        }
    };

    if (quizLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                <p className="text-ink-500 font-medium">Loading quiz details...</p>
            </div>
        );
    }

    if (quizError || !currentQuiz) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                <p className="text-rose-500 font-medium mb-2">Failed to load quiz details</p>
                <p className="text-sm text-ink-500 mb-6">{quizError || "Quiz not found"}</p>
                <Link to="/student/quizzes" className="bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors">
                    Back to Quizzes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/student/quizzes" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Quizzes
                </Link>
            </div>

            <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-lg p-8 md:p-12 border border-white/50 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className={`inline-flex items-center text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                            currentQuiz.difficulty === 'EASY' ? 'bg-sage-50 text-sage-600 border-sage-200' : 
                            currentQuiz.difficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                            'bg-rose-50 text-rose-600 border-rose-200'
                        }`}>
                            {currentQuiz.difficulty}
                        </span>
                        {currentQuiz.category && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-100 text-ink-600 text-xs font-body font-medium">
                                <BookOpen className="w-3.5 h-3.5" />
                                {currentQuiz.category.name}
                            </span>
                        )}
                    </div>

                    <h1 className="font-display font-semibold text-4xl md:text-5xl text-ink-900 tracking-tight mb-4 leading-tight">
                        {currentQuiz.title}
                    </h1>
                    
                    <p className="font-body text-lg text-ink-600 mb-10 max-w-2xl leading-relaxed">
                        {currentQuiz.description || "No description provided."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <div className="bg-white/50 border border-warm-200/50 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-ink-500 uppercase tracking-wider">Duration</p>
                                <p className="font-body font-semibold text-ink-900 text-lg">{currentQuiz.duration} mins</p>
                            </div>
                        </div>
                        
                        <div className="bg-white/50 border border-warm-200/50 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center shrink-0">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-ink-500 uppercase tracking-wider">Passing Score</p>
                                <p className="font-body font-semibold text-ink-900 text-lg">{currentQuiz.passingScore}%</p>
                            </div>
                        </div>

                        <div className="bg-white/50 border border-warm-200/50 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-mono text-ink-500 uppercase tracking-wider">Max Attempts</p>
                                <p className="font-body font-semibold text-ink-900 text-lg">{currentQuiz.maxAttempts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center border-t border-warm-200/50 pt-10">
                        <button
                            onClick={handleStartClick}
                            disabled={attemptLoading}
                            className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-semibold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {attemptLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                            Start Attempt
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-amber-50 p-6 flex flex-col items-center border-b border-amber-100">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-500">
                                <Play className="w-8 h-8 ml-1" />
                            </div>
                            <h3 className="text-xl font-display font-semibold text-ink-900">Ready to begin?</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-ink-600 text-center font-body mb-8">
                                Once you start, the timer will begin immediately and cannot be paused. Make sure you have a stable connection.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-warm-200 text-ink-600 font-medium hover:bg-warm-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmStart}
                                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md transition-colors"
                                >
                                    Start Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizDetailsContent;
