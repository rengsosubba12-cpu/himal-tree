import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, cafeInfo } from '../../data/content';

const MagazineNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex flex-col justify-center items-center w-10 h-10 cursor-pointer"
        style={{ cursor: 'pointer' }}
      >
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 7 : 0,
          }}
          whileHover={{ y: isOpen ? 7 : -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="block w-[28px] h-[1px] bg-[#1A1A1A] mb-[6px]"
        />
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 20 : 0
          }}
          transition={{ duration: 0.2 }}
          className="block w-[28px] h-[1px] bg-[#1A1A1A] mb-[6px]"
        />
        <motion.span
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -7 : 0,
          }}
          whileHover={{ y: isOpen ? -7 : 2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="block w-[28px] h-[1px] bg-[#1A1A1A]"
        />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            role="navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            className="fixed inset-0 z-40 bg-[#F9F8F6] flex flex-col justify-between pt-24 md:pt-32 pb-12 px-6 md:px-16 overflow-y-auto overflow-x-hidden max-w-[100vw]"
          >
            <div className="flex flex-col w-full max-w-7xl mx-auto">
              {navItems?.map((item, index) => (
                <motion.a
                  key={item.id || index}
                  href={item.href || '#'}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: 0.1 * (index + 1), type: 'spring', stiffness: 100, damping: 20 }}
                  whileHover={{ x: 20, color: '#8B2626' }}
                  className="group block border-b border-[rgba(26,26,26,0.15)] py-5 md:py-8 text-[#1A1A1A] no-underline"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-[clamp(2.2rem,10vw,4.5rem)] md:text-[8vw] leading-tight mb-1 transition-colors duration-300">
                      {item.label}
                    </span>
                    <span className="font-sans text-base tracking-[0.4em] uppercase opacity-40">
                      {item.labelKr}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 font-sans text-xs tracking-[0.3em] uppercase opacity-50"
            >
              <div className="flex flex-col gap-2">
                <span>{cafeInfo?.address || 'Cafe Address Placeholder'}</span>
                <span>{cafeInfo?.phone || '+00 0000 0000'}</span>
              </div>
              <div className="flex flex-col gap-2 md:text-right">
                <a href={cafeInfo?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A] transition-colors">Instagram</a>
                <a href={cafeInfo?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-[#1A1A1A] transition-colors">Facebook</a>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default MagazineNav;
