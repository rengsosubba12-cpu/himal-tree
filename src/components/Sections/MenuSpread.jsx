import { useRef } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { editorialMenuItems } from '../../data/content';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─────────────────────────────────────────────────────────────────────────────
// ParallaxMedia — the image or video inside a card, with scroll-driven y-shift
// ─────────────────────────────────────────────────────────────────────────────
function ParallaxMedia({ src, videoSrc, alt, strength = 15, objectPosition = 'center' }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ['0%', '0%'] : [`${strength}%`, `-${strength}%`]
  );
  const y = useSpring(rawY, { stiffness: 60, damping: 25, restDelta: 0.001 });

  const isVideo = !!videoSrc;

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      <motion.div
        className="absolute inset-[-20%] will-change-transform"
        style={{ y }}
      >
        {isVideo ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
            style={{ objectPosition }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
            style={{ objectPosition }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CinematicReveal — wraps children in a clip-path wipe + scale settle
// ─────────────────────────────────────────────────────────────────────────────
function CinematicReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.08 }}
      animate={
        isInView
          ? { clipPath: 'inset(0% 0 0 0)', scale: 1 }
          : { clipPath: 'inset(100% 0 0 0)', scale: 1.08 }
      }
      transition={{
        clipPath: { duration: 1.15, ease: [0.22, 1, 0.36, 1], delay },
        scale:    { duration: 1.3,  ease: [0.22, 1, 0.36, 1], delay: delay + 0.05 },
      }}
      style={{ willChange: 'transform, clip-path' }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TextReveal — staggered fade-up for text blocks
// ─────────────────────────────────────────────────────────────────────────────
function TextReveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-6% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DishMeta — the text block shown beside / over each dish
// ─────────────────────────────────────────────────────────────────────────────
function DishMeta({ item, dark = false, delay = 0, align = 'left' }) {
  const textColor   = dark ? 'text-[#F9F8F6]' : 'text-[#1A1A1A]';
  const mutedColor  = dark ? 'opacity-60' : 'opacity-40';
  const descColor   = dark ? 'text-[#e8e0d8]' : 'text-[#2A2118]';
  const priceColor  = dark ? 'text-[#F5C2CE]' : 'text-[#8B2626]';
  const alignClass  = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <TextReveal delay={delay} className={`flex flex-col gap-3 ${alignClass}`}>
      <span className={`font-sans text-[9px] tracking-[0.45em] uppercase ${mutedColor} ${textColor}`}>
        {item.category}
      </span>
      <div>
        <h3
          className={`font-display leading-[0.95] ${textColor}`}
          style={{ fontSize: 'clamp(2.4rem, 4.5vw, 5.2rem)' }}
        >
          {item.name}
        </h3>
        <p
          className={`font-script italic ${mutedColor} ${textColor} mt-1`}
          style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.3rem)' }}
        >
          {item.nameKr}
        </p>
      </div>
      <p
        className={`font-sans ${descColor} leading-relaxed max-w-[38ch]`}
        style={{ fontSize: 'clamp(0.7rem, 0.9vw, 0.82rem)', letterSpacing: '0.06em' }}
      >
        {item.description}
      </p>
      <div className={`flex items-baseline gap-3 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'} mt-2`}>
        <span className={`font-display ${priceColor}`} style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.4rem)' }}>
          ₹{item.priceINR}
        </span>
        <span className={`font-sans text-[10px] tracking-widest ${mutedColor} ${textColor}`}>
          · ₩{item.priceKRW?.toLocaleString()}
        </span>
      </div>
      <div
        className={`h-px w-12 bg-current ${mutedColor} ${textColor} ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''} mt-1`}
      />
    </TextReveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MenuSectionHeader — staggered character reveal
// ─────────────────────────────────────────────────────────────────────────────
function MenuSectionHeader() {
  const ref    = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  const title  = 'Our Menu';
  const chars  = title.split('');

  return (
    <div ref={ref} className="mb-14 md:mb-32 overflow-hidden">
      <motion.span
        className="font-sans text-[10px] tracking-[0.5em] uppercase opacity-40 block mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        메뉴 &middot; MENU
      </motion.span>

      {/* Big title — character-by-character clip wipe */}
      <h2
        className="font-display leading-[0.88] overflow-hidden block"
        style={{ fontSize: 'clamp(2.75rem, 11vw, 12rem)' }}
        aria-label={title}
      >
        {chars.map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ clipPath: 'inset(0 0 100% 0)', y: '0.12em' }}
            animate={
              isInView
                ? { clipPath: 'inset(0 0 0% 0)', y: 0 }
                : { clipPath: 'inset(0 0 100% 0)', y: '0.12em' }
            }
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.04,
            }}
            style={{ willChange: 'transform, clip-path' }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </h2>

      <motion.div
        className="h-px bg-[rgba(26,26,26,0.15)] mt-10"
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP GRID — 12-column asymmetric editorial magazine layout
// ─────────────────────────────────────────────────────────────────────────────
function DesktopEditorialGrid({ items }) {
  const [ramen, bibimbap, kimbap, tteok, corndog, cappuccino] = items;

  return (
    <div
      className="hidden lg:grid gap-x-6 gap-y-6"
      style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '80px' }}
    >
      {/* ── ROW 1-2: RAMEN — Hero, full width ── */}
      <div
        className="relative group"
        style={{ gridColumn: '1 / 13', gridRow: '1 / 9' }}
      >
        <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0}>
          <div className="w-full h-full" style={{ minHeight: '600px' }}>
            <ParallaxMedia
              src={ramen.imageSrc}
              alt={ramen.name}
              strength={12}
              objectPosition="center 30%"
            />
            {/* Dark gradient overlay bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.75)] via-[rgba(26,20,14,0.15)] to-transparent pointer-events-none" />
          </div>
        </CinematicReveal>

        {/* Text anchored bottom-right, overlapping image */}
        <div className="absolute bottom-10 right-10 z-10 max-w-[420px]">
          <DishMeta item={ramen} dark delay={0.4} align="right" />
        </div>

        {/* Number flourish top-left */}
        <TextReveal delay={0.6} className="absolute top-8 left-10 z-10">
          <span className="font-display text-[rgba(249,248,246,0.18)]" style={{ fontSize: '7rem', lineHeight: 1 }}>01</span>
        </TextReveal>
      </div>

      {/* ── ROW 9-16: BIBIMBAP — tall portrait left ── */}
      <div
        className="relative group"
        style={{ gridColumn: '1 / 6', gridRow: '10 / 19' }}
      >
        <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0.05}>
          <div className="w-full h-full" style={{ minHeight: '520px' }}>
            <ParallaxMedia
              src={bibimbap.imageSrc}
              alt={bibimbap.name}
              strength={14}
              objectPosition="center center"
            />
          </div>
        </CinematicReveal>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.7)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm pointer-events-none z-10" />
        <div className="absolute bottom-8 left-6 right-6 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
          <DishMeta item={bibimbap} dark delay={0} />
        </div>
        <TextReveal delay={0.1} className="absolute top-6 left-6 z-10">
          <span className="font-display text-[rgba(249,248,246,0.15)]" style={{ fontSize: '5rem', lineHeight: 1 }}>02</span>
        </TextReveal>
      </div>

      {/* BIBIMBAP text block right of image, slightly overlapping */}
      <div
        className="flex items-center pl-8 relative z-10"
        style={{ gridColumn: '6 / 10', gridRow: '10 / 15' }}
      >
        {/* Slight negative margin left to overlap image */}
        <div style={{ marginLeft: '-1.5rem' }}>
          <DishMeta item={bibimbap} delay={0.15} />
        </div>
      </div>

      {/* ── ROW 9-14: KIMBAP — landscape right ── */}
      <div
        className="relative group"
        style={{ gridColumn: '6 / 13', gridRow: '15 / 21' }}
      >
        <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0.12}>
          <div className="w-full h-full" style={{ minHeight: '380px' }}>
            <ParallaxMedia
              src={kimbap.imageSrc}
              alt={kimbap.name}
              strength={10}
              objectPosition="center 40%"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(249,248,246,0.0)] to-[rgba(26,20,14,0.55)] pointer-events-none" />
          </div>
        </CinematicReveal>
        <div className="absolute bottom-8 right-8 z-10 max-w-[340px]">
          <DishMeta item={kimbap} dark delay={0.3} align="right" />
        </div>
        <TextReveal delay={0.4} className="absolute top-6 right-8 z-10">
          <span className="font-display text-[rgba(249,248,246,0.15)]" style={{ fontSize: '5rem', lineHeight: 1 }}>03</span>
        </TextReveal>
      </div>

      {/* ── ROW 19-26: TTEOKBOKKI — detail crop left ── */}
      <div
        className="relative group"
        style={{ gridColumn: '1 / 5', gridRow: '20 / 27' }}
      >
        <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0.0}>
          <div className="w-full h-full" style={{ minHeight: '440px' }}>
            <ParallaxMedia
              src={tteok.imageSrc}
              alt={tteok.name}
              strength={16}
              objectPosition="center 40%"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.6)] to-transparent pointer-events-none" />
          </div>
        </CinematicReveal>
        <div className="absolute bottom-8 left-6 z-10">
          <DishMeta item={tteok} dark delay={0.2} />
        </div>
        <TextReveal delay={0.25} className="absolute top-6 left-6 z-10">
          <span className="font-display text-[rgba(249,248,246,0.15)]" style={{ fontSize: '5rem', lineHeight: 1 }}>04</span>
        </TextReveal>
      </div>

      {/* ── ROW 19-28: CORN DOG — tall portrait right ── */}
      <div
        className="relative group"
        style={{ gridColumn: '5 / 13', gridRow: '19 / 30' }}
      >
        <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0.1}>
          <div className="w-full h-full" style={{ minHeight: '600px' }}>
            <ParallaxMedia
              src={corndog.imageSrc}
              videoSrc={corndog.videoSrc}
              alt={corndog.name}
              strength={10}
              objectPosition="center center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[rgba(26,20,14,0.5)] pointer-events-none" />
          </div>
        </CinematicReveal>
        {/* Overlapping text block on left */}
        <div className="absolute top-1/2 -translate-y-1/2 left-8 z-10 max-w-[360px]">
          <DishMeta item={corndog} dark delay={0.25} />
        </div>
        <TextReveal delay={0.35} className="absolute top-6 right-8 z-10">
          <span className="font-display text-[rgba(249,248,246,0.15)]" style={{ fontSize: '5rem', lineHeight: 1 }}>05</span>
        </TextReveal>
      </div>

      {/* ── ROW 30-38: CAPPUCCINO — full-width cinematic video, offset inset ── */}
      {/* Decorative text block floated above (negative margin overlap) */}
      <div
        className="relative z-20 flex items-end pb-6 pl-12"
        style={{ gridColumn: '1 / 6', gridRow: '31 / 35' }}
      >
        <DishMeta item={cappuccino} delay={0.1} />
      </div>

      <div
        className="relative group"
        style={{ gridColumn: '3 / 13', gridRow: '32 / 41', marginTop: '-3rem' }}
      >
        <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0.08}>
          <div className="w-full h-full" style={{ minHeight: '520px' }}>
            <ParallaxMedia
              src={cappuccino.imageSrc}
              videoSrc={cappuccino.videoSrc}
              alt={cappuccino.name}
              strength={8}
              objectPosition="center 35%"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(249,248,246,0.65)] via-transparent to-transparent pointer-events-none" />
          </div>
        </CinematicReveal>
        <TextReveal delay={0.3} className="absolute bottom-8 right-8 z-10">
          <span className="font-display text-[rgba(249,248,246,0.15)]" style={{ fontSize: '5rem', lineHeight: 1 }}>06</span>
        </TextReveal>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLET GRID — 2-column staggered, retains parallax
// ─────────────────────────────────────────────────────────────────────────────
function TabletGrid({ items }) {
  const pairs = [
    [items[0], null],         // Ramen — full width hero
    [items[1], items[2]],     // Bibimbap | Kimbap
    [items[3], items[4]],     // Tteokbokki | Corn Dog
    [items[5], null],         // Cappuccino — full width
  ];

  return (
    <div className="hidden md:flex lg:hidden flex-col gap-6">
      {pairs.map(([left, right], pi) => {
        if (!right) {
          // Full-width hero row
          const item = left;
          return (
            <div key={item.id} className="relative group" style={{ minHeight: pi === 0 ? '70vh' : '50vh' }}>
              <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0}>
                <div className="relative w-full" style={{ height: pi === 0 ? '70vh' : '50vh' }}>
                  <ParallaxMedia
                    src={item.imageSrc}
                    videoSrc={item.videoSrc}
                    alt={item.name}
                    strength={10}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.7)] via-transparent to-transparent pointer-events-none" />
                </div>
              </CinematicReveal>
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <DishMeta item={item} dark delay={0.3} />
              </div>
            </div>
          );
        }

        return (
          <div key={`${left.id}-${right.id}`} className="grid grid-cols-2 gap-6">
            {/* Left — taller by offset */}
            <div className="relative group" style={{ minHeight: '480px' }}>
              <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0}>
                <div className="relative w-full h-full">
                  <ParallaxMedia src={left.imageSrc} alt={left.name} strength={12} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.65)] to-transparent pointer-events-none" />
                </div>
              </CinematicReveal>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <DishMeta item={left} dark delay={0.2} />
              </div>
            </div>
            {/* Right — shifted down for stagger */}
            <div className="relative group mt-12" style={{ minHeight: '480px' }}>
              <CinematicReveal className="relative w-full h-full rounded-sm overflow-hidden" delay={0.1}>
                <div className="relative w-full h-full">
                  <ParallaxMedia
                    src={right.imageSrc}
                    videoSrc={right.videoSrc}
                    alt={right.name}
                    strength={12}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.65)] to-transparent pointer-events-none" />
                </div>
              </CinematicReveal>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <DishMeta item={right} dark delay={0.25} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE STACK — single-column vertical editorial stack (<768px)
// ─────────────────────────────────────────────────────────────────────────────
function MobileStack({ items }) {
  return (
    <div className="grid grid-cols-1 gap-14 sm:gap-20 md:hidden">
      {items.map((item, i) => (
        <div key={item.id} className="flex flex-col gap-4">
          {/* Label + number row */}
          <div className="flex items-center justify-between">
            <span className="font-sans text-[9px] tracking-[0.45em] uppercase opacity-40 font-semibold">
              {item.category}
            </span>
            <span
              className="font-display text-[rgba(26,26,26,0.1)]"
              style={{ fontSize: '3rem', lineHeight: 1 }}
            >
              0{i + 1}
            </span>
          </div>

          {/* Image — full width single-column editorial container */}
          <div
            className="relative overflow-hidden rounded-sm w-full aspect-[4/5] shadow-md border border-[#2A2118]/10"
          >
            <CinematicReveal className="absolute inset-0" delay={0}>
              <div className="absolute inset-0">
                <ParallaxMedia
                  src={item.imageSrc}
                  videoSrc={item.videoSrc}
                  alt={item.name}
                  strength={0}
                />
              </div>
            </CinematicReveal>
          </div>

          {/* Text block */}
          <div className="px-1 sm:px-2 pt-2">
            <TextReveal delay={0.1}>
              <h3
                className="font-display text-[#1A1A1A] leading-[0.95] mb-1 text-[clamp(1.75rem,5vw,3rem)]"
              >
                {item.name}
              </h3>
              <p className="font-script italic text-[#1A1A1A] opacity-40 mb-3 text-base sm:text-lg">
                {item.nameKr}
              </p>
              <p
                className="font-sans text-[#2A2118] leading-relaxed mb-4 text-[0.8rem] sm:text-[0.85rem] tracking-[0.03em]"
              >
                {item.description}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[#8B2626] text-2xl sm:text-3xl">
                  ₹{item.priceINR}
                </span>
                <span className="font-sans text-[10px] tracking-widest opacity-40">
                  · ₩{item.priceKRW?.toLocaleString()}
                </span>
              </div>
              <div className="h-px w-10 bg-[rgba(26,26,26,0.2)] mt-3" />
            </TextReveal>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function MenuSpread() {
  const items = editorialMenuItems;

  return (
    <section
      id="menu"
      className="relative bg-[#F9F8F6] text-[#1A1A1A] py-12 md:py-36 px-4 sm:px-8 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* Subtle grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] -z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1600px] mx-auto z-10">
        <MenuSectionHeader />

        {/* Desktop: asymmetric 12-col editorial grid */}
        <DesktopEditorialGrid items={items} />

        {/* Tablet: 2-col staggered layout */}
        <TabletGrid items={items} />

        {/* Mobile: single-column vertical editorial stack */}
        <MobileStack items={items} />
      </div>

      {/* Bottom hairline */}
      <div className="max-w-[1600px] mx-auto mt-14 md:mt-24">
        <div className="h-px w-full bg-[rgba(26,26,26,0.12)]" />
      </div>
    </section>
  );
}
