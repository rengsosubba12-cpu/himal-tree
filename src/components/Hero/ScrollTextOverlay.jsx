import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { heroQuotes } from '../../data/content';

function QuoteItem({ quote, scrollProgress }) {
  // Map scroll progress from quote range to opacity and translateY
  const inputRange = [
    quote.range[0],
    quote.range[0] + 0.03,
    quote.range[1] - 0.03,
    quote.range[1],
  ];

  const opacity = useTransform(scrollProgress, inputRange, [0, 1, 1, 0]);
  const y = useTransform(scrollProgress, inputRange, [80, 0, 0, -80]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 text-center pointer-events-none select-none"
    >
      <div className="editorial-scroll-container max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <h2
          className="editorial-scroll-title font-seasons font-bold tracking-tight text-center inline-block"
          style={{
            fontFamily: "'The Seasons', 'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: 'clamp(1.75rem, 5vw, 6rem)',
            lineHeight: 1.15,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5C2CE 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0px 3px 10px rgba(30, 15, 18, 0.6))',
            textShadow: 'none',
            textAlign: 'center',
          }}
        >
          {quote.main}
        </h2>

        {quote.sub && (
          <p
            className="editorial-scroll-sub mt-4 font-script text-[clamp(1.15rem,2.2vw,1.85rem)] italic tracking-widest text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#F7D6DE',
              filter: 'drop-shadow(0px 2px 6px rgba(30, 15, 18, 0.5))',
              textShadow: 'none',
              textAlign: 'center',
            }}
          >
            {quote.sub}
          </p>
        )}

        {quote.subKr && (
          <p
            className="editorial-scroll-sub mt-4 font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-center"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              color: '#F7D6DE',
              filter: 'drop-shadow(0px 2px 6px rgba(30, 15, 18, 0.5))',
              textShadow: 'none',
              textAlign: 'center',
            }}
          >
            {quote.subKr}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function ScrollTextOverlay({ scrollProgress }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex items-center justify-center max-w-[100vw]">
      {heroQuotes.map((quote, index) => (
        <QuoteItem key={index} quote={quote} scrollProgress={scrollProgress} />
      ))}
    </div>
  );
}
