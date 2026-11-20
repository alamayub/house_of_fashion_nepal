import { ArrowRight, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';

const TERMS_SECTIONS = [
  { id: 'acceptance', title: '01. Electronic Acceptance' },
  { id: 'bookings', title: '02. Bookings, Options & Cancellations' },
  { id: 'copyright', title: '03. Copyright, Usage & AI Protection' },
  { id: 'fees', title: '04. Fees, VAT, TDS & Zero Scouting Fees' },
  { id: 'labour', title: '05. Set Safety & Nepal Labour Standards' },
  { id: 'eligibility', title: '06. Age Eligibility & Showcase Notice' },
  { id: 'force-majeure', title: '07. Force Majeure & Location Shoots' },
  { id: 'governing-law', title: '08. Governing Law & Jurisdiction' },
];

export default function TermsAndConditions() {
  return (
    <PageTransition>
      <SeoHead
        title="Terms & Conditions — Nepal Agency Governance"
        description="Terms & Conditions for House of Fashion Nepal Pvt. Ltd., governed by the Muluki Civil Code 2074, Copyright Act 2059, Labour Act 2074, and ETA 2063."
      />

      {/* Editorial Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 md:pb-20 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-4">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37] mb-3">
              <Scale className="w-4 h-4 shrink-0" />
              <span>Commercial &amp; Representation Terms · Nepal</span>
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98]">
              Terms &amp; Conditions
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.16em] text-[#101010]/60 pt-4">
              <span>Effective: November 2026</span>
              <span aria-hidden="true">·</span>
              <span>Muluki Civil Code, 2074 &amp; Copyright Act, 2059</span>
              <span aria-hidden="true">·</span>
              <span>Courts of Kathmandu / Lalitpur</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Two-column Editorial Monograph Reading Layout */}
      <section className="py-16 md:py-24 bg-[#FAF8F4] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky Chapter Index */}
          <aside className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-28 space-y-6 pb-8 lg:pb-0 border-b lg:border-b-0 border-[#101010]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37]">
                Clauses
              </p>
              <nav aria-label="Terms and conditions sections" className="flex flex-col space-y-2.5">
                {TERMS_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="text-sm text-[#101010]/70 hover:text-[#632B37] transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="pt-6 border-t border-[#101010]/10 text-xs text-[#101010]/60 space-y-1.5">
                <p className="uppercase tracking-[0.14em] text-[#101010]">
                  Related Document
                </p>
                <Link
                  to="/privacy-policy"
                  className="group inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#632B37]"
                >
                  <span>Read Privacy Policy</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </aside>

          {/* Main Reading Column */}
          <article className="lg:col-span-8 max-w-2xl space-y-12 text-sm sm:text-base text-[#101010]/80 leading-[1.8]">
            <div className="pb-8 border-b border-[#101010]/10">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                These Terms &amp; Conditions govern all website access, talent booking requests, casting submissions, and commercial representation services provided by House of Fashion Nepal Pvt. Ltd. (“House of Fashion Nepal”), incorporated under the Companies Act, 2063 of Nepal with its principal studio in Lalitpur, Kathmandu Valley.
              </p>
            </div>

            <section id="acceptance" className="space-y-3 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                01. Acceptance &amp; Electronic Records
              </h2>
              <p>
                By browsing this platform, submitting a model application, or requesting talent availability, you agree to these Terms &amp; Conditions. Pursuant to the Electronic Transactions Act, 2063 (2008) of Nepal, digital booking requests, confirmation emails, and electronic signatures carry full legal validity between House of Fashion Nepal, clients, and represented talent.
              </p>
            </section>

            <section id="bookings" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                02. Talent Bookings, Options &amp; Cancellations
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Provisional Options (Holds):</strong> An option reserves a model’s dates provisionally without financial commitment until confirmed. If another client places a firm booking request, the first-option client receives 24 hours to confirm or release the hold.
                </li>
                <li>
                  <strong>Confirmed Bookings:</strong> A booking becomes binding only upon written Booking Confirmation issued by House of Fashion Nepal’s bookings desk detailing rate, call times, deliverables, and usage rights.
                </li>
                <li>
                  <strong>Cancellations &amp; Postponements:</strong> Confirmed bookings cancelled less than 48 hours prior to call time incur 50% of the agreed talent fee; cancellations within 24 hours incur 100% of the day rate, plus any non-refundable travel or location expenses already committed.
                </li>
              </ul>
            </section>

            <section id="copyright" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                03. Copyright, Image Licensing &amp; AI Likeness Protection
              </h2>
              <p>
                In accordance with the Copyright Act, 2059 (2002) (प्रतिलिपि अधिकार ऐन, २०५९) of Nepal, all photography, video reels, and creative works showcased on this website remain the intellectual property of House of Fashion Nepal, respective photographers, or commissioning brands. Unauthorized scraping, hotlinking, or commercial reproduction is strictly prohibited.
              </p>
              <p>
                Standard shoot fees compensate attendance and performance only. Public broadcast, out-of-home (OOH) billboards, packaging, paid digital campaigns, and multi-country licensing require explicit written usage terms specifying territory (e.g., Nepal only, South Asia, or Worldwide) and duration.
              </p>
              <p>
                <strong>Synthetic &amp; Generative AI Restriction:</strong> No client or third party may use any photograph, video clip, measurement, or voice of a House of Fashion Nepal talent to train artificial intelligence models, create digital replicas, or generate synthetic likenesses without a separate, explicitly negotiated written addendum.
              </p>
            </section>

            <section id="fees" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                04. Fees, Taxation (VAT / TDS) &amp; Zero Scouting Fees
              </h2>
              <p>
                Domestic invoices within Nepal are issued in Nepalese Rupees (NPR) and are subject to applicable Value Added Tax (VAT) and Tax Deducted at Source (TDS) under Nepal’s Income Tax Act, 2058 (2002). International productions settle fees in convertible foreign currency via authorized banking channels compliant with Nepal Rastra Bank (NRB) foreign exchange regulations.
              </p>
              <p>
                <strong>Zero Upfront Fee Pledge:</strong> House of Fashion Nepal never charges aspiring models registration fees, screening charges, or mandatory portfolio fees to apply or join our roster.
              </p>
            </section>

            <section id="labour" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                05. Set Safety &amp; Nepal Labour Standards
              </h2>
              <p>
                All productions engaging House of Fashion Nepal talent must uphold safe, respectful working environments aligned with Nepal’s Labour Act, 2074 (2017):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Standard booking day shall not exceed 8 working hours (including hair, makeup, and wardrobe), with overtime billed per prior agreement.</li>
                <li>Clients must provide private changing areas, nutritious meals on full-day sets, safe transport for late-evening wraps across all shoot locations in Nepal, and proper thermal/altitude gear for Himalayan location shoots (e.g., Mustang, Pokhara, or Langtang).</li>
                <li>House of Fashion Nepal maintains zero tolerance for harassment, unapproved wardrobe changes, or unsafe set conditions; an agency representative may withdraw talent immediately with full fee payable if safety standards are breached.</li>
              </ul>
            </section>

            <section id="eligibility" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                06. Age Eligibility &amp; Portfolio Showcase Notice
              </h2>
              <p>
                Online model applications through this website are strictly open to individuals aged 18 years or older, consistent with legal contractual capacity under the Muluki Civil Code, 2074 and child protection standards under the Children’s Act, 2075 (2018) of Nepal.
              </p>
              <p>
                Please note that sample model profiles and editorial portfolios presented in this digital showcase depict curated fictional talent for platform demonstration and do not represent real private individuals.
              </p>
            </section>

            <section id="force-majeure" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                07. Force Majeure &amp; Himalayan Location Contingencies
              </h2>
              <p>
                Neither House of Fashion Nepal nor the client shall be liable for delays caused by events beyond reasonable control in Nepal, including severe monsoon disruptions, mountain flight cancellations, seismic activity, public strikes (bandhs), or government directives. In such events, both parties agree to cooperate in good faith on weather-day rescheduling.
              </p>
            </section>

            <section id="governing-law" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                08. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms &amp; Conditions are governed by and construed exclusively under the laws of the Federal Democratic Republic of Nepal, including the Muluki Civil Code, 2074 (2017). Any dispute arising out of bookings, licensing, or website use shall first be addressed through amicable negotiation in Lalitpur within 15 days, failing which it shall be resolved by arbitration in Kathmandu under the Arbitration Act, 2055 (1999) or before the competent courts of Lalitpur / Kathmandu, Nepal.
              </p>
              <div className="p-5 sm:p-6 bg-[#F5F1EA] border border-[#101010]/15 text-sm space-y-1.5 mt-4">
                <p className="font-medium text-[#101010]">
                  Legal &amp; Commercial Desk — House of Fashion Nepal Pvt. Ltd.
                </p>
                <p>Jhamsikhel Atelier Wing, Ward 3, Lalitpur 44700, Nepal</p>
                <p className="break-all sm:break-normal">
                  Email: legal@houseoffashionnepal.com.np · bookings@houseoffashionnepal.com.np
                </p>
                <p className="tabular-nums">Telephone: +977 1 552 8410</p>
              </div>
            </section>
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
