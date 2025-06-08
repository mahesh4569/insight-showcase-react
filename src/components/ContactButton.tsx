
import React, { useState } from 'react';
import { Mail, MessageCircle, X } from 'lucide-react';

const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Opportunity for Data Analyst Role');
    const body = encodeURIComponent(`Hi Mahesh,

I came across your data portfolio and was impressed by your projects and skills.

We are currently looking for a Data Analyst to join our team at [Company Name]. Your experience with Excel, Power BI, Python, and dashboard development aligns well with what we're seeking.

If you're interested, I'd love to schedule a call to discuss the role and next steps.

Best regards,
[Recruiter's Name]
[Designation]
[Company Name]`);
    
    window.open(`mailto:maheshvadla06@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi Mahesh, I just saw your data portfolio – really impressive work! We're currently hiring for a Data Analyst role at [Company Name]. Let me know if you're open to a quick chat.

– [Recruiter's Name], [Designation]`);
    
    window.open(`https://wa.me/919014644400?text=${message}`, '_blank');
  };

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
            <button
              onClick={handleEmailClick}
              className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300 w-full"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Send Email</span>
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300 w-full"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactButton;
