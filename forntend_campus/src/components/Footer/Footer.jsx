import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto py-6 px-8 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-400">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div>
          © {currentYear} Vanguard Technical Institute. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">IT Support Helpdesk</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
