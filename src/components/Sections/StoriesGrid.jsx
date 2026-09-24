import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { storyItems } from '../../data/content';

const StoryItem = ({ item, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const isEven = index % 2 === 0;
  const parallaxY = useTransform(scrollYProgress, [0, 1], isEven ? [-30, 30] : [-60, 60]);

  let spanClass = '';
  let heightClass = '';
  
  if (item.aspect === 'portrait') {
    spanClass = 'row-span-2';
    heightClass = 'min-h-[400px]';
  } else if (item.aspect === 'landscape') {
    spanClass = 'md:col-span-2';
    heightClass = 'min-h-[250px]';
  } else {
    spanClass = '';
    heightClass = 'min-h-[300px]';
  }

  return (
    <motion.div
      ref={ref}
      style={{ y: parallaxY, background: item.placeholder || 'linear-gradient(to bottom, #eaeaea, #d1d1d1)' }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-none flex items-end p-6 ${spanClass} ${heightClass}`}
    >
      <div className="relative z-10 text-white w-full">
        <h3 className="font-display text-2xl drop-shadow-md mb-1">{item.title}</h3>
        <p className="font-script italic text-base opacity-80 drop-shadow-md mb-1">{item.titleKr}</p>
        <p className="font-sans text-xs tracking-wider opacity-90 drop-shadow-md uppercase">{item.subtitle}</p>
      </div>
    </motion.div>
  );
};

export default function StoriesGrid() {
  return (
    <section id="stories" className="bg-[#F9F8F6] py-32 px-6 md:px-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="font-sans text-xs tracking-[0.4em] uppercase opacity-50 block mb-4">우리의 이야기 &middot; OUR STORIES</span>
          <h2 className="font-display text-[10vw] md:text-[6vw] leading-none mb-8 text-[#1A1A1A]">Stories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {(storyItems || []).map((item, index) => (
            <StoryItem key={item.id || index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
