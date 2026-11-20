import {
  ArrowRight,
  CalendarRange,
  Clock,
  MapPin,
  Search,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EditorialImage } from '../components/common/EditorialImage.tsx';
import { Reveal } from '../components/common/MotionPrimitives.tsx';
import { PageTransition } from '../components/common/PageTransition.tsx';
import { SeoHead } from '../components/common/SeoHead.tsx';
import { EventDetailModal } from '../components/events/EventDetailModal.tsx';
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_LABELS,
  formatEventDate,
  getEventDateBadge,
} from '../data/mockEvents.ts';
import { useGetEventsQuery } from '../features/events/eventsApi.ts';
import type { AgencyEvent } from '../types/index.ts';

type TimeframeFilter = 'All' | 'upcoming' | 'past';

const TIMEFRAME_OPTIONS: Array<{ value: TimeframeFilter; label: string }> = [
  { value: 'All', label: 'All Dates' },
  { value: 'upcoming', label: 'Upcoming & Open' },
  { value: 'past', label: 'Past Archive' },
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialTimeframeParam = searchParams.get('timeframe');
  const initialTimeframe: TimeframeFilter =
    initialTimeframeParam === 'upcoming' || initialTimeframeParam === 'past'
      ? initialTimeframeParam
      : 'All';
  const eventSlugParam = searchParams.get('event');

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [timeframe, setTimeframe] = useState<TimeframeFilter>(initialTimeframe);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [focusRegistration, setFocusRegistration] = useState(false);

  const { data: allEvents = [], isLoading } = useGetEventsQuery();

  useEffect(() => {
    const paramCat = searchParams.get('category') || 'All';
    setActiveCategory(paramCat);
  }, [searchParams]);

  useEffect(() => {
    if (!eventSlugParam || allEvents.length === 0) return;
    const match = allEvents.find(
      (evt) => evt.slug === eventSlugParam || evt.id === eventSlugParam,
    );
    if (match) {
      setSelectedEventId(match.id);
      setFocusRegistration(false);
    }
  }, [eventSlugParam, allEvents]);

  const selectedEvent = useMemo(
    () => allEvents.find((evt) => evt.id === selectedEventId) || null,
    [allEvents, selectedEventId],
  );

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    const next = new URLSearchParams(searchParams);
    if (category === 'All') {
      next.delete('category');
    } else {
      next.set('category', category);
    }
    setSearchParams(next, { replace: true });
  };

  const handleTimeframeSelect = (nextTimeframe: TimeframeFilter) => {
    setTimeframe(nextTimeframe);
    const next = new URLSearchParams(searchParams);
    if (nextTimeframe === 'All') {
      next.delete('timeframe');
    } else {
      next.set('timeframe', nextTimeframe);
    }
    setSearchParams(next, { replace: true });
  };

  const openEventModal = (event: AgencyEvent, jumpToRegister = false) => {
    setSelectedEventId(event.id);
    setFocusRegistration(jumpToRegister);
    const next = new URLSearchParams(searchParams);
    next.set('event', event.slug);
    setSearchParams(next, { replace: true });
  };

  const closeEventModal = () => {
    setSelectedEventId(null);
    setFocusRegistration(false);
    const next = new URLSearchParams(searchParams);
    next.delete('event');
    setSearchParams(next, { replace: true });
  };

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allEvents.filter((evt) => {
      if (activeCategory !== 'All' && evt.category !== activeCategory) {
        return false;
      }
      if (timeframe === 'upcoming') {
        if (evt.status === 'completed' || evt.status === 'cancelled') {
          return false;
        }
      } else if (timeframe === 'past') {
        if (evt.status !== 'completed' && evt.status !== 'cancelled') {
          return false;
        }
      }
      if (q) {
        const haystack = [
          evt.title,
          evt.category,
          evt.venue,
          evt.city,
          evt.summary,
          evt.entryType,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allEvents, activeCategory, timeframe, searchQuery]);

  const flagshipEvent = useMemo(() => {
    if (activeCategory !== 'All' || timeframe === 'past' || searchQuery.trim()) {
      return null;
    }
    return (
      allEvents.find(
        (evt) =>
          evt.featured &&
          evt.status !== 'completed' &&
          evt.status !== 'cancelled',
      ) || null
    );
  }, [allEvents, activeCategory, timeframe, searchQuery]);

  const gridEvents = useMemo(() => {
    if (!flagshipEvent) return filteredEvents;
    return filteredEvents.filter((evt) => evt.id !== flagshipEvent.id);
  }, [filteredEvents, flagshipEvent]);

  const upcomingCount = allEvents.filter(
    (e) => e.status !== 'completed' && e.status !== 'cancelled',
  ).length;
  const openRegistrationCount = allEvents.filter(
    (e) =>
      e.registrationOpen &&
      e.status !== 'completed' &&
      e.status !== 'cancelled' &&
      e.status !== 'sold-out',
  ).length;
  const hostCitiesCount = new Set(allEvents.map((e) => e.city)).size;

  return (
    <PageTransition>
      <SeoHead
        title="Events, Fashion Shows & Model Auditions — House of Fashion Nepal"
        description="Explore upcoming fashion shows, nationwide open model auditions, runway masterclasses, designer salons, and industry galas hosted by House of Fashion Nepal."
        events={allEvents}
      />

      {/* Editorial Dark Hero */}
      <section className="bg-[#101010] text-[#FAF8F4] pt-28 md:pt-36 pb-14 md:pb-20 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              <CalendarRange className="w-3.5 h-3.5" />
              <span>House of Fashion Nepal · Live Calendar &amp; Castings</span>
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98] text-balance">
              Fashion Shows, Auditions &amp; Cultural Salons
            </h1>
            <p className="text-sm sm:text-base text-[#FAF8F4]/75 max-w-2xl leading-relaxed">
              From flagship couture runways in Patan to zero-fee regional open model auditions across Nepal, reserve accredited seats, register to walk, or explore our archived productions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-2xl">
            <div>
              <p className="font-serif text-3xl sm:text-4xl tabular-nums text-[#FAF8F4]">
                {upcomingCount}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#B6A48D] mt-1">
                Upcoming Events
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl tabular-nums text-[#FAF8F4]">
                {openRegistrationCount}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#B6A48D] mt-1">
                Open Registrations
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl tabular-nums text-[#FAF8F4]">
                {hostCitiesCount}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#B6A48D] mt-1">
                Host Cities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Event Spotlight */}
      {flagshipEvent && (
        <section className="py-14 md:py-20 bg-[#FAF8F4] border-b border-[#101010]/10">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] bg-[#E9E4DB] overflow-hidden group">
                <EditorialImage
                  src={flagshipEvent.coverImage}
                  alt={flagshipEvent.title}
                  priority
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                {(() => {
                  const badge = getEventDateBadge(flagshipEvent.date);
                  return (
                    <div className="absolute top-5 left-5 bg-[#101010] text-[#FAF8F4] px-4 py-2.5 text-center leading-none border border-white/15">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-[#B6A48D]">
                        {badge.month}
                      </span>
                      <span className="block font-serif text-3xl tabular-nums mt-0.5">
                        {badge.day}
                      </span>
                      <span className="block font-mono text-[10px] text-[#FAF8F4]/60 mt-0.5">
                        {badge.year}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#101010]/60">
                    <span className="uppercase tracking-[0.18em] text-[#632B37] font-medium">
                      Flagship Programme
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase tracking-[0.14em]">
                      {flagshipEvent.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{EVENT_STATUS_LABELS[flagshipEvent.status]}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-[#101010]">
                    {flagshipEvent.title}
                  </h2>

                  <p className="text-sm sm:text-base text-[#101010]/75 leading-relaxed">
                    {flagshipEvent.summary}
                  </p>
                </div>

                <div className="space-y-2.5 py-4 border-y border-[#101010]/12 text-xs text-[#101010]/80">
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                    <span className="tabular-nums">
                      {formatEventDate(flagshipEvent.date, flagshipEvent.endDate)} ·{' '}
                      {flagshipEvent.startTime}
                      {flagshipEvent.endTime ? ` – ${flagshipEvent.endTime}` : ''}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                    <span>
                      {flagshipEvent.venue}, {flagshipEvent.city}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                    <span>
                      {flagshipEvent.entryType}
                      {flagshipEvent.ticketPrice
                        ? ` · ${flagshipEvent.ticketPrice}`
                        : ''}
                    </span>
                  </p>
                </div>

                {/* Live Capacity Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#101010]/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#632B37]" />
                      <span>Accredited &amp; Registered</span>
                    </span>
                    <span className="font-mono tabular-nums">
                      {flagshipEvent.registeredCount ?? flagshipEvent.baseRegisteredCount}{' '}
                      / {flagshipEvent.capacity}
                    </span>
                  </div>
                  <div className="h-1 bg-[#101010]/12 overflow-hidden">
                    <div
                      className="h-full bg-[#632B37]"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((flagshipEvent.registeredCount ??
                              flagshipEvent.baseRegisteredCount) /
                              Math.max(1, flagshipEvent.capacity)) *
                              100,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => openEventModal(flagshipEvent, true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>
                      {flagshipEvent.category === 'Audition & Casting'
                        ? 'Register for Audition'
                        : 'Reserve Seat / RSVP'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEventModal(flagshipEvent, false)}
                    className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#101010]/25 text-xs uppercase tracking-[0.16em] hover:border-[#101010] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Inspect Programme</span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Filter Toolbar & Events Grid */}
      <section className="py-14 md:py-20 bg-[#F5F1EA] text-[#101010]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          {/* Controls Bar */}
          <div className="space-y-5 pb-6 border-b border-[#101010]/12">
            {/* Category Tabs */}
            <div
              role="tablist"
              aria-label="Filter events by category"
              className="flex items-center gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap"
            >
              {(['All', ...EVENT_CATEGORIES] as const).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#101010] text-[#FAF8F4] border-[#101010]'
                        : 'bg-[#FAF8F4] text-[#101010]/75 border-[#101010]/15 hover:border-[#101010]'
                    }`}
                  >
                    {cat === 'All' ? 'All Events' : cat}
                  </button>
                );
              })}
            </div>

            {/* Timeframe + Search Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="inline-flex items-center border border-[#101010]/15 bg-[#FAF8F4] self-start">
                {TIMEFRAME_OPTIONS.map((opt) => {
                  const active = timeframe === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleTimeframeSelect(opt.value)}
                      className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#632B37] text-[#FAF8F4]'
                          : 'text-[#101010]/70 hover:text-[#101010]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#101010]/45 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search venue, city, or event title..."
                  aria-label="Search events"
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#101010]/50 hover:text-[#101010]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid States */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F4] border border-[#101010]/10 p-5 space-y-4 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#E9E4DB]" />
                  <div className="h-3 w-1/2 bg-[#E9E4DB]" />
                  <div className="h-7 w-4/5 bg-[#E9E4DB]" />
                  <div className="h-12 w-full bg-[#E9E4DB]" />
                </div>
              ))}
            </div>
          ) : gridEvents.length === 0 ? (
            <div className="py-16 px-6 bg-[#FAF8F4] border border-[#101010]/15 text-center space-y-4">
              <p className="font-serif text-3xl text-[#101010]">
                No events match your current filter
              </p>
              <p className="text-sm text-[#101010]/65 max-w-md mx-auto">
                Reset category or date filters to view all upcoming runways, auditions, masterclasses, and archived programmes.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleCategorySelect('All');
                  handleTimeframeSelect('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {gridEvents.map((evt, idx) => {
                const badge = getEventDateBadge(evt.date);
                const regCount = evt.registeredCount ?? evt.baseRegisteredCount;
                const fillPct = Math.min(
                  100,
                  Math.round((regCount / Math.max(1, evt.capacity)) * 100),
                );
                const canBook =
                  evt.registrationOpen &&
                  evt.status !== 'completed' &&
                  evt.status !== 'cancelled' &&
                  evt.status !== 'sold-out';

                return (
                  <Reveal key={evt.id} delay={idx * 0.04}>
                    <article className="group h-full bg-[#FAF8F4] border border-[#101010]/12 flex flex-col">
                      <button
                        type="button"
                        onClick={() => openEventModal(evt, false)}
                        className="relative block w-full aspect-[4/3] overflow-hidden bg-[#E9E4DB] text-left cursor-pointer"
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
                      </button>

                      <div className="flex-1 p-6 flex flex-col justify-between gap-5">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#101010]/60">
                            <span className="uppercase tracking-[0.16em] text-[#632B37] font-medium">
                              {evt.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{EVENT_STATUS_LABELS[evt.status]}</span>
                            <span aria-hidden="true">·</span>
                            <span>{evt.city}</span>
                          </div>

                          <h3 className="font-serif text-2xl sm:text-[26px] leading-[1.14] text-[#101010] group-hover:text-[#632B37] transition-colors">
                            <button
                              type="button"
                              onClick={() => openEventModal(evt, false)}
                              className="text-left cursor-pointer"
                            >
                              {evt.title}
                            </button>
                          </h3>

                          <p className="text-sm text-[#101010]/70 leading-relaxed">
                            {evt.summary}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5 pt-4 border-t border-[#101010]/10 text-xs text-[#101010]/75">
                            <p className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                              <span className="tabular-nums truncate">
                                {formatEventDate(evt.date, evt.endDate)} · {evt.startTime}
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                              <span className="truncate">{evt.venue}</span>
                            </p>
                            <p className="flex items-center justify-between gap-2 pt-1">
                              <span className="inline-flex items-center gap-1.5">
                                <Ticket className="w-3.5 h-3.5 text-[#632B37] shrink-0" />
                                <span>
                                  {evt.entryType}
                                  {evt.ticketPrice ? ` · ${evt.ticketPrice}` : ''}
                                </span>
                              </span>
                              <span className="font-mono text-[11px] tabular-nums text-[#101010]/55">
                                {regCount}/{evt.capacity}
                              </span>
                            </p>
                            <div className="h-0.5 bg-[#101010]/10 overflow-hidden">
                              <div
                                className="h-full bg-[#632B37]"
                                style={{ width: `${fillPct}%` }}
                              />
                            </div>
                          </div>

                          {evt.featuredTalent && evt.featuredTalent.length > 0 && (
                            <p className="text-[11px] text-[#101010]/60 truncate">
                              Featuring:{' '}
                              {evt.featuredTalent.map((t, i) => (
                                <span key={t.id}>
                                  <Link
                                    to={`/models/${t.slug}`}
                                    className="text-[#101010] hover:text-[#632B37] underline underline-offset-2"
                                  >
                                    {t.name}
                                  </Link>
                                  {i < evt.featuredTalent!.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#101010]/10">
                            <button
                              type="button"
                              onClick={() => openEventModal(evt, false)}
                              className="text-xs uppercase tracking-[0.16em] text-[#101010]/75 hover:text-[#101010] transition-colors whitespace-nowrap cursor-pointer"
                            >
                              Programme
                            </button>
                            <button
                              type="button"
                              onClick={() => openEventModal(evt, canBook)}
                              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors whitespace-nowrap cursor-pointer ${
                                canBook
                                  ? 'bg-[#101010] text-[#FAF8F4] hover:bg-[#632B37]'
                                  : 'border border-[#101010]/20 text-[#101010]/75 hover:border-[#101010]'
                              }`}
                            >
                              <span>
                                {canBook
                                  ? evt.category === 'Audition & Casting'
                                    ? 'Audition RSVP'
                                    : 'Register'
                                  : 'View Archive'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Co-Host & Talent CTA Strip */}
      <section className="py-16 md:py-24 bg-[#101010] text-[#FAF8F4] border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[#B6A48D]">
              Sponsorships, Show Production &amp; Scouting
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.06]">
              Co-Host a Runway Showcase or Private Casting in Nepal
            </h2>
            <p className="text-sm sm:text-base text-[#FAF8F4]/70 leading-relaxed">
              Partner with House of Fashion Nepal for full-scale runway choreography, venue production, backstage talent management, or regional open scouting activations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FAF8F4] text-[#101010] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#B6A48D] transition-colors whitespace-nowrap"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/become-a-model"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/30 text-[#FAF8F4] text-xs uppercase tracking-[0.18em] hover:border-[#FAF8F4] transition-colors whitespace-nowrap"
            >
              <span>Apply Online</span>
            </Link>
          </div>
        </div>
      </section>

      <EventDetailModal
        event={selectedEvent}
        focusRegistration={focusRegistration}
        onClose={closeEventModal}
      />
    </PageTransition>
  );
}
