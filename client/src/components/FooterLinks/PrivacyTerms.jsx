import React from 'react';
import { ShieldCheck, ArrowLeft, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyTerms() {
  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden bg-[#F8FAFC] text-slate-900">
      
      {/* Background Gradients Matching the Theme with Smooth Pulsing Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#F1F6FA] to-[#E6F0F7] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-10 p-6 sm:p-10">
        
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
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-500" /> Legal Guidelines
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Privacy & <span className="text-blue-600">Terms of Service.</span>
          </h1>
          
          <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
            Legal guidelines regarding platform usage, user safety and data security.
          </p>
        </div>

        {/* Content Box with Fade-In Animation */}
        <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 p-6 sm:p-8 rounded-2xl space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed shadow-sm transition-all duration-500 hover:shadow-xl animate-fade-in">
          
          <section className="space-y-2 pb-4 border-b border-slate-100 transition-all duration-300 hover:translate-x-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100 transition-transform duration-300 hover:scale-110">1</span>
              Information We Collect
            </h2>
            <p className="pl-8 text-slate-600">
              We collect information you provide directly to us when creating an account, making a purchase or contacting support. This includes your name, email address, shipping details and encrypted payment artifacts.
            </p>
          </section>

          <section className="space-y-2 pb-4 border-b border-slate-100 transition-all duration-300 hover:translate-x-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100 transition-transform duration-300 hover:scale-110">2</span>
              Use of Data
            </h2>
            <p className="pl-8 text-slate-600">
              Your data is strictly utilized to fulfill orders, process secure transactions via 256-bit SSL encryption, improve shopping experiences and send crucial operational updates.
            </p>
          </section>

          <section className="space-y-2 pb-4 border-b border-slate-100 transition-all duration-300 hover:translate-x-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100 transition-transform duration-300 hover:scale-110">3</span>
              Security Standards
            </h2>
            <p className="pl-8 text-slate-600">
              We maintain stringent security measures, standard administrative protocols and regular system audits to safeguard your personal identity and store account credentials.
            </p>
          </section>

          <section className="space-y-2 pb-4 border-b border-slate-100 transition-all duration-300 hover:translate-x-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100 transition-transform duration-300 hover:scale-110">4</span>
              User Accounts & Responsibilities
            </h2>
            <p className="pl-8 text-slate-600">
              You are responsible for maintaining the confidentiality of your account credentials and password. ShopNex is not liable for any unauthorized access resulting from failure to protect your login details.
            </p>
          </section>

          <section className="space-y-2 pb-4 border-b border-slate-100 transition-all duration-300 hover:translate-x-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100 transition-transform duration-300 hover:scale-110">5</span>
              Orders, Pricing & Payments
            </h2>
            <p className="pl-8 text-slate-600">
              All product pricing and availability are subject to change without notice. We currently accommodate Cash on Delivery (COD) services, and orders can be modified or canceled within the designated 2-hour window post-placement.
            </p>
          </section>

          <section className="space-y-2 transition-all duration-300 hover:translate-x-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100 transition-transform duration-300 hover:scale-110">6</span>
              Changes to Terms
            </h2>
            <p className="pl-8 text-slate-600">
              We reserve the right to modify these terms and privacy guidelines at any given time. Continued use of the platform after updates indicates your explicit acceptance of the revised policies.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}