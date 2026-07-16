import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate reset request API
    setTimeout(() => {
      setLoading(false);
      setSuccess('Reset link dispatched to your email! (Redirecting to reset screen...)');
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);
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
            Recover Password
          </h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider mt-1.5 leading-relaxed">
            Provide your campus email below. We'll forward instructions to configure a new credential set.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="name@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <p className="text-[10px] font-semibold text-rose-500 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-[10px] font-semibold text-emerald-555 text-emerald-400 text-center animate-pulse">
              {success}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3 border-0 mt-2 text-xs font-bold"
          >
            Send Recovery Details
          </Button>
        </form>

        <p className="text-center text-xs text-slate-405 text-slate-400 mt-6 font-medium">
          Remember credentials?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
