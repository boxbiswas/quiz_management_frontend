import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createAdminCategory, updateAdminCategory } from '../../../redux/slices/adminCategoriesSlice';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const CategoryFormContent = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categories, actionLoading } = useSelector((state) => state.adminCategories);
    
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (isEditMode && categories.length > 0) {
            const category = categories.find(c => c.id === parseInt(id));
            if (category) {
                setFormData({
                    name: category.name || '',
                    description: category.description || ''
                });
            } else {
                toast.error("Category not found");
                navigate('/admin/categories');
            }
        }
    }, [isEditMode, id, categories, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            toast.error("Category name is required");
            return;
        }

        try {
            if (isEditMode) {
                await dispatch(updateAdminCategory({ id, categoryData: formData })).unwrap();
                toast.success("Category updated successfully!");
            } else {
                await dispatch(createAdminCategory(formData)).unwrap();
                toast.success("Category created successfully!");
            }
            navigate('/admin/categories');
        } catch (error) {
            toast.error(error || "An error occurred while saving the category.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/categories" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Categories
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">
                    {isEditMode ? 'Edit Category' : 'Create New Category'}
                </h1>
                <p className="font-body text-ink-700">
                    {isEditMode ? 'Update the details for this category.' : 'Add a new topic for your quizzes.'}
                </p>
            </div>

            <div className="bg-white/70 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-lg p-8 border border-white/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Name */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-ink-900">Category Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Development"
                            className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-ink-900">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe what topics this category covers..."
                            rows="4"
                            className="w-full bg-white/50 border border-warm-200/50 rounded-xl px-4 py-3 font-body text-ink-900 shadow-glass-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-6 border-t border-warm-200/50 flex items-center justify-end gap-4">
                        <Link 
                            to="/admin/categories"
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
                            {isEditMode ? 'Save Changes' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormContent;
