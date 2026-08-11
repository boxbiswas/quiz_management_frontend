import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCategories, deleteAdminCategory } from '../../../redux/slices/adminCategoriesSlice';
import { Link } from 'react-router-dom';
import { Search, Loader2, Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { toast } from 'react-toastify';

const CategoryListContent = () => {
    const dispatch = useDispatch();
    const { categories, loading, error, actionLoading } = useSelector((state) => state.adminCategories);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category? Any associated quizzes will also be affected.')) {
            dispatch(deleteAdminCategory(id))
                .unwrap()
                .then(() => toast.success('Category deleted successfully'))
                .catch((err) => toast.error(err));
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">Categories</h1>
                    <p className="font-body text-ink-700">Manage curriculum topics and structure.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-ink-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/70 backdrop-blur-sm rounded-full pl-10 pr-4 py-2.5 font-body text-sm text-ink-900 placeholder:text-ink-500 border border-warm-200/50 shadow-glass-sm outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                        />
                    </div>
                    <Link 
                        to="/admin/categories/new"
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-body font-medium text-sm px-6 py-2.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        New Category
                    </Link>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md border-0 overflow-hidden">
                {loading && categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                        <p className="text-ink-500 font-medium">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-12 h-12 text-rose-500 mb-4 opacity-50 mx-auto flex items-center justify-center"><FolderTree className="w-8 h-8"/></div>
                        <p className="text-rose-500 font-medium mb-2">Failed to load categories</p>
                        <p className="text-sm text-ink-500">{error}</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                            <FolderTree className="w-6 h-6 text-ink-500" />
                        </div>
                        <h3 className="font-display font-medium text-xl text-ink-900 mb-1">No categories found</h3>
                        <p className="text-ink-500 text-sm mb-6">Create your first category to structure your quizzes.</p>
                        <Link 
                            to="/admin/categories/new"
                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 font-body font-medium text-sm px-6 py-2.5 rounded-full transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Category
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-warm-200/40 bg-warm-50/50">
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Category Name</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Description</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-200/30">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-body font-medium text-ink-900 flex items-center gap-2">
                                                <FolderTree className="w-4 h-4 text-amber-500" />
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-body text-sm text-ink-600 max-w-md truncate">
                                                {category.description || 'No description provided.'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    to={`/admin/categories/${category.id}/edit`}
                                                    className="p-2 text-ink-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                                    title="Edit Category"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(category.id)}
                                                    disabled={actionLoading}
                                                    className="p-2 text-ink-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors disabled:opacity-50"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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

export default CategoryListContent;
