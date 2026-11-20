import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';

const SECTIONS = [
  { id: 'scope', title: '01. Scope & Agency Identity' },
  { id: 'collection', title: '02. Personal Data We Collect' },
  { id: 'consent', title: '03. Consent & Bodily Autonomy' },
  { id: 'purpose', title: '04. Lawful Purpose & Tax Compliance' },
  { id: 'cross-border', title: '05. International Placements' },
  { id: 'retention', title: '06. Security & Retention' },
  { id: 'rights', title: '07. Your Rights Under Nepalese Law' },
  { id: 'grievance', title: '08. Privacy & Grievance Officer' },
];

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <SeoHead
        title="Privacy Policy — Nepal Data Protection"
        description="Privacy Policy for House of Fashion Nepal Pvt. Ltd., aligned with Nepal's Individual Privacy Act, 2075 and Electronic Transactions Act, 2063."
      />

      {/* Editorial Header */}
      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 md:pb-20 bg-[#F5F1EA] text-[#101010] border-b border-[#101010]/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-4">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#632B37] mb-3">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Legal &amp; Governance · Nepal</span>
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98]">
              Privacy Policy
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.16em] text-[#101010]/60 pt-4">
              <span>Effective: November 2026</span>
              <span aria-hidden="true">·</span>
              <span>Jurisdiction: Federal Democratic Republic of Nepal</span>
              <span aria-hidden="true">·</span>
              <span>Individual Privacy Act, 2075 (2018)</span>
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
                Contents
              </p>
              <nav aria-label="Privacy policy sections" className="flex flex-col space-y-2.5">
                {SECTIONS.map((sec) => (
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
                  to="/terms-and-conditions"
                  className="group inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#632B37]"
                >
                  <span>Read Terms &amp; Conditions</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </aside>

          {/* Main Reading Column */}
          <article className="lg:col-span-8 max-w-2xl space-y-12 text-sm sm:text-base text-[#101010]/80 leading-[1.8]">
            <div className="pb-8 border-b border-[#101010]/10">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                House of Fashion Nepal Pvt. Ltd. (“House of Fashion Nepal”, “we”, “our”) is committed to safeguarding the personal dignity, bodily autonomy, and digital privacy of every model, scouting applicant, production partner, and visitor interacting with our studio operations across Nepal and our online platform, in strict accordance with the Individual Privacy Act, 2075 (2018) (वैयक्तिक गोपनीयता सम्बन्धी ऐन, २०७५), the Individual Privacy Regulation, 2077 (2020), and the Electronic Transactions Act, 2063 (2008) of Nepal.
              </p>
            </div>

            <section id="scope" className="space-y-3 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                01. Scope &amp; Agency Identity
              </h2>
              <p>
                This Privacy Policy applies to all personal information collected through our website, casting forms, client booking portals, and physical studio operations located at Jhamsikhel Atelier Wing, Ward 3, Lalitpur 44700, Kathmandu Valley, Nepal.
              </p>
              <p>
                Whether you are an aspiring model submitting natural-light digitals, an established talent represented on our boards, or a brand commissioning a commercial campaign in Nepal, this policy explains how your records are collected, stored, disclosed, and protected.
              </p>
            </section>

            <section id="collection" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                02. Personal Data We Collect
              </h2>
              <p>We collect only information strictly relevant to talent representation and production management:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Model Applicants:</strong> Full legal name, email address, phone/WhatsApp number, date of birth (exclusively to verify minimum 18+ legal eligibility), city/district, height, optional weight, experience summary, social/portfolio URLs, and submitted natural-light photographs.
                </li>
                <li>
                  <strong>Represented Talent:</strong> Portfolio images, motion showreels, consented physical measurements, citizenship or passport details (for domestic PAN/TDS tax filing and international work visas), bank account details for artist payouts, and availability schedules.
                </li>
                <li>
                  <strong>Commercial &amp; Editorial Clients:</strong> Contact name, agency or fashion house name, email, telephone, project brief, shoot location, and billing/VAT registration details.
                </li>
              </ul>
            </section>

            <section id="consent" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                03. Consent, Measurements &amp; Bodily Autonomy
              </h2>
              <p>
                Pursuant to the Individual Privacy Act, 2075 of Nepal, personal photographs, likenesses, and biometric or physical attributes are protected personal data. House of Fashion Nepal never demands invasive or unnecessary body measurements during initial casting applications.
              </p>
              <p>
                For signed models, measurements such as bust, chest, waist, hips, weight, and dress size are published on public digital comp cards solely when the model has provided explicit written consent. Exact dates of birth, residential addresses, and government identification records are never displayed publicly and remain restricted to authorized agency directors.
              </p>
            </section>

            <section id="purpose" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                04. Lawful Purpose &amp; Statutory Compliance
              </h2>
              <p>Personal data is processed exclusively for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Reviewing casting applications and scheduling studio or regional casting evaluations across Nepal.</li>
                <li>Presenting curated talent portfolios and availability to vetted clients, production houses, and fashion publications.</li>
                <li>Executing representation agreements, usage licensing contracts, and artist fee settlements.</li>
                <li>Fulfilling statutory tax withholding (TDS), VAT invoicing, and corporate recordkeeping required by Nepal’s Inland Revenue Department (IRD) and Office of the Company Registrar (OCR).</li>
              </ul>
              <p>
                We never sell, rent, or monetize personal contact lists or applicant portfolios to third-party data brokers or unsolicited advertisers.
              </p>
            </section>

            <section id="cross-border" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                05. International Placements &amp; Cross-Border Transfers
              </h2>
              <p>
                When a represented model opts into international placement — such as campaigns or fashion weeks in India, Thailand, Japan, Europe, or the UAE — necessary portfolio assets and travel documentation are shared strictly with accredited partner agencies or production teams under written confidentiality and usage limitations.
              </p>
            </section>

            <section id="retention" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                06. Data Security &amp; Retention
              </h2>
              <p>
                In alignment with the Electronic Transactions Act, 2063 (2008), House of Fashion Nepal implements access controls, encrypted transport, and restricted administrative permissions to protect digital records against unauthorized access, alteration, or unlawful disclosure.
              </p>
              <p>
                Unsuccessful model applications are retained for up to 12 months for seasonal scouting consideration unless earlier deletion is requested. Contractual and tax records are retained for the statutory period mandated under Nepalese revenue law.
              </p>
            </section>

            <section id="rights" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                07. Your Rights Under Nepalese Law
              </h2>
              <p>Under the Individual Privacy Act, 2075, you hold the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Request confirmation and a copy of the personal data House of Fashion Nepal holds about you.</li>
                <li>Request immediate correction of inaccurate measurements, credits, or contact records.</li>
                <li>Withdraw consent for public display of specific portfolio photographs, showreels, or physical statistics at any time.</li>
                <li>Request deletion of your application snapshots and personal profile from our active systems, subject to existing contractual or statutory obligations.</li>
              </ul>
            </section>

            <section id="grievance" className="space-y-3 pt-8 border-t border-[#101010]/10 scroll-mt-28">
              <h2 className="font-serif text-3xl text-[#101010]">
                08. Privacy &amp; Grievance Officer
              </h2>
              <p>
                To exercise any privacy right, withdraw portfolio consent, or file a data protection concern, please contact our designated Privacy &amp; Compliance Desk:
              </p>
              <div className="p-5 sm:p-6 bg-[#F5F1EA] border border-[#101010]/15 text-sm space-y-1.5">
                <p className="font-medium text-[#101010]">
                  Privacy &amp; Compliance Officer — House of Fashion Nepal Pvt. Ltd.
                </p>
                <p>Jhamsikhel Atelier Wing, Ward 3, Lalitpur 44700, Nepal</p>
                <p className="break-all sm:break-normal">Email: privacy@houseoffashionnepal.com.np</p>
                <p className="tabular-nums">Telephone: +977 1 552 8410</p>
              </div>
              <p className="text-xs text-[#101010]/60 pt-2">
                Verified requests are acknowledged within 3 working days and resolved within 15 working days.
              </p>
            </section>
          </article>
        </div>
      </section>
    </PageTransition>
  );
}
