import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';
import Button from '../components/Buttons/Button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 mb-6 shadow-sm">
        <FaExclamationCircle className="h-8 w-8" />
      </div>
      
      <h1 className="font-display font-black text-4xl mb-3 tracking-tight">
        404 - Page Not Found
      </h1>
      
      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed font-semibold">
        The requested URL was not found on this server. It might have been relocated, or the link has expired.
      </p>

      <Link to="/login">
        <Button variant="primary" className="py-2.5 px-6 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600">
          Back to Portal Login
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
