import { Calendar, ClipboardCheck, FileCheck2, Mail, Phone } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EditorialFaq } from '../components/common/EditorialFaq.tsx';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { BookingForm } from '../components/forms/BookingForm.tsx';
import { PRODUCTION_FAQS } from '../data/agencyContent.ts';
import { useGetModelsQuery } from '../features/models/modelsApi.ts';

const BOOKING_PROCESS = [
  {
    step: '01',
    title: 'Brief & Talent Selection',
    body: 'Choose one or multiple models from our active roster, select a preferred gender board, or request a curated casting shortlist tailored to your campaign.',
    icon: ClipboardCheck,
  },
  {
    step: '02',
    title: 'Option Hold & Rate Card',
    body: 'Our Nepal bookings desk confirms availability within 24 hours and issues transparent day rates plus territorial usage licensing.',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Confirmation & Call Sheet',
    body: 'Once confirmed in writing, we coordinate fittings, wardrobe prep, and on-set call times across Nepal or abroad.',
    icon: FileCheck2,
  },
];

export default function BookModel() {
  const [searchParams] = useSearchParams();
  const modelSlugParam = searchParams.get('model') || undefined;
  const { data: modelsData } = useGetModelsQuery({ limit: 50 });

  const matchedModel = modelSlugParam
    ? modelsData?.data.find((m) => m.slug === modelSlugParam)
    : undefined;

  return (
    <PageTransition>
      <SeoHead
        title={
          matchedModel
            ? `Book ${matchedModel.name} — Availability & Casting`
            : 'Book a Model — Talent Availability & Casting'
        }
        description={
          matchedModel
            ? `Request booking dates, usage rates, and shoot availability for ${matchedModel.name} via House of Fashion Nepal.`
            : 'Reserve fashion, editorial, runway, or commercial models from House of Fashion Nepal across Nepal.'
        }
        canonicalPath="/book"
        faqs={PRODUCTION_FAQS}
        image={matchedModel?.coverImage}
      />

      <section className="pt-24 sm:pt-28 md:pt-36 pb-14 sm:pb-16 bg-[#101010] text-[#FAF8F4]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Reveal className="space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              Nepal Bookings Desk · Commercial &amp; Editorial
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[0.98] max-w-4xl">
              Book a Model
            </h1>
            <p className="text-base sm:text-lg text-[#FAF8F4]/75 max-w-2xl leading-relaxed">
              Request talent availability, place a provisional shoot option, or commission bespoke casting across Nepal and international markets.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[#FAF8F4] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-4 space-y-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#632B37]">
                How Bookings Work
              </p>
              <h2 className="font-serif text-3xl text-[#101010]">
                Production Workflow
              </h2>
            </div>

            <div className="space-y-6">
              {BOOKING_PROCESS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="pt-4 border-t border-[#101010]/15 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#632B37]">
                      <span className="font-mono">{item.step}</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-xl text-[#101010]">{item.title}</h3>
                    <p className="text-sm text-[#101010]/70 leading-relaxed">{item.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-[#F5F1EA] border border-[#101010]/15 space-y-3 text-xs text-[#101010]/75">
              <p className="uppercase tracking-[0.16em] text-[#632B37] font-medium">
                Direct Booking Desk
              </p>
              <p className="inline-flex items-start gap-2 break-all sm:break-normal">
                <Mail className="w-3.5 h-3.5 mt-0.5 text-[#632B37] shrink-0" />
                <span>bookings@houseoffashionnepal.com.np</span>
              </p>
              <p className="flex items-center gap-2 tabular-nums">
                <Phone className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                <span>+977 1 552 8410</span>
              </p>
              <p className="pt-1 leading-relaxed">
                All bookings are governed by our{' '}
                <Link
                  to="/terms-and-conditions"
                  className="underline underline-offset-2 text-[#101010] hover:text-[#632B37]"
                >
                  Terms &amp; Conditions
                </Link>
                . For press or general inquiries, visit our{' '}
                <Link
                  to="/contact"
                  className="underline underline-offset-2 text-[#101010] hover:text-[#632B37]"
                >
                  Contact page
                </Link>
                .
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="mb-8 pb-4 border-b border-[#101010]/15">
              <h2 className="font-serif text-3xl text-[#101010]">
                Booking &amp; Availability Request
              </h2>
              <p className="text-sm text-[#101010]/65 mt-1">
                Complete the production brief below. Our bookers respond within 24 business hours.
              </p>
            </div>

            <BookingForm
              defaultModelSlug={matchedModel?.slug || modelSlugParam}
              defaultModelName={matchedModel?.name}
            />
          </Reveal>
        </div>
      </section>

      <EditorialFaq
        items={PRODUCTION_FAQS}
        kicker="Client & Producer Guide"
        heading="Booking Terms & Usage Questions"
        subheading="Everything production managers need to know regarding multi-model casting, option holds, and territorial licensing."
        tone="paper"
      />
    </PageTransition>
  );
}
