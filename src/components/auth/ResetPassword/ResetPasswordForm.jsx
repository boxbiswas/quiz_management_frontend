import React from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const ResetPasswordForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const onSubmit = (data) => {
        dispatch(resetPassword(data)).unwrap().then(() => {
            navigate('/login');
        }).catch((err) => {
            console.error(err);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-ink-500 block">Reset Token</label>
                <input
                    type="text"
                    {...register('resetToken', { required: 'Token is required' })}
                    className="w-full bg-amber-50/60 rounded-xl px-4 py-3.5 font-body text-sm text-ink-900 placeholder:text-ink-500 outline-none ring-1 ring-black/[0.03] focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all duration-150"
                    placeholder="Paste your reset token here"
                />
                {errors.resetToken && <span className="text-rose-500 text-xs mt-1 block font-body">{errors.resetToken.message}</span>}
            </div>

            <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-ink-500 block">New Password</label>
                <input
                    type="password"
                    {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    className="w-full bg-amber-50/60 rounded-xl px-4 py-3.5 font-body text-sm text-ink-900 placeholder:text-ink-500 outline-none ring-1 ring-black/[0.03] focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all duration-150"
                    placeholder="••••••••"
                />
                {errors.newPassword && <span className="text-rose-500 text-xs mt-1 block font-body">{errors.newPassword.message}</span>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-medium text-sm py-3.5 rounded-full shadow-none hover:shadow-raised-hover transition-all duration-150 mt-2 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
            </button>

            <div className="flex items-center justify-center text-sm pt-1">
                <Link to="/login" className="text-ink-500 hover:text-ink-700 transition-colors">Back to Log In</Link>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
