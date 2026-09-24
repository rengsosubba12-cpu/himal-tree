import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, ExternalLink, Send, X } from 'lucide-react';
import { cafeInfo } from '../../data/content';

export default function BookingForm({
  phoneNumber = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_PHONE) || '+919883597341'
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const initialFormData = {
    name: '',
    email: '',
    date: '',
    time: '',
    partySize: '',
    specialRequests: '',
    requests: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    url: '',
    type: 'success'
  });

  // Auto-dismiss toast notification after 5 seconds
  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'specialRequests' ? { requests: value } : {}),
      ...(name === 'requests' ? { specialRequests: value } : {})
    }));

    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Please select a reservation date';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Please select a reservation time';
    }

    if (!formData.partySize.trim()) {
      newErrors.partySize = 'Please select party size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Clean party size to extract number/count (e.g., '4 Guests' -> '4')
    const partyClean = formData.partySize.replace(/\s*guests?/i, '').trim() || formData.partySize.trim();
    const specialRequests = (formData.specialRequests || formData.requests || '').trim() || 'None';

    const message = [
      '🍜 *NEW TABLE RESERVATION - HIMAL TREE*',
      '',
      `*Name:* ${formData.name.trim()}`,
      `*Email:* ${formData.email.trim()}`,
      `*Date:* ${formData.date.trim()}`,
      `*Time:* ${formData.time.trim()}`,
      `*Party Size:* ${partyClean} Guests`,
      `*Special Requests:* ${specialRequests}`
    ].join('\n');

    const targetPhone = phoneNumber || '+919883597341';
    let cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Call window.open to redirect
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to open WhatsApp window:', err);
    }

    // Clear / reset form state
    setFormData(initialFormData);
    setErrors({});

    // Show temporary success toast notification
    setToast({
      show: true,
      message: 'Redirecting to WhatsApp...',
      url: whatsappUrl,
      type: 'success'
    });
  };

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Your Name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'time', label: 'Time', type: 'select', options: [
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
      '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
    ]},
    { name: 'partySize', label: 'Party Size', type: 'select', options: [
      '1 Guest', '2 Guests', '3 Guests', '4 Guests', '5 Guests', '6 Guests', '7 Guests', '8+ Guests'
    ]},
    { name: 'specialRequests', label: 'Special Requests', type: 'textarea', placeholder: 'Any special requests?' }
  ];

  const fieldVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <section id="book" className="relative bg-[#F9F8F6] text-[#1A1A1A] py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <span className="font-sans text-xs tracking-[0.4em] uppercase opacity-50 block mb-4">예약 &middot; RESERVATION</span>
          <h2 className="font-display text-[clamp(2.5rem,8vw,4rem)] md:text-[5vw] leading-none text-[#1A1A1A]">Book a Table</h2>
          <p className="font-script italic text-2xl opacity-50 mt-4 text-[#1A1A1A]">테이블 예약</p>
          
          <div className="mt-12 space-y-6">
            <div className="border-t border-[rgba(26,26,26,0.15)] pt-6">
              <p className="font-body text-sm opacity-60 leading-relaxed">{cafeInfo?.address || 'Address not available'}</p>
            </div>
            <div className="border-t border-[rgba(26,26,26,0.15)] pt-6">
              <p className="font-body text-sm opacity-60 leading-relaxed">{cafeInfo?.hours || 'Hours not available'}</p>
            </div>
            <div className="border-t border-[rgba(26,26,26,0.15)] pt-6">
              <p className="font-body text-sm opacity-60 leading-relaxed">{cafeInfo?.phone || '+91 98835 97341'}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div ref={ref}>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
            {formFields.map((field, index) => (
              <motion.div 
                key={field.name}
                variants={fieldVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 }}
                className={`border-b py-4 transition-colors duration-300 ${
                  errors[field.name] 
                    ? 'border-[#8B2626]' 
                    : 'border-[rgba(26,26,26,0.15)] focus-within:border-[#8B2626]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor={field.name} className="font-sans text-[10px] tracking-[0.4em] uppercase opacity-40">
                    {field.label} {field.name !== 'specialRequests' && <span className="text-[#8B2626]">*</span>}
                  </label>
                  {errors[field.name] && (
                    <span className="font-sans text-[11px] text-[#8B2626] flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors[field.name]}
                    </span>
                  )}
                </div>
                
                {field.type === 'select' ? (
                  <select 
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none outline-none font-body text-base text-[#1A1A1A] cursor-pointer"
                  >
                    <option value="" disabled hidden>Select {field.label}</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt} className="bg-[#F9F8F6] text-[#1A1A1A]">
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full bg-transparent border-none outline-none font-body text-base text-[#1A1A1A] placeholder:opacity-30 resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    min={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                    className="w-full bg-transparent border-none outline-none font-body text-base text-[#1A1A1A] placeholder:opacity-30"
                  />
                )}
              </motion.div>
            ))}

            <motion.button
              variants={fieldVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: formFields.length * 0.1 }}
              type="submit"
              className="mt-8 md:mt-12 w-full sm:w-fit justify-center font-display text-lg tracking-wider border border-[#1A1A1A] py-4 px-8 sm:px-12 text-[#1A1A1A] flex items-center gap-4 cursor-pointer group"
              whileHover={{ 
                backgroundColor: '#1A1A1A', 
                color: '#F9F8F6',
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              RESERVE &middot; 예약하기
              <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </form>
        </div>
        
      </div>

      {/* Floating Success Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 sm:bottom-8 right-4 sm:right-6 md:right-12 z-50 max-w-sm w-[calc(100vw-2rem)] bg-[#1A1A1A] text-[#F9F8F6] p-4 sm:p-5 shadow-2xl border border-[rgba(249,248,246,0.15)] flex items-start gap-4"
            role="alert"
            aria-live="polite"
          >
            <div className="w-8 h-8 rounded-full bg-[#4A5D4E] flex items-center justify-center shrink-0 text-[#F9F8F6] mt-0.5">
              <Check size={16} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-sm tracking-wide font-medium text-[#F9F8F6]">
                  {toast.message}
                </p>
                <button
                  type="button"
                  onClick={() => setToast(prev => ({ ...prev, show: false }))}
                  className="text-[#F9F8F6]/40 hover:text-[#F9F8F6] transition-colors p-1 -mr-1 cursor-pointer"
                  aria-label="Close notification"
                >
                  <X size={15} />
                </button>
              </div>
              <p className="font-body text-xs text-[#F9F8F6]/70 mt-1 leading-relaxed">
                Opening WhatsApp with your reservation details.
              </p>
              {toast.url && (
                <a
                  href={toast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-wider text-[#D4B896] hover:text-[#F9F8F6] transition-colors mt-2.5 font-medium"
                >
                  Click here if it didn't open automatically
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
