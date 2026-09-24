import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─────────────────────────────────────────────────────────────────────────────
// Story Chapters Data — 6-chapter editorial narrative matching assets/stories/
// ─────────────────────────────────────────────────────────────────────────────
const storyChapters = [
  {
    id: 'ch1',
    chapterNumber: '01',
    chapterLabel: '뿌리와 가지 · CHAPTER I: THE ROOTED SANCTUARY',
    title: 'Where Cedar Meets Seoul',
    narrativePart1:
      'Beneath the cool mist of the Himalayan foothills, we sculpted a sanctuary out of raw timber, lime wash, and golden light. The central tree climbs toward the ceiling like an ancient mountain pine, its branches sheltering weathered volumes, pressed tea leaves, and hushed conversations.',
    pullQuote: 'A tree does not choose the soil it finds — it simply reaches toward the warmth of the room.',
    narrativePart2:
      'Here, the frantic tempo of Siliguri dissolves into the slow, meditative rhythm of a Hanok tea house. Every hexagonal mirror catches the amber angle of afternoon sun, offering a quiet port for dreamers and mountain wanderers.',
    narrativePart3:
      'In every mortise joint lives 정성 (jeongseong) — the unhurried devotion that turns cold architecture into a living embrace.',
    media: {
      type: 'image',
      src: '/assets/stories/Story1.webp',
      alt: 'The Himal Tree café interior — tree-shaped bookshelf and warm reading nook',
      objectPosition: 'center 20%',
    },
    imageLayout: 'left', // Desktop: Image Left (50%) / Text Right (50%)
    coords: '26.7271° N, 88.3953° E',
  },
  {
    id: 'ch2',
    chapterNumber: '02',
    chapterLabel: '식탁 위의 온기 · CHAPTER II: THE FEAST OF TWO CLIMATES',
    title: 'Fire, Ferment & Mountain Air',
    narrativePart1:
      'The porcelain arrives steaming and scarlet — hand-shaped garaetteok bathed in a rich, slow-simmered gochujang reduction carrying the fiercest heat of a Seoul winter. Beside it rests Kimbap, tightly bound in toasted gim with crisp mountain julienne and toasted sesame.',
    pullQuote: 'The table is a living bridge between the chill of the peaks and the fire of the stove.',
    narrativePart2:
      'We refuse the shortcut. The kimchi ferments in patient, earthen darkness; the short-grain rice is steamed in vigilant small batches so every grain retains its sweet fragrance. Paired with iced cocoa and brass chopsticks, street comfort becomes ceremony.',
    narrativePart3:
      'To feed another across this table is to offer sanctuary against the cold world outside.',
    media: {
      type: 'image',
      src: '/assets/stories/story2.webp',
      alt: 'Tteokbokki, Kimbap, and iced beverages spread at Himal Tree café table',
      objectPosition: 'center 25%',
    },
    imageLayout: 'right', // Desktop: Text Left (50%) / Image Right (50%)
    coords: '26.7271° N, 88.3953° E',
  },
  {
    id: 'ch3',
    chapterNumber: '03',
    chapterLabel: '오방색의 조화 · CHAPTER III: THE SACRED SPECTRUM',
    title: 'Seven Colours, One Truth',
    narrativePart1:
      'Bibimbap is an edible constellation grounded in the five cardinal colours of Korean cosmology, 오방색 (Obangsaek). Sautéed forest mushrooms, sweet peppers, garden carrots, glazed pork, and tender egg bloom outward in radiant geometric symmetry.',
    pullQuote: 'Before the spoon unites the bowl, one must pause to honour the quiet dignity of each ingredient.',
    narrativePart2:
      'Every ribbon of vegetable is seasoned independently with toasted sesame oil and Himalayan spring water, respecting its singular character before the guest performs the final alchemy of mixing. What was once separate becomes an indivisible whole.',
    narrativePart3:
      'Harmony is never accidental; it is sculpted by hands that refuse to rush.',
    media: {
      type: 'image',
      src: '/assets/stories/Story4.webp',
      alt: 'Concentric arrangement of seven ingredients in Bibimbap bowl',
      objectPosition: 'center 15%',
    },
    imageLayout: 'left', // Desktop: Image Left (50%) / Text Right (50%)
    coords: '26.7271° N, 88.3953° E',
  },
  {
    id: 'ch4',
    chapterNumber: '04',
    chapterLabel: '공동체의 화로 · CHAPTER IV: THE HEARTH OF RESILIENCE',
    title: 'The Hearth of Resilience',
    narrativePart1:
      'Born of post-war ingenuity on the frozen streets of Uijeongbu, Budae Jjigae is Korea\'s grand testament to turning scarcity into feast. At the foot of the hills, our bubbling pot simmers with artisanal bone broth, aged kimchi, savory comforts, and tender greens.',
    pullQuote: 'True comfort food is born not from abundance, but from the human resolve to create warmth where none existed.',
    narrativePart2:
      'The tabletop burner hums with gentle persistence as steam coils upward in fragrant spirals, inviting friends to gather close without ceremony. Shared ladles and shared laughter chase away the mountain dusk.',
    narrativePart3:
      'Around a bubbling pot, strangers find their way to family.',
    media: {
      type: 'image',
      src: '/assets/stories/Image-25943.jpg',
      alt: 'Budae Jjigae hot pot simmering at Himal Tree Korean Cafe Dagapur',
      objectPosition: 'center 20%',
    },
    imageLayout: 'right', // Desktop: Text Left (50%) / Image Right (50%)
    coords: '26.7271° N, 88.3953° E',
  },
  {
    id: 'ch5',
    chapterNumber: '05',
    chapterLabel: '정성의 의식 · CHAPTER V: THE SACRED EXTRACTION',
    title: 'The Silence of the Pour',
    narrativePart1:
      'Behind the matte black counter, movement becomes silent choreography. The measured hiss of the steam wand, the exact grammage of fresh grounds in the portafilter, and the slow, deliberate circular pour that coaxes golden crema into bloom.',
    pullQuote: 'Precision is our quietest form of hospitality — weighed to the gram, poured to the heartbeat.',
    narrativePart2:
      'Whether tending a twelve-hour bone broth or extracting an espresso with the patience of a calligrapher, our philosophy remains unbroken. We believe the hand that prepares the cup imparts something no automated machine can mimic.',
    narrativePart3:
      'In an impatient world, we preserve the grace of the handcrafted gesture.',
    media: {
      type: 'video',
      src: '/assets/stories/Video-24186.mp4',
      alt: 'The meticulous culinary and beverage preparation behind the counter',
      objectPosition: 'center 20%',
    },
    imageLayout: 'left', // Desktop: Image Left (50%) / Text Right (50%)
    coords: '26.7271° N, 88.3953° E',
  },
  {
    id: 'ch6',
    chapterNumber: '06',
    chapterLabel: '머무는 시간 · CHAPTER VI: THE UNMEASURED HOUR',
    title: 'The Light That Lingers',
    narrativePart1:
      'As the afternoon softens toward dusk, the café is bathed in that luminous amber glow found only where the plains touch the mountains. Laptops are pushed aside, second cups are poured, and laughter drifts between tables like familiar music.',
    pullQuote: 'We do not count the minutes here; we measure our days in conversations that refuse to end.',
    narrativePart2:
      'Himal Tree was never built merely as a dining room — it was conceived as an anchor for the soul. The warmth you feel is the collective memory of every traveler, artist, and friend who has rested beneath our boughs.',
    narrativePart3:
      'Leave lighter than when you arrived. The door is always open.',
    media: {
      type: 'video',
      src: '/assets/stories/Video-38635.mp4',
      alt: 'Everyday warmth and community moments inside Himal Tree café',
      objectPosition: 'center 20%',
    },
    imageLayout: 'right', // Desktop: Text Left (50%) / Image Right (50%)
    coords: '26.7271° N, 88.3953° E',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Font Stack Style Constant
// ─────────────────────────────────────────────────────────────────────────────
const SEASONS_FONT = {
  fontFamily: 'var(--font-seasons, "The Seasons", "Cormorant Garamond", "Playfair Display", serif)',
};

// ─────────────────────────────────────────────────────────────────────────────
// CinematicReveal — Slow clip-path wipe inset(100% 0 0 0) -> inset(0 0 0 0)
// and scale settle 1.1 -> 1.0 (~1.5s), sharing the exact MenuSpread DNA
// ─────────────────────────────────────────────────────────────────────────────
function CinematicReveal({ children, delay = 0, className = '', style = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.1 }}
      animate={
        isInView
          ? { clipPath: 'inset(0% 0 0 0)', scale: 1 }
          : { clipPath: 'inset(100% 0 0 0)', scale: 1.1 }
      }
      transition={{
        clipPath: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay },
        scale:    { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: delay + 0.05 },
      }}
      style={{ willChange: 'transform, clip-path', ...style }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ScrollStaggerBlock — useScroll-triggered staggered fade-in + upward drift
// (translateY: 40px -> 0px) as text blocks approach the viewport center
// ─────────────────────────────────────────────────────────────────────────────
function ScrollStaggerBlock({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'center 52%'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  const y = useSpring(rawY, { stiffness: 95, damping: 22, restDelta: 0.001 });
  const opacity = useSpring(rawOpacity, { stiffness: 95, damping: 22, restDelta: 0.001 });

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ParallaxPullQuote — Oversized italicized pull-quote overlapping boundaries
// Micro-parallax moves 10-15% faster vertically; STRICTLY DISABLED ON MOBILE
// ─────────────────────────────────────────────────────────────────────────────
function ParallaxPullQuote({ quote, alignRight = false, chapterRef }) {
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ['start end', 'end start'],
  });

  // Micro-parallax: Moves 10-15% faster vertically than body; strictly zero on mobile
  const rawY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [45, -45]);
  const y = useSpring(rawY, { stiffness: 65, damping: 24, restDelta: 0.001 });

  return (
    <motion.blockquote
      style={{ y: isMobile ? 0 : y, willChange: isMobile ? 'auto' : 'transform' }}
      className={`relative my-10 md:my-14 lg:my-16 z-20 max-w-[44ch] overflow-hidden ${
        alignRight
          ? 'text-right md:-mr-8 lg:-mr-16 xl:-mr-20 ml-auto'
          : 'text-left md:-ml-8 lg:-ml-16 xl:-ml-20 mr-auto'
      }`}
    >
      {/* Decorative watermark quotation mark */}
      <span
        className={`absolute -top-10 font-serif text-[#2A2118]/8 select-none pointer-events-none ${
          alignRight ? '-right-6' : '-left-6'
        }`}
        style={{ fontSize: 'clamp(5rem, 8vw, 8.5rem)', lineHeight: 1, ...SEASONS_FONT }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <p
        className="text-[#2A2118] italic leading-[1.18] relative z-10"
        style={{ fontSize: 'clamp(1.5rem, 2.3vw, 2.5rem)', letterSpacing: '-0.015em', ...SEASONS_FONT }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Editorial accent rule */}
      <div
        className={`mt-6 h-px w-14 bg-[#8B2626]/40 ${alignRight ? 'ml-auto' : ''}`}
      />
    </motion.blockquote>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StoryVideo Component (Self-healing, top-weighted, with mute toggle)
// ─────────────────────────────────────────────────────────────────────────────
function StoryVideo({ src, alt, objectPosition = 'center 20%' }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silent catch for browser autoplay restrictions
        });
      }
    }
  }, [src]);

  const toggleSound = () => {
    if (videoRef.current) {
      const next = !isMuted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#1A1A1A] overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        style={{ objectPosition }}
        aria-label={alt}
      />
      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        type="button"
        aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        className="absolute bottom-5 right-5 z-20 p-2.5 rounded-full bg-[#1A1A1A]/70 text-[#F9F8F6] backdrop-blur-sm border border-[#F9F8F6]/20 opacity-80 hover:opacity-100 transition-opacity"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StoryImage Component (Top-weighted object positioning & shimmer loading)
// ─────────────────────────────────────────────────────────────────────────────
function StoryImage({ src, alt, objectPosition = 'center 20%' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className="relative w-full h-full bg-[#EAE6DF]/60 overflow-hidden group">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EAE6DF] via-[#F3EFE9] to-[#EAE6DF] animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[1100ms] ease-out group-hover:scale-[1.04] ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectPosition }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PinnedMediaContainer — The 50% Sticky Pin Column for Desktop & Tablet
// (position: sticky; top: 0; height: 100vh; overflow: hidden;)
// ─────────────────────────────────────────────────────────────────────────────
function PinnedMediaContainer({ chapter }) {
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-6 md:p-8 lg:p-12 xl:p-16">
      <CinematicReveal
        delay={0.1}
        className="w-full h-[84vh] max-h-[880px] relative overflow-hidden rounded-sm shadow-2xl shadow-[#2A2118]/15 border border-[#2A2118]/12"
      >
        <div className="relative w-full h-full">
          {chapter.media.type === 'video' ? (
            <StoryVideo
              src={chapter.media.src}
              alt={chapter.media.alt}
              objectPosition={chapter.media.objectPosition}
            />
          ) : (
            <StoryImage
              src={chapter.media.src}
              alt={chapter.media.alt}
              objectPosition={chapter.media.objectPosition}
            />
          )}

          {/* Chapter Watermark Number Stamp */}
          <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
            <span
              className="text-[#F9F8F6]/35 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] font-serif"
              style={{ fontSize: 'clamp(3.5rem, 5.5vw, 6rem)', lineHeight: 1, ...SEASONS_FONT }}
              aria-hidden="true"
            >
              {chapter.chapterNumber}
            </span>
          </div>

          {/* Location Coordinates Tag */}
          <div className="absolute bottom-5 left-6 z-10 pointer-events-none select-none">
            <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-[#F9F8F6]/60 drop-shadow">
              {chapter.coords}
            </span>
          </div>

          {/* Subtle bottom vignette for filmic depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.45)] via-transparent to-transparent pointer-events-none" />
        </div>
      </CinematicReveal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ScrollingTextContainer — The 50% Text Column with massive 30vh padding
// ─────────────────────────────────────────────────────────────────────────────
function ScrollingTextContainer({ chapter, alignRight = false, chapterRef }) {
  return (
    <div
      className={`flex flex-col ${
        alignRight ? 'items-end text-right' : 'items-start text-left'
      } justify-center w-full`}
    >
      {/* Chapter Eyebrow */}
      <ScrollStaggerBlock>
        <span className="font-sans text-[9px] tracking-[0.55em] uppercase text-[#2A2118] opacity-50 block mb-6 font-semibold">
          {chapter.chapterLabel}
        </span>
      </ScrollStaggerBlock>

      {/* Main Chapter Title */}
      <ScrollStaggerBlock>
        <h3
          className="text-[#1A1A1A] leading-[0.92] mb-6 font-normal"
          style={{ fontSize: 'clamp(2.6rem, 4.3vw, 5rem)', letterSpacing: '-0.02em', ...SEASONS_FONT }}
        >
          {chapter.title}
        </h3>
      </ScrollStaggerBlock>

      {/* Hairline Divider */}
      <ScrollStaggerBlock>
        <div className={`h-px w-16 bg-[#2A2118]/25 mb-8 ${alignRight ? 'ml-auto' : ''}`} />
      </ScrollStaggerBlock>

      {/* Narrative Part 1 */}
      <ScrollStaggerBlock>
        <p
          className="font-body text-[#2A2118] leading-[2.0] max-w-[46ch] mb-4"
          style={{ fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)', letterSpacing: '0.025em' }}
        >
          {chapter.narrativePart1}
        </p>
      </ScrollStaggerBlock>

      {/* Oversized Italicized Pull-Quote (Micro-parallax + Boundary Overlap) */}
      <ParallaxPullQuote
        quote={chapter.pullQuote}
        alignRight={alignRight}
        chapterRef={chapterRef}
      />

      {/* Narrative Part 2 */}
      <ScrollStaggerBlock>
        <p
          className="font-body text-[#2A2118] leading-[2.0] max-w-[46ch] mb-4"
          style={{ fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)', letterSpacing: '0.025em' }}
        >
          {chapter.narrativePart2}
        </p>
      </ScrollStaggerBlock>

      {/* Narrative Part 3 (Craftsmanship Conclusion) */}
      <ScrollStaggerBlock>
        <p
          className="font-body text-[#2A2118] leading-[2.0] max-w-[46ch] opacity-85 italic mb-6"
          style={{ fontSize: 'clamp(0.8rem, 0.9vw, 0.88rem)', letterSpacing: '0.02em' }}
        >
          {chapter.narrativePart3}
        </p>
      </ScrollStaggerBlock>

      {/* Chapter Ghost Flourish */}
      <ScrollStaggerBlock>
        <span
          className="text-[#2A2118]/6 select-none pointer-events-none block mt-4"
          style={{ fontSize: 'clamp(4.5rem, 8vw, 7.5rem)', lineHeight: 1, ...SEASONS_FONT }}
          aria-hidden="true"
        >
          {chapter.chapterNumber}
        </span>
      </ScrollStaggerBlock>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop/Tablet Split Chapter (≥768px)
// True 50/50 split viewport with alternating pin rhythm
// ─────────────────────────────────────────────────────────────────────────────
function StickyChapterDesktopTablet({ chapter }) {
  const chapterRef = useRef(null);
  const imageLeft = chapter.imageLayout === 'left';

  return (
    <div
      ref={chapterRef}
      className="hidden md:flex relative border-b border-[#2A2118]/12 last:border-b-0"
      style={{ minHeight: '165vh' }}
    >
      {imageLeft ? (
        <>
          {/* 50% Pinned Media Left */}
          <div className="w-1/2 relative flex-shrink-0">
            <PinnedMediaContainer chapter={chapter} />
          </div>

          {/* 50% Scrolling Text Right with massive 30vh padding */}
          <div
            className="w-1/2 relative z-10 flex flex-col justify-center"
            style={{
              paddingTop: '30vh',
              paddingBottom: '30vh',
              paddingLeft: 'clamp(2rem, 5vw, 6rem)',
              paddingRight: 'clamp(2rem, 5vw, 5rem)',
            }}
          >
            <ScrollingTextContainer
              chapter={chapter}
              alignRight={false}
              chapterRef={chapterRef}
            />
          </div>
        </>
      ) : (
        <>
          {/* 50% Scrolling Text Left with massive 30vh padding */}
          <div
            className="w-1/2 relative z-10 flex flex-col justify-center"
            style={{
              paddingTop: '30vh',
              paddingBottom: '30vh',
              paddingRight: 'clamp(2rem, 5vw, 6rem)',
              paddingLeft: 'clamp(2rem, 5vw, 5rem)',
            }}
          >
            <ScrollingTextContainer
              chapter={chapter}
              alignRight={true}
              chapterRef={chapterRef}
            />
          </div>

          {/* 50% Pinned Media Right */}
          <div className="w-1/2 relative flex-shrink-0">
            <PinnedMediaContainer chapter={chapter} />
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Chapter (<768px)
// Stacked vertically with negative margin physical overlap card
// Opaque textured paper look (no backdrop-blur), micro-parallax disabled
// ─────────────────────────────────────────────────────────────────────────────
function StickyChapterMobile({ chapter }) {
  const chapterRef = useRef(null);

  return (
    <div ref={chapterRef} className="md:hidden flex flex-col mb-16 sm:mb-24 last:mb-8 w-full max-w-[100vw] overflow-x-hidden">
      {/* Mobile Media: Signature clip-path wipe reveal & top-weighted positioning */}
      <CinematicReveal
        delay={0.05}
        className="relative w-full max-w-[100vw] aspect-[4/5] overflow-hidden rounded-sm shadow-md border-y border-[#2A2118]/10"
      >
        <div className="relative w-full h-full">
          {chapter.media.type === 'video' ? (
            <StoryVideo
              src={chapter.media.src}
              alt={chapter.media.alt}
              objectPosition="center top"
            />
          ) : (
            <StoryImage
              src={chapter.media.src}
              alt={chapter.media.alt}
              objectPosition="center top"
            />
          )}

          {/* Chapter Watermark Number */}
          <div className="absolute top-4 left-5 z-10 pointer-events-none select-none">
            <span
              className="text-[#F9F8F6]/35 drop-shadow font-serif"
              style={{ fontSize: '3.6rem', lineHeight: 1, ...SEASONS_FONT }}
              aria-hidden="true"
            >
              {chapter.chapterNumber}
            </span>
          </div>

          {/* Location Tag */}
          <div className="absolute bottom-10 left-5 z-10 pointer-events-none select-none">
            <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#F9F8F6]/60 drop-shadow">
              {chapter.coords}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,20,14,0.5)] via-transparent to-transparent pointer-events-none" />
        </div>
      </CinematicReveal>

      {/* Mobile Overlapping Text Card - Opaque Paper Tint (no backdrop blur) with elegant px-6 py-8 */}
      <div
        className="relative z-10 -mt-10 sm:-mt-14 mx-4 sm:mx-6 px-6 py-8 bg-[#F4EFEA] rounded-sm shadow-lg shadow-[#2A2118]/10 border border-[#2A2118]/12"
        style={{
          backgroundImage:
            'radial-gradient(rgba(42, 33, 24, 0.05) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Eyebrow */}
        <span className="font-sans text-[8.5px] tracking-[0.45em] uppercase text-[#2A2118] opacity-55 block mb-3 font-semibold">
          {chapter.chapterLabel}
        </span>

        {/* Title in The Seasons */}
        <h3
          className="text-[#1A1A1A] leading-[0.94] mb-5 font-normal text-4xl"
          style={SEASONS_FONT}
        >
          {chapter.title}
        </h3>

        {/* Hairline Divider */}
        <div className="h-px w-12 bg-[#2A2118]/20 mb-6" />

        {/* Narrative Part 1 */}
        <p
          className="font-body text-[#2A2118] leading-[1.85] mb-5"
          style={{ fontSize: '0.82rem', letterSpacing: '0.02em' }}
        >
          {chapter.narrativePart1}
        </p>

        {/* Italicized Pull-Quote (No Parallax on Mobile, Red Accent Border) */}
        <blockquote className="my-6 border-l-2 border-[#8B2626] pl-4 py-1">
          <p
            className="text-[#2A2118] italic leading-[1.25]"
            style={{ fontSize: 'clamp(1.15rem, 4.2vw, 1.6rem)', ...SEASONS_FONT }}
          >
            &ldquo;{chapter.pullQuote}&rdquo;
          </p>
        </blockquote>

        {/* Narrative Part 2 */}
        <p
          className="font-body text-[#2A2118] leading-[1.85] mb-4"
          style={{ fontSize: '0.82rem', letterSpacing: '0.02em' }}
        >
          {chapter.narrativePart2}
        </p>

        {/* Narrative Part 3 */}
        <p
          className="font-body text-[#2A2118] leading-[1.85] opacity-85 italic mb-6"
          style={{ fontSize: '0.8rem', letterSpacing: '0.02em' }}
        >
          {chapter.narrativePart3}
        </p>

        {/* Card Footer Stamp */}
        <div className="pt-5 border-t border-[#2A2118]/12 flex items-center justify-between">
          <span className="font-sans text-[8px] tracking-[0.35em] uppercase opacity-45 font-semibold">
            Himal Tree Chronicles
          </span>
          <span
            className="text-[#2A2118]/25 text-3xl font-serif"
            style={SEASONS_FONT}
          >
            {chapter.chapterNumber}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StoriesSectionHeader — Character-by-character clip wipe (Shared Menu DNA)
// ─────────────────────────────────────────────────────────────────────────────
function StoriesSectionHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -30px 0px' });
  const title = 'Our Stories';
  const chars = title.split('');

  return (
    <div ref={ref} className="mb-14 md:mb-28 overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16">
      {/* Eyebrow */}
      <motion.span
        className="font-sans text-[10px] tracking-[0.55em] uppercase opacity-45 block mb-5 font-semibold"
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 0.45, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        우리의 이야기 &middot; OUR STORIES
      </motion.span>

      {/* Main Title Character-by-Character Wipe */}
      <h2
        className="leading-[0.88] overflow-hidden block"
        style={{ fontSize: 'clamp(2.75rem, 11vw, 12rem)', ...SEASONS_FONT }}
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
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.04,
            }}
            style={{ willChange: 'transform, clip-path' }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </h2>

      {/* Poetic Subtitle */}
      <motion.p
        className="italic text-[#2A2118] opacity-65 mt-4 max-w-[55ch]"
        style={{ fontSize: 'clamp(1rem, 1.4vw, 1.5rem)', ...SEASONS_FONT }}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 0.65, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.35 }}
      >
        A chronicled journey between the cedar mist of the Himalayas and the warmth of a Korean kitchen.
      </motion.p>

      {/* Animated Expanding Hairline */}
      <motion.div
        className="h-px bg-[#2A2118]/15 mt-10"
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN STORIES SECTION EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function StoriesSection() {
  return (
    <section
      id="stories"
      className="relative text-[#1A1A1A] overflow-x-hidden max-w-[100vw]"
      style={{ willChange: 'transform' }}
    >
      {/* Paper wash allowing bg-paper.jpg texture to breathe organically through generous whitespace */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none bg-[#F9F8F6]/85"
        aria-hidden="true"
      />

      {/* Subtle organic noise grain overlay matching the menu spread */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.024] -z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 max-w-[1700px] mx-auto"
        style={{
          paddingTop: 'clamp(6rem, 10vw, 10rem)',
          paddingBottom: 'clamp(5rem, 8vw, 8rem)',
        }}
      >
        {/* Section Header */}
        <StoriesSectionHeader />

        {/* 6 Story Chapters — The Sticky Split-Spread */}
        <div className="w-full">
          {storyChapters.map((chapter) => (
            <div key={chapter.id} className="relative w-full">
              {/* Desktop & Tablet: 50/50 Sticky Split-Spread (≥768px) */}
              <StickyChapterDesktopTablet chapter={chapter} />

              {/* Mobile: Vertical Stack with Opaque Textured Paper Card (<768px) */}
              <StickyChapterMobile chapter={chapter} />
            </div>
          ))}
        </div>

        {/* Section Colophon / End Seal */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 mt-14 md:mt-28">
          <div className="h-px w-full bg-[#2A2118]/15 mb-8" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-[9px] tracking-[0.35em] uppercase opacity-45">
            <span>Himal Tree Chronicles &middot; Volume I</span>
            <span>Siliguri &middot; West Bengal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
