import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { setAnswer, submitQuizAttempt, hydrateAnswers, clearAttemptState } from '../../../redux/slices/studentAttemptSlice';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const TakeQuizContent = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { activeAttempt, questions, expiryTime, answers, submitLoading } = useSelector(state => state.studentAttempt);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Initial Load & LocalStorage Hydration
    useEffect(() => {
        if (!activeAttempt || activeAttempt.quizId !== parseInt(id)) {
            // They shouldn't be here without starting the quiz first
            navigate(`/student/quizzes/${id}`);
            return;
        }

        // Try to load saved answers from localStorage (protects against refresh)
        const savedData = localStorage.getItem(`quiz_answers_${id}`);
        if (savedData) {
            try {
                const parsedAnswers = JSON.parse(savedData);
                dispatch(hydrateAnswers(parsedAnswers));
            } catch (e) {
                console.error("Failed to parse saved answers", e);
            }
        }

        // Load saved question index
        const savedIndex = localStorage.getItem(`quiz_index_${id}`);
        if (savedIndex !== null) {
            setCurrentQuestionIndex(parseInt(savedIndex, 10));
        }
    }, [activeAttempt, id, navigate, dispatch]);

    // 2. Save to LocalStorage whenever answers or index change
    useEffect(() => {
        if (answers.length > 0) {
            localStorage.setItem(`quiz_answers_${id}`, JSON.stringify(answers));
        }
    }, [answers, id]);

    useEffect(() => {
        localStorage.setItem(`quiz_index_${id}`, currentQuestionIndex.toString());
    }, [currentQuestionIndex, id]);

    // 3. Timer Logic
    const calculateTimeLeft = useCallback(() => {
        if (!expiryTime) return null;
        const now = new Date().getTime();
        const expiry = new Date(expiryTime).getTime();
        const difference = expiry - now;
        
        return difference > 0 ? Math.floor(difference / 1000) : 0;
    }, [expiryTime]);

    useEffect(() => {
        if (!expiryTime) return;

        // Initialize immediately
        setTimeLeft(calculateTimeLeft());

        const timerInterval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timerInterval);
                handleAutoSubmit();
            }
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [expiryTime, calculateTimeLeft]);

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        if (seconds === null) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // 4. Handlers
    const handleOptionSelect = (questionId, optionId) => {
        dispatch(setAnswer({ questionId, selectedOptionId: optionId }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleManualSubmit = () => {
        if (window.confirm("Are you sure you want to submit your quiz? You cannot change your answers after this.")) {
            executeSubmit();
        }
    };

    const handleAutoSubmit = () => {
        toast.info("Time is up! Auto-submitting your quiz...", { autoClose: false });
        executeSubmit();
    };

    const executeSubmit = async () => {
        if (isSubmitting) return; // Prevent double submit
        setIsSubmitting(true);
        try {
            const payload = await dispatch(submitQuizAttempt({ quizId: id, answers })).unwrap();
            dispatch(clearAttemptState());
            localStorage.removeItem(`quiz_index_${id}`); // Clean up the saved index
            toast.success("Quiz submitted successfully!");
            navigate(`/student/attempts/${payload.result.id}/results`);
        } catch (error) {
            toast.error(error || "Failed to submit quiz.");
            setIsSubmitting(false);
        }
    };

    if (!activeAttempt || questions.length === 0) {
        return null; // The useEffect will redirect
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = (qId) => answers.some(a => a.questionId === qId);

    // Determine timer color
    const isTimeLow = timeLeft !== null && timeLeft < 60; // Less than 1 minute

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6 relative">
            
            {/* Blocking Overlay during submit */}
            {(isSubmitting || submitLoading) && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border border-warm-200">
                    <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
                    <h2 className="font-display font-semibold text-2xl text-ink-900">Submitting Quiz...</h2>
                    <p className="text-ink-600 mt-2">Please wait, do not close the page.</p>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-lg border border-white/50 overflow-hidden relative">
                
                {/* Header: Progress & Timer */}
                <div className="px-6 py-4 border-b border-warm-200/50 flex items-center justify-between bg-white/40">
                    <div className="font-mono text-sm text-ink-500 font-medium">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono font-bold text-lg transition-colors ${
                        isTimeLow 
                        ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' 
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8 flex items-start gap-4">
                            <span className="w-8 h-8 shrink-0 rounded-full bg-warm-100 text-ink-500 flex items-center justify-center font-mono font-bold text-sm mt-1">
                                {currentQuestionIndex + 1}
                            </span>
                            <h2 className="font-display font-medium text-2xl md:text-3xl text-ink-900 leading-snug">
                                {currentQuestion.questionText}
                            </h2>
                        </div>
                        
                        <div className="pl-12 space-y-4">
                            {currentQuestion.options.map((option) => {
                                const isSelected = answers.find(a => a.questionId === currentQuestion.id)?.selectedOptionId === option.id;
                                
                                return (
                                    <label 
                                        key={option.id}
                                        className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                            isSelected 
                                            ? 'border-amber-400 bg-amber-50/50 shadow-sm' 
                                            : 'border-warm-200/50 bg-white hover:border-amber-300 hover:bg-amber-50/30'
                                        }`}
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value={option.id}
                                                checked={isSelected}
                                                onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                                                className="peer sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                                                isSelected ? 'border-amber-500' : 'border-warm-300 peer-hover:border-amber-400'
                                            }`}></div>
                                            {isSelected && (
                                                <div className="absolute w-2.5 h-2.5 bg-amber-500 rounded-full scale-in-center"></div>
                                            )}
                                        </div>
                                        <span className={`font-body text-lg ${isSelected ? 'text-ink-900 font-medium' : 'text-ink-700'}`}>
                                            {option.optionText}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer: Navigation Controls */}
                <div className="px-6 py-4 border-t border-warm-200/50 bg-white/40 flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2.5 rounded-full border border-warm-200 font-body font-medium text-ink-600 hover:bg-warm-50 hover:text-ink-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-body font-medium px-8 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-[0.98]"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-sage-600 font-medium font-body bg-sage-50 px-4 py-2 rounded-full border border-sage-200">
                            <CheckCircle2 className="w-4 h-4" />
                            End of Quiz
                        </div>
                    )}
                </div>
            </div>

            {/* SIDEBAR: Navigator & Submit */}
            <div className="w-full md:w-80 flex flex-col gap-6">
                
                {/* Navigator Grid */}
                <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-md border border-white/50 p-6 flex-1 flex flex-col">
                    <h3 className="font-display font-semibold text-lg text-ink-900 mb-4">Navigator</h3>
                    
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {questions.map((q, idx) => {
                            const answered = isAnswered(q.id);
                            const isCurrent = idx === currentQuestionIndex;
                            
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-medium transition-all
                                        ${isCurrent ? 'ring-2 ring-offset-2 ring-ink-900 shadow-md' : ''}
                                        ${answered 
                                            ? 'bg-amber-500 text-white border-transparent hover:bg-amber-600' 
                                            : 'bg-warm-100 text-ink-500 border border-warm-200 hover:bg-warm-200 hover:text-ink-900'
                                        }
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-auto space-y-2 text-sm font-body">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-ink-600">Answered ({answers.length})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-warm-200 border border-warm-300"></div>
                            <span className="text-ink-600">Unanswered ({questions.length - answers.length})</span>
                        </div>
                    </div>
                </div>

                {/* Submit Panel */}
                <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-2xl shadow-glass-md border border-white/50 p-6">
                    <button
                        onClick={handleManualSubmit}
                        disabled={isSubmitting || submitLoading}
                        className="w-full bg-ink-900 hover:bg-ink-800 text-white font-body font-semibold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        Submit Quiz
                    </button>
                    
                    {answers.length < questions.length && (
                        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-700 text-xs leading-relaxed">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>You have <strong>{questions.length - answers.length} unanswered</strong> questions. Are you sure you want to submit?</p>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default TakeQuizContent;
