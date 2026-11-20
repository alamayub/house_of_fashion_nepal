import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Shirt,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import {
  EVENT_STATUS_LABELS,
  formatEventDate,
  getEventDateBadge,
} from '../../data/mockEvents.ts';
import { useCreateEventRegistrationMutation } from '../../features/events/eventsApi.ts';
import type {
  AgencyEvent,
  EventRegistrationRecord,
  EventRegistrationRole,
} from '../../types/index.ts';
import { EditorialImage } from '../common/EditorialImage.tsx';
import { SearchableSelect } from '../common/SearchableSelect.tsx';

const REGISTRATION_ROLES: EventRegistrationRole[] = [
  'Attendee / Guest',
  'Aspiring Model (Audition)',
  'Designer / Brand',
  'Press & Media',
  'Sponsor / VIP',
];

const registrationSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please provide a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a reachable phone or WhatsApp number.'),
  role: z.enum([
    'Attendee / Guest',
    'Aspiring Model (Audition)',
    'Designer / Brand',
    'Press & Media',
    'Sponsor / VIP',
  ]),
  organizationOrInstagram: z.string().trim().optional(),
  notes: z.string().trim().max(500, 'Please keep notes under 500 characters.').optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface EventDetailModalProps {
  event: AgencyEvent | null;
  onClose: () => void;
  focusRegistration?: boolean;
}

export function EventDetailModal({
  event,
  onClose,
  focusRegistration = false,
}: EventDetailModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [createRegistration, { isLoading: submitting }] =
    useCreateEventRegistrationMutation();
  const [submittedRecord, setSubmittedRecord] =
    useState<EventRegistrationRecord | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultRole: EventRegistrationRole =
    event?.category === 'Audition & Casting'
      ? 'Aspiring Model (Audition)'
      : 'Attendee / Guest';

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: defaultRole,
      organizationOrInstagram: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!event) return;
    setSubmittedRecord(null);
    setSubmitError(null);
    reset({
      fullName: '',
      email: '',
      phone: '',
      role:
        event.category === 'Audition & Casting'
          ? 'Aspiring Model (Audition)'
          : 'Attendee / Guest',
      organizationOrInstagram: '',
      notes: '',
    });
  }, [event, reset]);

  useEffect(() => {
    if (!event) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [event, onClose]);

  useEffect(() => {
    if (event && focusRegistration) {
      const timer = window.setTimeout(() => {
        const el = document.getElementById('event-reg-fullname');
        el?.focus();
      }, 180);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [event, focusRegistration]);

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!event) return;
    setSubmitError(null);
    try {
      const record = await createRegistration({
        eventId: event.id,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        organizationOrInstagram: values.organizationOrInstagram || undefined,
        notes: values.notes || undefined,
      }).unwrap();
      setSubmittedRecord(record);
    } catch (err) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Unable to submit registration right now. Please try again.';
      setSubmitError(message);
    }
  };

  const canRegister =
    event !== null &&
    event.registrationOpen &&
    event.status !== 'completed' &&
    event.status !== 'cancelled' &&
    event.status !== 'sold-out';

  const registeredCount = event
    ? event.registeredCount ?? event.baseRegisteredCount
    : 0;
  const capacity = event?.capacity || 1;
  const fillPercent = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const spotsLeft = Math.max(0, capacity - registeredCount);
  const dateBadge = event ? getEventDateBadge(event.date) : null;

  const labelClass =
    'block text-[11px] uppercase tracking-[0.16em] text-[#101010]/65 mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] focus:outline-none focus:border-[#632B37]';

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-detail-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-50 bg-[#101010]/75 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 18, scale: 0.99 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.99 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[92dvh] bg-[#FAF8F4] text-[#101010] border border-[#101010]/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Top Bar */}
            <div className="shrink-0 px-5 sm:px-8 py-4 border-b border-[#101010]/12 bg-[#FAF8F4] flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#632B37] min-w-0">
                <span>{event.category}</span>
                <span aria-hidden="true" className="text-[#101010]/30">
                  ·
                </span>
                <span className="text-[#101010]/70">
                  {EVENT_STATUS_LABELS[event.status]}
                </span>
                <span aria-hidden="true" className="text-[#101010]/30">
                  ·
                </span>
                <span className="font-mono text-[#101010]/55">{event.id}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close event details"
                className="p-2 -mr-2 text-[#101010]/65 hover:text-[#101010] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column: Editorial Programme Details */}
                <div className="lg:col-span-7 p-5 sm:p-8 space-y-6 lg:border-r border-[#101010]/12">
                  <div className="relative aspect-[16/9] bg-[#E9E4DB] overflow-hidden">
                    <EditorialImage
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {dateBadge && (
                      <div className="absolute top-4 left-4 bg-[#101010] text-[#FAF8F4] px-3.5 py-2 text-center leading-none border border-white/15">
                        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#B6A48D]">
                          {dateBadge.month}
                        </span>
                        <span className="block font-serif text-2xl tabular-nums mt-0.5">
                          {dateBadge.day}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h2
                      id="event-detail-title"
                      className="font-serif text-3xl sm:text-4xl leading-[1.08] text-[#101010]"
                    >
                      {event.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#101010]/80 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Key Logistics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-[#101010]/12 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                      <div>
                        <p className="uppercase tracking-[0.14em] text-[#101010]/50 text-[10px]">
                          Date
                        </p>
                        <p className="text-sm text-[#101010] font-medium mt-0.5">
                          {formatEventDate(event.date, event.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                      <div>
                        <p className="uppercase tracking-[0.14em] text-[#101010]/50 text-[10px]">
                          Schedule
                        </p>
                        <p className="text-sm text-[#101010] font-medium mt-0.5 tabular-nums">
                          {event.startTime}
                          {event.endTime ? ` – ${event.endTime}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                      <div>
                        <p className="uppercase tracking-[0.14em] text-[#101010]/50 text-[10px]">
                          Venue
                        </p>
                        <p className="text-sm text-[#101010] font-medium mt-0.5">
                          {event.venue}, {event.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Ticket className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                      <div>
                        <p className="uppercase tracking-[0.14em] text-[#101010]/50 text-[10px]">
                          Entry &amp; Access
                        </p>
                        <p className="text-sm text-[#101010] font-medium mt-0.5">
                          {event.entryType}
                          {event.ticketPrice ? ` · ${event.ticketPrice}` : ''}
                        </p>
                      </div>
                    </div>

                    {event.dressCode && (
                      <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-[#101010]/10">
                        <Shirt className="w-4 h-4 text-[#632B37] shrink-0 mt-0.5" />
                        <div>
                          <p className="uppercase tracking-[0.14em] text-[#101010]/50 text-[10px]">
                            Dress Code &amp; Casting Attire
                          </p>
                          <p className="text-sm text-[#101010] mt-0.5">
                            {event.dressCode}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Highlights */}
                  {event.highlights.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                        Programme Highlights
                      </p>
                      <ul className="space-y-2 text-sm text-[#101010]/80">
                        {event.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-px bg-[#632B37] shrink-0"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Featured Represented Talent */}
                  {event.featuredTalent && event.featuredTalent.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-[#101010]/12">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                        Featured House of Fashion Nepal Talent
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {event.featuredTalent.map((talent) => (
                          <Link
                            key={talent.id}
                            to={`/models/${talent.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-2.5 pr-3 bg-[#F5F1EA] border border-[#101010]/15 hover:border-[#632B37] transition-colors"
                          >
                            <EditorialImage
                              src={talent.coverImage}
                              alt={talent.name}
                              containerClassName="w-9 h-10 shrink-0"
                              className="w-full h-full object-cover"
                            />
                            <span className="text-xs font-medium text-[#101010]">
                              {talent.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Live RSVP / Audition Registration Desk */}
                <div className="lg:col-span-5 p-5 sm:p-8 bg-[#F5F1EA] flex flex-col justify-between gap-6">
                  <div className="space-y-6">
                    {/* Capacity Meter */}
                    <div className="pb-5 border-b border-[#101010]/12 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-[#101010]/65">
                          <Users className="w-3.5 h-3.5 text-[#632B37]" />
                          <span>Guestlist Capacity</span>
                        </span>
                        <span className="font-mono tabular-nums text-[#101010]">
                          {registeredCount} / {capacity}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-[#101010]/12 overflow-hidden">
                        <div
                          className="h-full bg-[#632B37] transition-all duration-300"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#101010]/60 tabular-nums">
                        {event.status === 'completed'
                          ? 'Concluded event archive.'
                          : spotsLeft > 0
                            ? `${spotsLeft} ${spotsLeft === 1 ? 'place' : 'places'} currently remaining.`
                            : 'Primary capacity reached — new registrations join the priority waitlist.'}
                      </p>
                    </div>

                    {submittedRecord ? (
                      <div className="p-6 bg-[#FAF8F4] border border-[#101010]/20 space-y-4">
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#632B37]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {submittedRecord.status === 'waitlisted'
                              ? 'Priority Waitlist Logged'
                              : 'Registration Confirmed'}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl leading-tight text-[#101010]">
                          We have received your seat request, {submittedRecord.fullName}.
                        </h3>
                        <p className="text-sm text-[#101010]/75 leading-relaxed">
                          {submittedRecord.status === 'waitlisted'
                            ? 'This event has reached full capacity, so our Events Desk has placed you on the priority waitlist and will reach out if a seat opens.'
                            : 'Our Events & Casting Desk will email your entry pass or audition slot confirmation ahead of the event date.'}
                        </p>
                        <div className="p-3.5 bg-[#F5F1EA] border border-[#101010]/12 space-y-1 text-xs">
                          <p className="font-mono text-[#632B37]">
                            Reference: {submittedRecord.id}
                          </p>
                          <p className="text-[#101010]/80">
                            Role: {submittedRecord.role}
                          </p>
                          <p className="text-[#101010]/65">
                            {formatEventDate(event.date, event.endDate)} · {event.venue}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSubmittedRecord(null)}
                            className="px-4 py-2 border border-[#101010]/25 text-xs uppercase tracking-[0.15em] hover:border-[#101010] transition-colors cursor-pointer"
                          >
                            Register Another Guest
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.15em] hover:bg-[#632B37] transition-colors cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ) : canRegister ? (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="space-y-4"
                      >
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                            {event.category === 'Audition & Casting'
                              ? 'Open Casting Sign-Up'
                              : 'RSVP & Accreditation'}
                          </p>
                          <h3 className="font-serif text-2xl text-[#101010] mt-0.5">
                            {event.category === 'Audition & Casting'
                              ? 'Reserve Your Audition Slot'
                              : 'Request Entry / Seat'}
                          </h3>
                        </div>

                        <div>
                          <label htmlFor="event-reg-fullname" className={labelClass}>
                            Full Name *
                          </label>
                          <input
                            id="event-reg-fullname"
                            type="text"
                            {...register('fullName')}
                            placeholder="e.g., Srijana Rai"
                            className={inputClass}
                          />
                          {errors.fullName && (
                            <p className="text-xs text-[#632B37] mt-1">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label htmlFor="event-reg-email" className={labelClass}>
                              Email *
                            </label>
                            <input
                              id="event-reg-email"
                              type="email"
                              {...register('email')}
                              placeholder="name@domain.com"
                              className={inputClass}
                            />
                            {errors.email && (
                              <p className="text-xs text-[#632B37] mt-1">
                                {errors.email.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="event-reg-phone" className={labelClass}>
                              Phone / WhatsApp *
                            </label>
                            <input
                              id="event-reg-phone"
                              type="tel"
                              {...register('phone')}
                              placeholder="+977 98..."
                              className={inputClass}
                            />
                            {errors.phone && (
                              <p className="text-xs text-[#632B37] mt-1">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="event-reg-role" className={labelClass}>
                            Attending As *
                          </label>
                          <Controller
                            control={control}
                            name="role"
                            render={({ field }) => (
                              <SearchableSelect
                                id="event-reg-role"
                                value={field.value}
                                onChange={field.onChange}
                                options={REGISTRATION_ROLES.map((role) => ({
                                  value: role,
                                  label: role,
                                }))}
                                searchPlaceholder="Select attendance role..."
                                tone="ivory"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label htmlFor="event-reg-org" className={labelClass}>
                            {event.category === 'Audition & Casting'
                              ? 'Instagram Handle or Height / City'
                              : 'Brand, Publication, or Instagram'}
                          </label>
                          <input
                            id="event-reg-org"
                            type="text"
                            {...register('organizationOrInstagram')}
                            placeholder={
                              event.category === 'Audition & Casting'
                                ? 'e.g., @yourhandle · 176 cm · Lalitpur'
                                : 'e.g., Atelier name or @handle'
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label htmlFor="event-reg-notes" className={labelClass}>
                            Notes or Seating / Slot Preference
                          </label>
                          <textarea
                            id="event-reg-notes"
                            rows={2}
                            {...register('notes')}
                            placeholder="Optional notes for our events or scouting desk..."
                            className={inputClass}
                          />
                          {errors.notes && (
                            <p className="text-xs text-[#632B37] mt-1">
                              {errors.notes.message}
                            </p>
                          )}
                        </div>

                        {submitError && (
                          <p className="text-xs text-[#632B37]" role="alert">
                            {submitError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors disabled:opacity-60 cursor-pointer"
                        >
                          {submitting
                            ? 'Submitting Registration...'
                            : spotsLeft === 0
                              ? 'Join Priority Waitlist'
                              : event.category === 'Audition & Casting'
                                ? 'Confirm Audition Sign-Up'
                                : 'Submit Event Registration'}
                        </button>
                      </form>
                    ) : (
                      <div className="p-6 bg-[#FAF8F4] border border-[#101010]/15 space-y-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#632B37]">
                          {EVENT_STATUS_LABELS[event.status]}
                        </p>
                        <h3 className="font-serif text-2xl text-[#101010]">
                          {event.status === 'completed'
                            ? 'Archive Programme Record'
                            : 'Registrations Currently Closed'}
                        </h3>
                        <p className="text-sm text-[#101010]/70 leading-relaxed">
                          {event.status === 'completed'
                            ? 'This House of Fashion Nepal programme has already concluded. Contact our production desk for press imagery or upcoming season accreditation.'
                            : 'Direct online registrations for this event are currently closed. Reach out to our events desk for press, sponsorship, or standby inquiries.'}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-1">
                          <Link
                            to="/contact"
                            onClick={onClose}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors"
                          >
                            <span>Contact Events Desk</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-[#101010]/55 leading-relaxed border-t border-[#101010]/10 pt-4">
                    House of Fashion Nepal never charges scouting or open-audition fees. For press passes or brand table sponsorships, email events@houseoffashionnepal.com.np.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
