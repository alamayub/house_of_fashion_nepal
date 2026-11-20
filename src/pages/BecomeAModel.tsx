import { Camera, Compass, ShieldCheck, Shirt, Sun } from 'lucide-react';
import { EditorialFaq } from '../components/common/EditorialFaq.tsx';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { TestimonialsSection } from '../components/common/TestimonialsSection.tsx';
import { ApplicationForm } from '../components/forms/ApplicationForm.tsx';
import {
  BOARD_STANDARDS,
  SCOUTING_FAQS,
  SCOUTING_ROADMAP,
} from '../data/agencyContent.ts';

const SCOUTING_NOTES = [
  {
    icon: Sun,
    title: '01. Natural Daylight Only',
    body: 'Shoot near a window against a plain wall. Avoid heavy makeup, filters, studio retouching, or sunglasses.',
  },
  {
    icon: Shirt,
    title: '02. Simple Attire',
    body: 'Wear fitted monochrome basics — such as a plain T-shirt or singlet and jeans — so our directors can read natural posture.',
  },
  {
    icon: Camera,
    title: '03. No Prior Portfolio Required',
    body: 'Smartphone snapshots are welcome. We never charge aspiring applicants scouting fees or compulsory portfolio packages.',
  },
];

export default function BecomeAModel() {
  return (
    <PageTransition>
      <SeoHead
        title="Become a Model — Open Casting Application"
        description="Apply to join House of Fashion Nepal from anywhere in the country. Submit natural-light digital snapshots directly to our scouting directors."
        faqs={SCOUTING_FAQS}
      />

      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 sm:pb-16 bg-[#101010] text-[#FAF8F4]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-5">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D] mb-4">
              New Faces &amp; Open Scouting · Across Nepal
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98] max-w-4xl mb-5">
              Become a Model
            </h1>
            <p className="text-base sm:text-lg text-[#FAF8F4]/75 max-w-2xl leading-relaxed">
              We represent diverse talent across Fashion, Commercial, Runway, Fitness, Petite, and Curve boards. All applicants must be 18 years or older.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#F5F1EA] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="lg:col-span-4 space-y-8">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                Submission Guidelines
              </p>
              <h2 className="font-serif text-3xl text-[#101010]">
                How to Prepare Your Digitals
              </h2>
            </Reveal>

            <div className="space-y-6">
              {SCOUTING_NOTES.map((note, idx) => {
                const Icon = note.icon;
                return (
                  <Reveal key={note.title} delay={0.05 * idx}>
                    <div className="pt-4 border-t border-[#101010]/15 space-y-1.5">
                      <div className="flex items-center gap-2.5 text-[#632B37]">
                        <Icon className="w-4 h-4 shrink-0" />
                        <h3 className="font-serif text-xl text-[#101010]">{note.title}</h3>
                      </div>
                      <p className="text-sm text-[#101010]/70 leading-relaxed">{note.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.16}>
              <div className="p-6 bg-[#FAF8F4] border border-[#101010]/15 text-xs text-[#101010]/75 leading-relaxed space-y-2">
                <p className="inline-flex items-center gap-2 uppercase tracking-[0.16em] text-[#632B37] font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Privacy Commitment</span>
                </p>
                <p>
                  We never request sensitive body measurements during initial applications. Only essential height and representation preferences are asked.
                </p>
              </div>
            </Reveal>
          </aside>

          <Reveal delay={0.08} className="lg:col-span-8">
            <ApplicationForm />
          </Reveal>
        </div>
      </section>

      {/* Board Standards & Post-Application Roadmap */}
      <section className="py-20 md:py-28 bg-[#FAF8F4] text-[#101010] border-t border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-20">
          <div>
            <div className="pb-10 mb-10 border-b border-[#101010]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37] mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>What Happens Next</span>
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl">
                  From Digital Submission to Represented Board
                </h2>
              </div>
              <p className="text-sm text-[#101010]/65 max-w-md">
                Every application is reviewed directly by House of Fashion Nepal’s Nepal scouting directors — no external casting agents or fees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#101010]/12">
              {SCOUTING_ROADMAP.map((stage) => (
                <div
                  key={stage.step}
                  className="p-6 sm:p-7 bg-[#FAF8F4] border-r border-b border-[#101010]/12 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#632B37]">
                    <span className="font-mono shrink-0">{stage.step}</span>
                    <span className="uppercase tracking-[0.14em] text-[#101010]/55">
                      {stage.timeline}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#101010]">{stage.title}</h3>
                  <p className="text-sm text-[#101010]/70 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="pb-8 mb-8 border-b border-[#101010]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                Division Profiles
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">
                Boards &amp; Casting Focus
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BOARD_STANDARDS.map((item) => (
                <div
                  key={item.board}
                  className="p-6 bg-[#F5F1EA] border border-[#101010]/12 space-y-2"
                >
                  <h3 className="font-serif text-2xl text-[#101010]">{item.board}</h3>
                  <p className="text-xs font-mono text-[#632B37]">{item.heightGuide}</p>
                  <p className="text-xs sm:text-sm text-[#101010]/70 leading-relaxed pt-1">
                    {item.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EditorialFaq
        items={SCOUTING_FAQS}
        kicker="Applicant Protection & Answers"
        heading="Open Scouting FAQs"
        subheading="Important facts for aspiring models across Nepal regarding zero scouting fees, required digitals, and regional auditions."
        tone="dark"
      />

      <TestimonialsSection
        lockedPerspective="model"
        kicker="Talent Perspectives"
        heading="Voices from Our Represented Roster"
        subheading="Hear from Principal, Established, Curve, and New Faces models represented by House of Fashion Nepal across Nepal and international fashion weeks."
        tone="paper"
      />
    </PageTransition>
  );
}
