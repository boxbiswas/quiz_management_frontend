import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchAdminQuestions, deleteAdminQuestion } from '../../../redux/slices/adminQuestionsSlice';
import { fetchAdminQuizById } from '../../../redux/slices/adminQuizzesSlice';
import { Loader2, Plus, Edit, Trash2, ArrowLeft, HelpCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const QuestionsListContent = () => {
    const { quizId } = useParams();
    const dispatch = useDispatch();
    
    const { questions, loading, error, actionLoading } = useSelector((state) => state.adminQuestions);
    const { currentQuiz, loading: quizLoading } = useSelector((state) => state.adminQuizzes);

    useEffect(() => {
        dispatch(fetchAdminQuizById(quizId));
        dispatch(fetchAdminQuestions(quizId));
    }, [dispatch, quizId]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
            dispatch(deleteAdminQuestion(id))
                .unwrap()
                .then(() => toast.success('Question deleted successfully'))
                .catch((err) => toast.error(err));
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

    return (
        <div>
            <div className="mb-6">
                <Link to="/admin/quizzes" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Quizzes
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">
                        Questions: {currentQuiz?.title || 'Unknown Quiz'}
                    </h1>
                    <p className="font-body text-ink-700">Manage questions, options, and correct answers for this quiz.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <Link 
                        to={`/admin/quizzes/${quizId}/questions/new`}
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-body font-medium text-sm px-6 py-2.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Add Question
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {loading && questions.length === 0 ? (
                    <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md p-12 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                        <p className="text-ink-500 font-medium">Loading questions...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                            <HelpCircle className="w-6 h-6 text-ink-500" />
                        </div>
                        <h3 className="font-display font-medium text-xl text-ink-900 mb-1">No questions yet</h3>
                        <p className="text-ink-500 text-sm mb-6">Start building your quiz by adding the first question.</p>
                        <Link 
                            to={`/admin/quizzes/${quizId}/questions/new`}
                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 font-body font-medium text-sm px-6 py-2.5 rounded-full transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Question
                        </Link>
                    </div>
                ) : (
                    questions.map((question, index) => (
                        <div key={question.id} className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md border border-white/50 p-6 flex flex-col lg:flex-row gap-6 transition-all hover:shadow-glass-lg">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-body font-medium text-lg text-ink-900 leading-snug">{question.questionText}</h3>
                                        <div className="flex items-center gap-3 mt-2 text-xs font-mono uppercase tracking-widest">
                                            <span className="text-ink-500">{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}</span>
                                            <span className="w-1 h-1 rounded-full bg-warm-200"></span>
                                            <span className={`${question.difficulty === 'HARD' ? 'text-rose-500' : question.difficulty === 'MEDIUM' ? 'text-amber-500' : 'text-sage-500'}`}>
                                                {question.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pl-12 space-y-2">
                                    {question.options?.map((option) => (
                                        <div 
                                            key={option.id} 
                                            className={`p-3 rounded-lg border text-sm flex items-start gap-3 ${
                                                option.isCorrect 
                                                ? 'bg-sage-50 border-sage-200 text-sage-900' 
                                                : 'bg-warm-50 border-warm-100 text-ink-600'
                                            }`}
                                        >
                                            {option.isCorrect ? (
                                                <CheckCircle className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-warm-300 shrink-0 mt-0.5" />
                                            )}
                                            <span className={option.isCorrect ? 'font-medium' : ''}>{option.optionText}</span>
                                        </div>
                                    ))}
                                </div>

                                {question.explanation && (
                                    <div className="pl-12 mt-4 text-sm text-ink-500 italic border-l-2 border-warm-200 ml-12 px-4 py-2">
                                        <span className="font-medium text-ink-600 mr-2 not-italic">Explanation:</span>
                                        {question.explanation}
                                    </div>
                                )}
                            </div>

                            <div className="flex lg:flex-col items-center lg:items-end justify-start gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-warm-200/50">
                                <Link 
                                    to={`/admin/quizzes/${quizId}/questions/${question.id}/edit`}
                                    className="px-4 py-2 w-full lg:w-auto text-center rounded-lg text-sm font-medium text-ink-600 hover:bg-warm-100 hover:text-amber-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDelete(question.id)}
                                    disabled={actionLoading}
                                    className="px-4 py-2 w-full lg:w-auto text-center rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuestionsListContent;
