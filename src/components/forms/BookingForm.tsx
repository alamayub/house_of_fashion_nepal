import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateBookingMutation } from '../../features/bookings/bookingsApi.ts';
import { useGetModelsQuery } from '../../features/models/modelsApi.ts';
import { SearchableMultiSelect, SearchableSelect } from '../common/SearchableSelect.tsx';

function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const bookingSchema = z.object({
  clientName: z.string().min(2, 'Please enter your full name'),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone or WhatsApp number'),
  requestedGender: z.string().optional(),
  modelSlugs: z.array(z.string()).optional(),
  projectType: z.string().min(2, 'Select a project type'),
  shootDate: z
    .string()
    .min(1, 'Select a preferred date')
    .refine((val) => val >= getTodayIso(), 'Shoot date cannot be in the past'),
  location: z.string().min(2, 'Enter shoot or event location'),
  details: z.string().min(15, 'Please share a brief overview of your production (min. 15 characters)'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  defaultModelSlug?: string;
  defaultModelName?: string;
  dark?: boolean;
  onSuccess?: () => void;
}

const GENDER_BOARD_OPTIONS = [
  { value: 'Any', label: 'Any Gender / All Boards' },
  { value: 'Female', label: 'Female Models' },
  { value: 'Male', label: 'Male Models' },
  { value: 'Non-Binary', label: 'Non-Binary Models' },
  { value: 'Mixed Ensemble', label: 'Mixed Gender Ensemble' },
];

export function BookingForm({
  defaultModelSlug,
  defaultModelName,
  dark = false,
  onSuccess,
}: BookingFormProps) {
  const { data: modelsData } = useGetModelsQuery({ limit: 50 });
  const [createBooking, { isLoading, error }] = useCreateBookingMutation();
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedTalentLabel, setSubmittedTalentLabel] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const todayIso = useMemo(() => getTodayIso(), []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requestedGender: 'Any',
      modelSlugs: defaultModelSlug ? [defaultModelSlug] : [],
      projectType: 'Editorial & Lookbook',
      location: 'Kathmandu, Nepal',
    },
  });

  useEffect(() => {
    if (defaultModelSlug) {
      setValue('modelSlugs', [defaultModelSlug]);
    }
  }, [defaultModelSlug, setValue]);

  const selectedGender = watch('requestedGender') || 'Any';
  const selectedSlugs = watch('modelSlugs') || [];
  const allActiveModels = modelsData?.data || [];

  const filteredModelOptions = useMemo(() => {
    const specificGenderFilter =
      selectedGender !== 'Any' && selectedGender !== 'Mixed Ensemble'
        ? selectedGender
        : null;

    return allActiveModels
      .filter(
        (m) =>
          !specificGenderFilter ||
          m.gender.toLowerCase() === specificGenderFilter.toLowerCase(),
      )
      .map((m) => ({
        value: m.slug,
        label: m.name,
        hint: `${m.id} · ${m.gender} · ${m.height} cm · ${m.location}`,
      }));
  }, [allActiveModels, selectedGender]);

  const selectedModelsList = useMemo(
    () =>
      selectedSlugs.map((slug) => {
        const found = allActiveModels.find((m) => m.slug === slug);
        return {
          slug,
          name:
            found?.name ||
            (slug === defaultModelSlug && defaultModelName
              ? defaultModelName
              : slug),
        };
      }),
    [selectedSlugs, allActiveModels, defaultModelSlug, defaultModelName],
  );

  const onSubmit = async (values: BookingFormValues) => {
    const chosenSlugs = values.modelSlugs || [];
    const chosenNames = chosenSlugs.map((slug) => {
      const matched = allActiveModels.find((m) => m.slug === slug);
      return (
        matched?.name ||
        (slug === defaultModelSlug && defaultModelName ? defaultModelName : slug)
      );
    });

    try {
      const result = await createBooking({
        clientName: values.clientName,
        companyName: values.companyName || undefined,
        email: values.email,
        phone: values.phone,
        requestedGender:
          values.requestedGender && values.requestedGender !== 'Any'
            ? values.requestedGender
            : undefined,
        modelSlugs: chosenSlugs.length > 0 ? chosenSlugs : undefined,
        modelNames: chosenNames.length > 0 ? chosenNames : undefined,
        modelSlug: chosenSlugs[0] || undefined,
        modelName: chosenNames.length > 0 ? chosenNames.join(', ') : undefined,
        projectType: values.projectType,
        shootDate: values.shootDate,
        location: values.location,
        details: values.details,
      }).unwrap();

      setSubmittedRef(result.id);
      setSubmittedTalentLabel(
        chosenNames.length > 0 ? chosenNames.join(', ') : null,
      );
      reset({
        requestedGender: 'Any',
        modelSlugs: defaultModelSlug ? [defaultModelSlug] : [],
        projectType: 'Editorial & Lookbook',
        location: 'Kathmandu, Nepal',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      // Error feedback rendered cleanly via RTK Query error state
    }
  };

  const labelClass = `block text-xs uppercase tracking-[0.16em] mb-2 ${
    dark ? 'text-[#B6A48D]' : 'text-[#101010]/70'
  }`;

  const inputClass = `w-full px-3.5 py-2.5 text-sm border transition-colors focus:outline-none ${
    dark
      ? 'bg-[#181715] border-white/15 text-[#FAF8F4] placeholder:text-white/30 focus:border-[#B6A48D]'
      : 'bg-[#FAF8F4] border-[#101010]/20 text-[#101010] placeholder:text-[#101010]/35 focus:border-[#632B37]'
  }`;

  return (
    <AnimatePresence mode="wait">
      {submittedRef ? (
        <motion.div
          key="booking-confirmed"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`p-6 sm:p-8 border ${
            dark ? 'border-white/15 bg-[#181715] text-[#FAF8F4]' : 'border-[#101010]/15 bg-[#FAF8F4] text-[#101010]'
          }`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#632B37] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B6A48D]">
                Inquiry Logged · Ref {submittedRef}
              </p>
              <h4 className="font-serif text-2xl">Booking Request Received</h4>
              <p className="text-sm opacity-75 leading-relaxed">
                Our Nepal bookings desk has received your production brief
                {submittedTalentLabel ? ` for ${submittedTalentLabel}` : ''}. Expect availability confirmation and rate cards within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setSubmittedTalentLabel(null);
                }}
                className="mt-3 text-xs uppercase tracking-[0.16em] underline underline-offset-4 cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="booking-form"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
      {defaultModelSlug && defaultModelName && selectedSlugs.includes(defaultModelSlug) && (
        <div
          className={`px-4 py-3 border text-xs uppercase tracking-[0.14em] ${
            dark
              ? 'border-[#B6A48D]/30 bg-white/5 text-[#FAF8F4]'
              : 'border-[#101010]/15 bg-[#F5F1EA] text-[#101010]'
          }`}
        >
          Primary Talent Preselected: <span className="font-semibold">{defaultModelName}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="booking-clientName" className={labelClass}>
            Full Name *
          </label>
          <input
            id="booking-clientName"
            type="text"
            placeholder="Your name"
            {...register('clientName')}
            className={inputClass}
          />
          {errors.clientName && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.clientName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-companyName" className={labelClass}>
            Brand / Agency
          </label>
          <input
            id="booking-companyName"
            type="text"
            placeholder="Studio, fashion house, or agency"
            {...register('companyName')}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="booking-email" className={labelClass}>
            Email Address *
          </label>
          <input
            id="booking-email"
            type="email"
            placeholder="producer@brand.com"
            {...register('email')}
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-phone" className={labelClass}>
            Phone / WhatsApp *
          </label>
          <input
            id="booking-phone"
            type="tel"
            placeholder="+977 98..."
            {...register('phone')}
            className={inputClass}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="booking-gender" className={labelClass}>
            Preferred Gender / Board
          </label>
          <Controller
            control={control}
            name="requestedGender"
            render={({ field }) => (
              <SearchableSelect
                id="booking-gender"
                value={field.value ?? 'Any'}
                onChange={field.onChange}
                options={GENDER_BOARD_OPTIONS}
                searchPlaceholder="Search gender board..."
                tone={dark ? 'dark' : 'alabaster'}
              />
            )}
          />
        </div>

        <div>
          <label htmlFor="booking-projectType" className={labelClass}>
            Project Type *
          </label>
          <Controller
            control={control}
            name="projectType"
            render={({ field }) => (
              <SearchableSelect
                id="booking-projectType"
                value={field.value ?? ''}
                onChange={field.onChange}
                options={[
                  { value: 'Editorial & Lookbook', label: 'Editorial & Lookbook' },
                  { value: 'Brand Campaign', label: 'Brand Campaign' },
                  { value: 'Commercial / TVC', label: 'Commercial / TVC' },
                  { value: 'Runway Showcase', label: 'Runway Showcase' },
                  { value: 'Event / Brand Ambassador', label: 'Event / Brand Ambassador' },
                  { value: 'Custom Casting Brief', label: 'Custom Casting Brief' },
                ]}
                searchPlaceholder="Search project types..."
                tone={dark ? 'dark' : 'alabaster'}
              />
            )}
          />
          {errors.projectType && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.projectType.message}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <label
            htmlFor="booking-models"
            className={`text-xs uppercase tracking-[0.16em] ${
              dark ? 'text-[#B6A48D]' : 'text-[#101010]/70'
            }`}
          >
            Select Models (Optional — One or Multiple)
          </label>
          <span
            className={`text-[11px] font-mono tabular-nums ${
              dark ? 'text-white/50' : 'text-[#101010]/55'
            }`}
          >
            {filteredModelOptions.length} available in board
          </span>
        </div>
        <Controller
          control={control}
          name="modelSlugs"
          render={({ field }) => (
            <SearchableMultiSelect
              id="booking-models"
              values={field.value ?? []}
              onChange={field.onChange}
              options={filteredModelOptions}
              placeholder={
                selectedGender !== 'Any'
                  ? `Open Casting (${selectedGender}) or Select Specific Models`
                  : 'Agency Recommendation / Open Casting — or Choose Models'
              }
              searchPlaceholder="Search models by name, ID, height, or city..."
              tone={dark ? 'dark' : 'alabaster'}
              menuMinWidth={300}
            />
          )}
        />
        {selectedModelsList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {selectedModelsList.map((item) => (
              <span
                key={item.slug}
                className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs border ${
                  dark
                    ? 'border-white/20 bg-white/5 text-[#FAF8F4]'
                    : 'border-[#101010]/20 bg-[#F5F1EA] text-[#101010]'
                }`}
              >
                <span>{item.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      'modelSlugs',
                      selectedSlugs.filter((s) => s !== item.slug),
                    )
                  }
                  aria-label={`Remove ${item.name}`}
                  className="opacity-65 hover:opacity-100 hover:text-[#632B37] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="booking-shootDate" className={labelClass}>
            Preferred Date *
          </label>
          <input
            id="booking-shootDate"
            type="date"
            min={todayIso}
            {...register('shootDate')}
            className={inputClass}
          />
          {errors.shootDate && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.shootDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-location" className={labelClass}>
            Shoot Location *
          </label>
          <input
            id="booking-location"
            type="text"
            placeholder="Kathmandu, Pokhara, Chitwan, Dharan, Mustang, or International"
            {...register('location')}
            className={inputClass}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.location.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="booking-details" className={labelClass}>
          Production Brief &amp; Usage Scope *
        </label>
        <textarea
          id="booking-details"
          rows={4}
          placeholder="Describe deliverables, call times, styling direction, and media usage territories."
          {...register('details')}
          className={inputClass}
        />
        {errors.details && (
          <p className="mt-1 text-xs text-[#632B37]">{errors.details.message}</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#632B37]" role="alert">
          Unable to submit booking request. Please review your fields and try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-150 cursor-pointer disabled:opacity-60 ${
          dark
            ? 'bg-[#FAF8F4] text-[#101010] hover:bg-[#B6A48D]'
            : 'bg-[#101010] text-[#FAF8F4] hover:bg-[#632B37]'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Request...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Request Availability &amp; Rates</span>
          </>
        )}
      </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
