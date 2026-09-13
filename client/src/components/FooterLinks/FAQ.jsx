import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, ChevronDown, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I create an account on ShopNex?",
      answer: "Click on the 'Sign Up' or profile icon on the top right corner of the homepage, enter your email and password details and follow the simple on-screen instructions to set up your profile."
    },
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our catalog, select the items you wish to purchase, add them to your shopping cart and proceed to checkout where you can enter your shipping details and confirm your Cash on Delivery (COD) order."
    },
    {
      question: "What is your return and refund policy?",
      answer: "We offer a 30-day hassle-free return guarantee on all eligible products. Items must be in their original condition and packaging."
    },
    {
      question: "How long does shipping typically take?",
      answer: "Standard express delivery usually takes between 3 to 5 business days depending on your delivery region and current logistics volume."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept only the cash on delivery (COD) now and later in future we will receive all major credit cards (Visa, MasterCard, American Express), digital wallets and secure online payment gateways protected by 256-bit SSL encryption."
    },
    {
      question: "Can I modify or cancel my order after placing it?",
      answer: "You can modify or cancel your order within 2 hours of placement by heading over to your order details page or contacting our support team directly before fulfillment begins."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach out to our team anytime via our Customer Help Desk page or by emailing support@shopnex.com."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we primarily ship nationwide, but we are actively working on expanding our delivery footprint to support international shipping very soon."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden bg-[#F8FAFC]">
      
      {/* Background Gradients with Smooth Pulsing Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#F1F6FA] to-[#E6F0F7] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-10 p-6 sm:p-10 animate-fade-in">
        
        {/* Back navigation with smooth hover translation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header Section with Fade-in and Up Animation */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mt-2 animate-slide-down">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-100 text-sky-700 text-xs font-bold tracking-wider uppercase shadow-sm transition-transform hover:scale-105 duration-300">
            <Radio className="w-3.5 h-3.5 animate-pulse text-sky-500" /> Help Center Active
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">Questions.</span>
          </h1>
          
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            Quick answers regarding shopping, shipping, accounts and policies.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 ${
                  isOpen 
                    ? 'border-sky-200 shadow-md ring-4 ring-sky-50/50 scale-[1.01]' 
                    : 'border-slate-200/80 hover:border-sky-200 hover:bg-white'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-800 hover:text-sky-600 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-500 transform group-hover:scale-110 ${
                      isOpen ? 'bg-sky-500 text-white shadow-md shadow-sky-200 rotate-3' : 'bg-sky-50 text-sky-600 border border-sky-100'
                    }`}>
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </span>
                    <span className="transition-colors duration-300 group-hover:text-sky-600">
                      {faq.question}
                    </span>
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isOpen ? 'bg-sky-50 text-sky-600 rotate-180 scale-110' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'
                  }`}>
                    <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-300" />
                  </div>
                </button>
                
                {/* Expandable Content with smooth grid-row and opacity transition */}
                <div 
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 -translate-y-2'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 pl-[68px] text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4 bg-gradient-to-b from-sky-50/20 to-transparent transition-opacity duration-300">
                      {faq.answer}
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}