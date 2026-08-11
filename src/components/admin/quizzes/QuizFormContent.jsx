import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchAdminQuizById, createAdminQuiz, updateAdminQuiz, clearCurrentQuiz } from '../../../redux/slices/adminQuizzesSlice';
import { fetchAdminCategories } from '../../../redux/slices/adminCategoriesSlice';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const QuizFormContent = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentQuiz, loading, actionLoading } = useSelector((state) => state.adminQuizzes);
    const { categories, loading: categoriesLoading } = useSelector((state) => state.adminCategories);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        difficulty: 'EASY',
        duration: 30,
        passingScore: 50,
        maxAttempts: 1,
        status: 'DRAFT'
    });

    useEffect(() => {
        dispatch(fetchAdminCategories());
        
        if (isEditMode) {
            dispatch(fetchAdminQuizById(id));
        }

        return () => {
            if (isEditMode) dispatch(clearCurrentQuiz());
        };
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentQuiz) {
            setFormData({
                title: currentQuiz.title || '',
                description: currentQuiz.description || '',
                categoryId: currentQuiz.categoryId || '',
                difficulty: currentQuiz.difficulty || 'EASY',
                duration: currentQuiz.duration || 30,
                passingScore: currentQuiz.passingScore || 50,
                maxAttempts: currentQuiz.maxAttempts || 1,
                status: currentQuiz.status || 'DRAFT'
            });
        }
    }, [currentQuiz, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.categoryId || !formData.duration || !formData.passingScore) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload = {
            ...formData,
            categoryId: parseInt(formData.categoryId),
            duration: parseInt(formData.duration),
            passingScore: parseFloat(formData.passingScore),
            maxAttempts: parseInt(formData.maxAttempts)
        };

        try {
            if (isEditMode) {
                await dispatch(updateAdminQuiz({ id, quizData: payload })).unwrap();
                toast.success("Quiz updated successfully!");
            } else {
                await dispatch(createAdminQuiz(payload)).unwrap();
                toast.success("Quiz created successfully!");
            }
            navigate('/admin/quizzes');
        } catch (error) {
            toast.error(error || "An error occurred while saving the quiz.");
        }
    };

    if (isEditMode && loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                <p className="text-ink-500 font-medium">Loading quiz details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/quizzes" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Quizzes
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">
                    {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
                </h1>
                <p className="font-body text-ink-700">
                    {isEditMode ? 'Update the settings for this quiz.' : 'Configure the settings for a new quiz.'}
                </p>
            </div>

            <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-lg p-8 border border-white/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title (Full width) */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Quiz Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Introduction to JavaScript"
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                            />
                        </div>

                        {/* Description (Full width) */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Briefly describe what this quiz is about..."
                                rows="3"
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Category *</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                            >
                                <option value="" disabled>Select a category</option>
                                {categoriesLoading ? (
                                    <option disabled>Loading categories...</option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Difficulty *</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Duration (Minutes) *</label>
                            <input
                                type="number"
                                name="duration"
                                min="1"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                            />
                        </div>

                        {/* Passing Score */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Passing Score (%) *</label>
                            <input
                                type="number"
                                name="passingScore"
                                min="1"
                                max="100"
                                value={formData.passingScore}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                            />
                        </div>

                        {/* Max Attempts */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Max Attempts *</label>
                            <input
                                type="number"
                                name="maxAttempts"
                                min="1"
                                value={formData.maxAttempts}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                            />
                        </div>
                        
                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-ink-900">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all appearance-none"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="UNPUBLISHED">Unpublished</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-warm-200/50 flex items-center justify-end gap-4">
                        <Link 
                            to="/admin/quizzes"
                            className="px-6 py-3 text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-medium text-sm px-8 py-3 rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEditMode ? 'Save Changes' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizFormContent;
