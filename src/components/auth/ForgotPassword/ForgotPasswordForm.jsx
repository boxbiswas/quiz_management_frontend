import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [success, setSuccess] = useState(false);

    const onSubmit = (data) => {
        dispatch(forgotPassword(data)).unwrap().then(() => {
            setSuccess(true);
        }).catch((err) => {
            console.error(err);
        });
    };

    if (success) {
        return (
            <div className="space-y-6">
                <p className="font-body text-sm text-ink-700 leading-relaxed">
                    If an account exists, we have sent password reset instructions to your email.
                </p>
                <div className="flex items-center text-sm pt-2 border-t border-warm-200/50">
                    <Link to="/login" className="text-amber-500 hover:text-amber-600 font-medium transition-colors">Back to Log In</Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-ink-500 block">Email</label>
                <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full bg-amber-50/60 rounded-xl px-4 py-3.5 font-body text-sm text-ink-900 placeholder:text-ink-500 outline-none ring-1 ring-black/[0.03] focus:ring-2 focus:ring-amber-500/40 focus:bg-white transition-all duration-150"
                    placeholder="you@example.com"
                />
                {errors.email && <span className="text-rose-500 text-xs mt-1 block font-body">{errors.email.message}</span>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-body font-medium text-sm py-3.5 rounded-full shadow-none hover:shadow-raised-hover transition-all duration-150 mt-2 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
            </button>

            <div className="flex items-center justify-center text-sm pt-1">
                <Link to="/login" className="text-ink-500 hover:text-ink-700 transition-colors">Back to Log In</Link>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
