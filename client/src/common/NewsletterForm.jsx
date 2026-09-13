import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 relative">
      <input 
        type="email" 
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-surface-50 border border-surface-200 text-xs text-surface-900 placeholder:text-surface-800/50 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-500 flex-1 shadow-sm transition-all"
      />
      <button 
        type="submit"
        className={`font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center ${
          subscribed 
            ? 'bg-tealAccent-500 text-white shadow-tealAccent-500/20' 
            : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
        }`}
      >
        {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}