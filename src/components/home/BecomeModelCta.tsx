import { ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../common/MotionPrimitives.tsx';

export function BecomeModelCta() {
  return (
    <section className="bg-[#632B37] text-[#FAF8F4] py-20 md:py-28 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
        <Reveal className="space-y-4 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#F5F1EA]/80">
            Scouting &amp; New Faces · Nationwide Across Nepal
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98]">
            Your Journey Starts Here.
          </h2>
          <p className="text-base text-[#FAF8F4]/80 leading-relaxed max-w-xl pt-2">
            We welcome fresh faces across Nepal — no prior portfolio required. Submit natural-light digital snapshots directly to our scouting desk.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <Link
            to="/become-a-model"
            className="group inline-flex items-center gap-3 px-9 py-4 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#101010] hover:text-[#FAF8F4] transition-colors duration-200 whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
