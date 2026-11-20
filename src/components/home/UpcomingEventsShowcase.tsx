import { ArrowRight, CalendarRange, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EVENT_STATUS_LABELS,
  formatEventDate,
  getEventDateBadge,
} from '../../data/mockEvents.ts';
import { useGetEventsQuery } from '../../features/events/eventsApi.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { Reveal } from '../common/MotionPrimitives.tsx';

export function UpcomingEventsShowcase() {
  const { data: upcomingEvents = [] } = useGetEventsQuery({
    timeframe: 'upcoming',
  });

  const spotlightEvents = upcomingEvents.slice(0, 3);

  if (spotlightEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-[#101010] text-[#FAF8F4] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12 md:space-y-14">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/12">
          <div className="space-y-3 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              <CalendarRange className="w-3.5 h-3.5" />
              <span>House of Fashion Nepal · Upcoming Calendar</span>
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-balance">
              Runway Shows, Open Auditions &amp; Salons
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F4]/70 leading-relaxed">
              Reserve front-row accreditation, register for zero-fee nationwide open model castings, or join studio coaching intensives across Kathmandu, Lalitpur, and Pokhara.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FAF8F4] hover:text-[#B6A48D] transition-colors whitespace-nowrap shrink-0 pb-1 border-b border-white/30 hover:border-[#B6A48D]"
          >
            <span>Full Events Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {spotlightEvents.map((evt, idx) => {
            const badge = getEventDateBadge(evt.date);
            return (
              <Reveal key={evt.id} delay={idx * 0.06}>
                <article className="group h-full flex flex-col border border-white/10 bg-white/[0.02]">
                  <Link
                    to={`/events?event=${encodeURIComponent(evt.slug)}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-[#1D1B18]"
                  >
                    <EditorialImage
                      src={evt.coverImage}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-4 left-4 bg-[#101010] text-[#FAF8F4] px-3 py-2 text-center leading-none border border-white/15">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-[#B6A48D]">
                        {badge.month}
                      </span>
                      <span className="block font-serif text-2xl tabular-nums mt-0.5">
                        {badge.day}
                      </span>
                    </div>
                  </Link>

                  <div className="flex-1 p-6 flex flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#FAF8F4]/60">
                        <span className="uppercase tracking-[0.16em] text-[#B6A48D]">
                          {evt.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{EVENT_STATUS_LABELS[evt.status]}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.city}</span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-[26px] leading-[1.15] text-[#FAF8F4] group-hover:text-[#B6A48D] transition-colors">
                        <Link to={`/events?event=${encodeURIComponent(evt.slug)}`}>
                          {evt.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-[#FAF8F4]/70 leading-relaxed">
                        {evt.summary}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-[#FAF8F4]/70">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#B6A48D] shrink-0" />
                        <span className="truncate">
                          {evt.venue} · {formatEventDate(evt.date, evt.endDate)}
                        </span>
                      </p>
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="inline-flex items-center gap-1.5 text-[#B6A48D]">
                          <Ticket className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {evt.entryType}
                            {evt.ticketPrice ? ` · ${evt.ticketPrice}` : ''}
                          </span>
                        </span>
                        <Link
                          to={`/events?event=${encodeURIComponent(evt.slug)}`}
                          className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em] text-[#FAF8F4] group-hover:text-[#B6A48D] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>RSVP</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
