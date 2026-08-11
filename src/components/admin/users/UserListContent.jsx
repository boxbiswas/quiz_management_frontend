import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, updateAdminUserStatus, deleteAdminUser } from '../../../redux/slices/adminUsersSlice';
import { Link } from 'react-router-dom';
import { Search, Loader2, MoreVertical, ShieldAlert, CheckCircle, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';


const UserListContent = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.adminUsers);
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
        dispatch(fetchAdminUsers(debouncedTerm));
    }, [dispatch, debouncedTerm]);

    const handleToggleStatus = (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        dispatch(updateAdminUserStatus({ userId: user.id, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`User marked as ${newStatus.toLowerCase()}`))
            .catch((err) => toast.error(err));
        setActionMenuOpen(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            dispatch(deleteAdminUser(id))
                .unwrap()
                .then(() => toast.success('User deleted successfully'))
                .catch((err) => toast.error(err));
        }
        setActionMenuOpen(null);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink-900 tracking-tight mb-2">Students</h1>
                    <p className="font-body text-ink-700">Manage all registered students on the platform.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-ink-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/70 backdrop-blur-sm rounded-full pl-10 pr-4 py-2.5 font-body text-sm text-ink-900 placeholder:text-ink-500 border border-warm-200/50 shadow-glass-sm outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-glass backdrop-saturate-150 rounded-xl2 shadow-glass-md border-0 overflow-hidden">
                {loading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                        <p className="text-ink-500 font-medium">Loading students...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                        <p className="text-rose-500 font-medium mb-2">Failed to load users</p>
                        <p className="text-sm text-ink-500">{error}</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-ink-500" />
                        </div>
                        <h3 className="font-display font-medium text-xl text-ink-900 mb-1">No students found</h3>
                        <p className="text-ink-500 text-sm">Try adjusting your search term.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-warm-200/40 bg-warm-50/50">
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Joined</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-wider text-ink-500 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-200/30">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-body font-medium text-ink-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-body text-sm text-ink-700">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-body text-sm text-ink-500">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                                user.status === 'ACTIVE' 
                                                    ? 'bg-sage-500/10 text-sage-600 border-sage-500/20' 
                                                    : 'bg-ink-100 text-ink-600 border-ink-200'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button 
                                                onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                                                className="p-1.5 text-ink-500 hover:text-ink-900 rounded-full hover:bg-warm-100 transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {actionMenuOpen === user.id && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActionMenuOpen(null)}></div>
                                                    <div className="absolute right-6 top-10 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-glass-lg border border-warm-200/50 z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                        <Link 
                                                            to={`/admin/users/${user.id}`}
                                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-warm-50 hover:text-amber-600 transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Profile
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleToggleStatus(user)}
                                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-warm-50 hover:text-amber-600 transition-colors"
                                                        >
                                                            {user.status === 'ACTIVE' ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                            Mark {user.status === 'ACTIVE' ? 'Inactive' : 'Active'}
                                                        </button>
                                                        <div className="h-px bg-warm-200/50 my-1"></div>
                                                        <button 
                                                            onClick={() => handleDelete(user.id)}
                                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete User
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

export default UserListContent;
