import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AGENCY_ASSETS } from '../../data/assets.ts';

const HERO_SLIDES = [
  {
    image: AGENCY_ASSETS.HERO_EDITORIAL,
    alt: 'Nepalese editorial model in structured ivory architectural coat',
    caption: 'Editorial Division · Autumn / Winter Showcase',
  },
  {
    image: AGENCY_ASSETS.HERO_ATELIER,
    alt: 'Nepalese male and female editorial models in tailored black silhouettes',
    caption: 'Runway & Couture · Across Nepal',
  },
  {
    image: AGENCY_ASSETS.CAMPAIGN_MONOLITH,
    alt: 'Editorial menswear campaign shot against brutalist concrete arches',
    caption: 'Menswear Campaign · Himalayan Atelier',
  },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      ref={sectionRef}
      className="relative h-svh min-h-[620px] sm:min-h-[680px] max-h-[1080px] w-full overflow-hidden bg-[#101010] text-[#FAF8F4]"
    >
      {/* Background Slideshow with subtle zoom & parallax */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: parallaxY }}
        className="absolute inset-0 w-full h-full"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.alt}
              loading={activeSlide === 0 ? 'eager' : 'lazy'}
              decoding={activeSlide === 0 ? 'sync' : 'async'}
              fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Measured contrast scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#101010]/90 via-[#101010]/30 to-[#101010]/55"
      />

      {/* Content Overlay */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-8 sm:pb-10 md:pb-14 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4 text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.22em] text-[#B6A48D] pt-2">
          <span>Nepal · Nationwide Representation · Est. 2019</span>
          <span className="hidden sm:inline text-[#FAF8F4]/70">{currentSlide.caption}</span>
        </div>

        <div className="max-w-4xl">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.26em] text-[#B6A48D] mb-4"
          >
            House of Fashion Nepal · Talent &amp; Editorial Representation
          </motion.p>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[0.95] tracking-[-0.02em] font-normal uppercase text-[#FAF8F4]"
          >
            The Face of Tomorrow.
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            className="mt-5 text-base sm:text-lg text-[#FAF8F4]/85 max-w-xl leading-relaxed"
          >
            Discover exceptional modeling talent from across Nepal — uniting heritage craft with global fashion houses.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              to="/models"
              className="inline-flex items-center gap-3 px-5 sm:px-7 py-3.5 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#B6A48D] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <span>Explore Models</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/become-a-model"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3.5 border border-[#FAF8F4]/60 text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#FAF8F4] hover:text-[#101010] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Join Our Agency
            </Link>
          </motion.div>
        </div>

        {/* Bottom bar: slide indicators + scroll cue */}
        <div className="flex items-end justify-between gap-6 pt-6 border-t border-white/15">
          <div className="flex items-center gap-3" role="tablist" aria-label="Hero slideshow">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.caption}
                type="button"
                role="tab"
                aria-selected={activeSlide === idx}
                aria-label={`View slide ${idx + 1}`}
                onClick={() => setActiveSlide(idx)}
                className="group py-2 cursor-pointer flex items-center gap-2"
              >
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    activeSlide === idx
                      ? 'w-10 bg-[#FAF8F4]'
                      : 'w-5 bg-[#FAF8F4]/35 group-hover:bg-[#FAF8F4]/70'
                  }`}
                />
              </button>
            ))}
          </div>

          <a
            href="#featured-models"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF8F4]/75 hover:text-[#FAF8F4] transition-colors"
          >
            <span>Scroll</span>
            <motion.span
              animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
}
