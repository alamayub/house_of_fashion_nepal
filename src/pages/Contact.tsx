import { ArrowRight, Building2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { SocialLinks } from '../components/common/SocialLinks.tsx';
import { ContactForm } from '../components/forms/ContactForm.tsx';
import { DEPARTMENT_DESKS, STUDIO_SPECS } from '../data/agencyContent.ts';

export default function Contact() {
  return (
    <PageTransition>
      <SeoHead
        title="Contact Us — Nepal Studio & Press Desk"
        description="Reach House of Fashion Nepal for nationwide Nepal casting, press inquiries, production partnerships, scouting questions, and studio appointments."
      />

      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 sm:pb-16 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <Reveal className="space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#632B37]">
              Studio &amp; Press Desk · Nationwide Nepal
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98]">
              Contact Agency
            </h1>
            <p className="text-base sm:text-lg text-[#101010]/75 max-w-2xl leading-relaxed">
              Connect with our Nepal directors regarding editorial press, nationwide photoshoot production, international agency partnerships, or general inquiries.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              to="/book"
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
            >
              <span>Need to Book a Model?</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#FAF8F4] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Agency Details */}
          <Reveal className="lg:col-span-4 space-y-8">
            <div className="space-y-2 pb-6 border-b border-[#101010]/10">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#632B37]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Nepal Headquarters</span>
              </p>
              <h2 className="font-serif text-3xl">Studio Office</h2>
              <p className="text-sm text-[#101010]/75 leading-relaxed pt-2">
                Jhamsikhel Atelier Wing, Ward 3<br />
                Lalitpur 44700, Kathmandu Valley<br />
                Nepal
              </p>
            </div>

            <div className="space-y-3 pb-6 border-b border-[#101010]/10 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-[#632B37]">
                Direct Channels
              </p>
              <div>
                <p className="text-xs text-[#101010]/55 uppercase tracking-wider">Bookings</p>
                <a
                  href="mailto:bookings@houseoffashionnepal.com.np"
                  className="inline-flex items-start gap-2 hover:text-[#632B37] transition-colors break-all sm:break-normal"
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-[#632B37] shrink-0" />
                  <span>bookings@houseoffashionnepal.com.np</span>
                </a>
              </div>
              <div>
                <p className="text-xs text-[#101010]/55 uppercase tracking-wider">Scouting</p>
                <a
                  href="mailto:scouting@houseoffashionnepal.com.np"
                  className="inline-flex items-start gap-2 hover:text-[#632B37] transition-colors break-all sm:break-normal"
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-[#632B37] shrink-0" />
                  <span>scouting@houseoffashionnepal.com.np</span>
                </a>
              </div>
              <div>
                <p className="text-xs text-[#101010]/55 uppercase tracking-wider">
                  Privacy &amp; Legal
                </p>
                <a
                  href="mailto:legal@houseoffashionnepal.com.np"
                  className="inline-flex items-start gap-2 hover:text-[#632B37] transition-colors break-all sm:break-normal"
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-[#632B37] shrink-0" />
                  <span>legal@houseoffashionnepal.com.np</span>
                </a>
              </div>
              <div>
                <p className="text-xs text-[#101010]/55 uppercase tracking-wider">Telephone</p>
                <p className="inline-flex items-center gap-2 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                  <span>+977 1 552 8410</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 pb-6 border-b border-[#101010]/10 text-sm text-[#101010]/75">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#632B37]">
                <Clock className="w-3.5 h-3.5" />
                <span>Studio Hours</span>
              </p>
              <p>Sunday–Friday: 10:00–18:00 NPT</p>
              <p className="text-xs text-[#101010]/55">
                Saturday castings by prior appointment only.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-[#632B37]">
                Social Channels
              </p>
              <SocialLinks variant="tiles" tone="light" />
            </div>
          </Reveal>

          {/* General & Press Contact Form */}
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="mb-8 pb-4 border-b border-[#101010]/15">
              <h2 className="font-serif text-3xl text-[#101010]">
                Send an Inquiry
              </h2>
              <p className="text-sm text-[#101010]/65 mt-1">
                For press features, creative collaborations, or general studio inquiries.
              </p>
            </div>

            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Studio Wing & Department Routing */}
      <section className="py-16 md:py-24 bg-[#F5F1EA] text-[#101010] border-t border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
          <div>
            <div className="pb-8 mb-8 border-b border-[#101010]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Jhamsikhel Facilities</span>
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">
                  Studio Wing &amp; Casting Suite Specs
                </h2>
              </div>
              <p className="text-sm text-[#101010]/65 max-w-md">
                Private appointments available for visiting art directors, garment fittings, and live digital casting sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#101010]/12">
              {STUDIO_SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="p-6 bg-[#FAF8F4] border-r border-b border-[#101010]/12 space-y-2"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                    {spec.label}
                  </p>
                  <p className="font-serif text-3xl text-[#101010]">{spec.value}</p>
                  <p className="text-xs sm:text-sm text-[#101010]/70 leading-relaxed">
                    {spec.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="pb-8 mb-8 border-b border-[#101010]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37] mb-2">
                Department Routing
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">
                Reach the Right Desk Directly
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {DEPARTMENT_DESKS.map((desk) => (
                <div
                  key={desk.department}
                  className="p-6 sm:p-7 bg-[#FAF8F4] border border-[#101010]/12 flex flex-col justify-between gap-5 min-w-0"
                >
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#632B37]">
                      {desk.responseWindow}
                    </p>
                    <h3 className="font-serif text-2xl text-[#101010]">
                      {desk.department}
                    </h3>
                    <p className="text-xs text-[#101010]/60">Lead: {desk.lead}</p>
                    <p className="text-sm text-[#101010]/75 leading-relaxed pt-1">
                      {desk.scope}
                    </p>
                  </div>
                  <a
                    href={`mailto:${desk.email}`}
                    className="inline-flex items-start gap-2 text-xs font-medium text-[#101010] hover:text-[#632B37] transition-colors pt-3 border-t border-[#101010]/10 break-all sm:break-normal"
                  >
                    <Mail className="w-3.5 h-3.5 mt-0.5 text-[#632B37] shrink-0" />
                    <span>{desk.email}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
