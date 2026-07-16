import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaLock, FaEnvelope } from 'react-icons/fa';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // student, faculty, admin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password, role);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    // Autofill credentials for easier evaluation/testing
    if (selectedRole === 'admin') {
      setEmail('admin@campus.edu');
      setPassword('admin123');
    } else if (selectedRole === 'faculty') {
      setEmail('faculty@campus.edu');
      setPassword('faculty123');
    } else {
      setEmail('student@campus.edu');
      setPassword('student123');
    }
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md border border-slate-800/80 text-slate-100"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/30 mb-3">
            V
          </div>
          <h2 className="font-display text-xl font-bold bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
            Vanguard Portal
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
            Campus Management System
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { id: 'student', label: 'Student', icon: <FaUserGraduate /> },
            { id: 'faculty', label: 'Faculty', icon: <FaChalkboardTeacher /> },
            { id: 'admin', label: 'Admin', icon: <FaUserShield /> }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRoleSelect(r.id)}
              className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all duration-200 ${
                role === r.id
                  ? 'border-indigo-500 bg-indigo-600/10 text-indigo-400 font-semibold shadow-xs'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-lg mb-1.5">{r.icon}</span>
              <span className="text-[10px]">{r.label}</span>
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="name@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="dark:bg-slate-950"
          />

          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="dark:bg-slate-950"
          />

          {error && (
            <p className="text-[10px] font-semibold text-rose-500 text-center">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded-sm border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="hover:text-indigo-400 font-medium">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3 border-0 mt-2 text-xs font-bold shadow-md shadow-indigo-650/20"
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          New to portal?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register Account
          </Link>
        </p>

        {/* Demo Guide Info */}
        <div className="mt-6 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 p-3 text-[10px] text-indigo-300">
          <p className="font-semibold mb-1 text-indigo-200">💡 Testing tip:</p>
          <p>Selecting a role autofills demo credentials. Just click "Sign In to Dashboard" to log in!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
