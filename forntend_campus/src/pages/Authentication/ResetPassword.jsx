import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate reset confirm API
    setTimeout(() => {
      setLoading(false);
      setSuccess('Passwords updated successfully! Routing to sign in...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md border border-slate-800/80 text-slate-100"
      >
        <div className="text-center mb-6">
          <h2 className="font-display text-xl font-bold bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider mt-1.5 leading-relaxed">
            Enter a strong password. Credentials must match.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="New Password"
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <InputField
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-[10px] font-semibold text-rose-500 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-[10px] font-semibold text-emerald-455 text-emerald-400 text-center animate-pulse">
              {success}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3 border-0 mt-2 text-xs font-bold"
          >
            Update Credentials
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Abort action?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Cancel and Return
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
