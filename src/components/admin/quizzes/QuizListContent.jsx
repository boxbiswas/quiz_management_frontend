import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminQuizzes, updateAdminQuizStatus, deleteAdminQuiz } from '../../../redux/slices/adminQuizzesSlice';
import { Link } from 'react-router-dom';
import { Search, Loader2, MoreVertical, Plus, Edit, Trash2, Eye, Globe, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const QuizListContent = () => {
    const dispatch = useDispatch();
    const { quizzes, loading, error } = useSelector((state) => state.adminQuizzes);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        dispatch(fetchAdminQuizzes(debouncedTerm));
    }, [dispatch, debouncedTerm]);

    const handleToggleStatus = (quiz) => {
        // Toggle between PUBLISHED and UNPUBLISHED if currently published, else PUBLISH
        const newStatus = quiz.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
        dispatch(updateAdminQuizStatus({ id: quiz.id, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`Quiz ${newStatus.toLowerCase()} successfully`))
            .catch((err) => toast.error(err));
        setActionMenuOpen(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
            dispatch(deleteAdminQuiz(id))
                .unwrap()
                .then(() => toast.success('Quiz deleted successfully'))
                .catch((err) => toast.error(err));
        }
        setActionMenuOpen(null);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-sage-500/10 text-sage-600 border-sage-500/20';
            case 'UNPUBLISHED':
                return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default:
                return 'bg-ink-100 text-ink-600 border-ink-200'; // DRAFT
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">Quizzes</h1>
                    <p className="font-body text-ink-700">Manage all quizzes and their publication status.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-ink-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/70 backdrop-blur-sm rounded-full pl-10 pr-4 py-2.5 font-body text-sm text-ink-900 placeholder:text-ink-500 border border-warm-200/50 shadow-glass-sm outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                        />
                    </div>
                    <Link 
                        to="/admin/quizzes/new"
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-body font-medium text-sm px-6 py-2.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quiz
                    </Link>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md border-0 overflow-hidden">
                {loading && quizzes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                        <p className="text-ink-500 font-medium">Loading quizzes...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-12 h-12 text-rose-500 mb-4 opacity-50 mx-auto flex items-center justify-center"><Search className="w-8 h-8"/></div>
                        <p className="text-rose-500 font-medium mb-2">Failed to load quizzes</p>
                        <p className="text-sm text-ink-500">{error}</p>
                    </div>
                ) : quizzes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-ink-500" />
                        </div>
                        <h3 className="font-display font-medium text-xl text-ink-900 mb-1">No quizzes found</h3>
                        <p className="text-ink-500 text-sm mb-6">Create your first quiz to get started.</p>
                        <Link 
                            to="/admin/quizzes/new"
                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 font-body font-medium text-sm px-6 py-2.5 rounded-full transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Quiz
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-warm-200/40 bg-warm-50/50">
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Difficulty</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-200/30">
                                {quizzes.map((quiz) => (
                                    <tr key={quiz.id} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-body font-medium text-ink-900">{quiz.title}</div>
                                            <div className="font-body text-xs text-ink-500 mt-1 flex items-center gap-3">
                                                <span>{quiz.duration} mins</span>
                                                <span className="w-1 h-1 rounded-full bg-warm-200"></span>
                                                <span>Pass: {quiz.passingScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-body text-sm text-ink-700">{quiz.category?.name || 'Uncategorized'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-body text-sm text-ink-600 capitalize">{quiz.difficulty.toLowerCase()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusStyles(quiz.status)}`}>
                                                {quiz.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button 
                                                onClick={() => setActionMenuOpen(actionMenuOpen === quiz.id ? null : quiz.id)}
                                                className="p-1.5 text-ink-500 hover:text-ink-900 rounded-full hover:bg-warm-100 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {actionMenuOpen === quiz.id && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActionMenuOpen(null)}></div>
                                                    <div className="absolute right-6 top-10 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-glass-lg border border-warm-200/50 z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                        <Link 
                                                            to={`/admin/quizzes/${quiz.id}/edit`}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-warm-50 hover:text-amber-600 transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit Quiz
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleToggleStatus(quiz)}
                                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-warm-50 hover:text-amber-600 transition-colors"
                                                        >
                                                            {quiz.status === 'PUBLISHED' ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                                            {quiz.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                                                        </button>
                                                        <div className="h-px bg-warm-200/50 my-1"></div>
                                                        <button 
                                                            onClick={() => handleDelete(quiz.id)}
                                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete Quiz
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizListContent;
