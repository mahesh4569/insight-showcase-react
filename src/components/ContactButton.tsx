
import React, { useState } from 'react';
import { Mail, MessageCircle, X } from 'lucide-react';

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>

      {/* Contact Options */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-[200px] animate-scale-in">
          <h3 className="text-white font-semibold mb-3 text-center">Get in Touch</h3>
          <div className="space-y-2">
            <a
              href="mailto:your.email@example.com"
              className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Send Email</span>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactButton;
