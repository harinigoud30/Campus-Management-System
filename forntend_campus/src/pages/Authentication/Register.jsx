import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // student, faculty, admin
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(name, email, password, role);
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/30 mb-3">
            V
          </div>
          <h2 className="font-display text-xl font-bold bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
            Vanguard Portal Access
          </p>
        </div>

        {/* Role Picker */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { id: 'student', label: 'Student', icon: <FaUserGraduate /> },
            { id: 'faculty', label: 'Faculty', icon: <FaChalkboardTeacher /> },
            { id: 'admin', label: 'Admin', icon: <FaUserShield /> }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`flex flex-col items-center justify-center rounded-xl p-2.5 border transition-all duration-200 ${
                role === r.id
                  ? 'border-indigo-500 bg-indigo-600/10 text-indigo-400 font-semibold shadow-xs'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-base mb-1">{r.icon}</span>
              <span className="text-[9px]">{r.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <InputField
            label="Campus Email Address"
            id="email"
            type="email"
            placeholder="name@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputField
            label="Confirm Password"
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
            <p className="text-[10px] font-semibold text-emerald-500 text-center animate-pulse">
              {success}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl py-3 border-0 mt-2 text-xs font-bold"
          >
            Register Account
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
