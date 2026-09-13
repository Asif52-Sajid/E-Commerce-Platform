import React from 'react';
import { Mail, Phone, PackageSearch, ArrowLeft, CheckCircle2, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerHelpDesk() {
  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden bg-[#F8FAFC] text-slate-900">
      
      {/* Background Gradients Matching the Theme with Smooth Pulsing Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#F1F6FA] to-[#E6F0F7] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-10 p-6 sm:p-10">
        
        {/* Back navigation with smooth translation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase shadow-sm transition-transform hover:scale-105 duration-300">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-500" /> 24/7 Assistance
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            We are here <span className="text-blue-600">to help you.</span>
          </h1>
          
          <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
            Reach out with any questions, order updates or technical support issues and we'll respond promptly.
          </p>
        </div>

        {/* Content Section (Cards layout with staggered entrance animations and smooth interactive hover effects) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Email Support */}
          <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in relative flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Mail className="w-6 h-6 transition-transform duration-300 group-hover:animate-bounce" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                  Response in 24h
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1 transition-colors duration-300 group-hover:text-blue-600">Email Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drop us a line anytime at support@shopnex.com and our team will jump on it.
              </p>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Active everyday
              </div>
            </div>
          </div>

          {/* Card 2: Direct Line */}
          <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in relative flex flex-col justify-between group" style={{ animationDelay: '100ms' }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Phone className="w-6 h-6 transition-transform duration-300 group-hover:animate-bounce" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                  Mon-Fri, 9-6 EST
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1 transition-colors duration-300 group-hover:text-blue-600">Direct Line</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call our helpline at +88 01823874569 to speak directly with an agent.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Instant voice connection
              </div>
            </div>
          </div>

          {/* Card 3: Order Tracking */}
          <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in relative flex flex-col justify-between group" style={{ animationDelay: '200ms' }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <PackageSearch className="w-6 h-6 transition-transform duration-300 group-hover:animate-bounce" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                  Self Service
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1 transition-colors duration-300 group-hover:text-blue-600">Order Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check your shipment status, track delivery progress and look up past order history instantly.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Real-time updates
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}