import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ImagePlus, Loader2, Send, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type ChangeEvent, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useCreateApplicationMutation } from '../../features/applications/applicationsApi.ts';
import { SearchableSelect } from '../common/SearchableSelect.tsx';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function getMaxAdultDobIso(): string {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  const year = cutoff.getFullYear();
  const month = String(cutoff.getMonth() + 1).padStart(2, '0');
  const day = String(cutoff.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isAtLeast18(dateStr: string): boolean {
  const dob = new Date(dateStr);
  if (Number.isNaN(dob.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Phone number is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(isAtLeast18, 'Applicants must be at least 18 years old'),
  location: z.string().min(2, 'City or district is required'),
  gender: z.string().min(1, 'Please select a representation division'),
  category: z.string().min(1, 'Please select your primary modeling interest'),
  height: z
    .string()
    .min(1, 'Height in cm is required')
    .refine((val) => {
      const n = Number(val);
      return !Number.isNaN(n) && n >= 150 && n <= 210;
    }, 'Enter height in centimeters (150–210 cm)'),
  weight: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      const n = Number(val);
      return !Number.isNaN(n) && n >= 40 && n <= 150;
    }, 'Weight must be between 40 and 150 kg'),
  experience: z.string().min(1, 'Please select your experience level'),
  instagram: z.string().optional(),
  portfolioUrl: z
    .string()
    .url('Enter a valid URL starting with https://')
    .optional()
    .or(z.literal('')),
  introduction: z
    .string()
    .min(20, 'Please introduce yourself in at least 20 characters'),
  consentAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept our privacy and casting terms'),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface UploadPreview {
  name: string;
  previewUrl: string;
}

export function ApplicationForm() {
  const [createApplication, { isLoading, error }] = useCreateApplicationMutation();
  const [profilePhoto, setProfilePhoto] = useState<UploadPreview | null>(null);
  const [portfolioPhotos, setPortfolioPhotos] = useState<UploadPreview[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const maxAdultDob = useMemo(() => getMaxAdultDobIso(), []);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      location: 'Kathmandu',
      gender: 'Female',
      category: 'New Faces',
      height: '',
      weight: '',
      experience: 'No Prior Experience (New Face)',
      consentAccepted: false,
    },
  });

  const handleProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setPhotoError('Profile portrait must be under 10 MB.');
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto({ name: file.name, previewUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const handlePortfolioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = '';
    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    let rejectedReason: string | null = null;
    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        rejectedReason = 'Only image files (JPG, PNG, WebP) can be attached.';
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        rejectedReason = 'Each portfolio image must be under 10 MB.';
        continue;
      }
      validFiles.push(file);
    }
    setPortfolioError(rejectedReason);

    const filesToAdd = validFiles.slice(0, Math.max(0, 4 - portfolioPhotos.length));
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPortfolioPhotos((prev) => [
          ...prev.slice(0, 3),
          { name: file.name, previewUrl: String(reader.result) },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!profilePhoto) {
      setPhotoError('Please attach one natural-light profile portrait.');
      return;
    }

    try {
      const res = await createApplication({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth,
        location: values.location,
        gender: values.gender,
        category: values.category,
        height: Number(values.height),
        weight: values.weight && values.weight.trim() !== '' ? Number(values.weight) : undefined,
        experience: values.experience,
        instagram: values.instagram || undefined,
        portfolioUrl: values.portfolioUrl || undefined,
        introduction: values.introduction,
        profilePhotoName: profilePhoto.name,
        portfolioPhotoNames: portfolioPhotos.map((p) => p.name),
        consentAccepted: values.consentAccepted,
      }).unwrap();

      setSubmittedId(res.id);
      reset();
      setProfilePhoto(null);
      setPortfolioPhotos([]);
    } catch {
      // Error feedback rendered cleanly via RTK Query error state
    }
  };

  const labelClass = 'block text-xs uppercase tracking-[0.16em] text-[#101010]/70 mb-2';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] placeholder:text-[#101010]/35 focus:outline-none focus:border-[#632B37] transition-colors';

  return (
    <AnimatePresence mode="wait">
      {submittedId ? (
        <motion.div
          key="application-confirmed"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 md:p-10 border border-[#101010]/15 bg-[#FAF8F4]"
        >
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-[#632B37] shrink-0 mt-1" />
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B6A48D]">
                Application Logged · Ref {submittedId}
              </p>
              <h3 className="font-serif text-3xl text-[#101010]">
                Thank You for Applying to House of Fashion Nepal
              </h3>
              <p className="text-sm text-[#101010]/75 leading-relaxed max-w-xl">
                Our New Faces &amp; Scouting Directors across Nepal review every submission personally. Shortlisted candidates are invited for a studio or live digital casting session within 10 working days.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedId(null)}
                className="pt-2 text-xs uppercase tracking-[0.16em] text-[#632B37] underline underline-offset-4 cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="application-form"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="app-fullName" className={labelClass}>
            Full Name *
          </label>
          <input
            id="app-fullName"
            type="text"
            placeholder="First & last name"
            {...register('fullName')}
            className={inputClass}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-email" className={labelClass}>
            Email Address *
          </label>
          <input
            id="app-email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="app-phone" className={labelClass}>
            Phone Number *
          </label>
          <input
            id="app-phone"
            type="tel"
            placeholder="+977 98..."
            {...register('phone')}
            className={inputClass}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-dob" className={labelClass}>
            Date of Birth (18+) *
          </label>
          <input
            id="app-dob"
            type="date"
            max={maxAdultDob}
            {...register('dateOfBirth')}
            className={inputClass}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-location" className={labelClass}>
            Current City *
          </label>
          <input
            id="app-location"
            type="text"
            placeholder="Kathmandu, Pokhara, Dharan, Butwal, Biratnagar..."
            {...register('location')}
            className={inputClass}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.location.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label htmlFor="app-gender" className={labelClass}>
            Gender / Board *
          </label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <SearchableSelect
                id="app-gender"
                value={field.value ?? ''}
                onChange={field.onChange}
                options={[
                  { value: 'Female', label: 'Female' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Non-Binary', label: 'Non-Binary' },
                ]}
                searchPlaceholder="Search gender / board..."
                tone="alabaster"
              />
            )}
          />
          {errors.gender && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-category" className={labelClass}>
            Primary Category *
          </label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SearchableSelect
                id="app-category"
                value={field.value ?? ''}
                onChange={field.onChange}
                options={[
                  { value: 'New Faces', label: 'New Faces' },
                  { value: 'Fashion Models', label: 'Fashion & Editorial' },
                  { value: 'Commercial Models', label: 'Commercial & Beauty' },
                  { value: 'Runway', label: 'Runway' },
                  { value: 'Fitness Models', label: 'Fitness & Sportswear' },
                  { value: 'Petite Models', label: 'Petite' },
                  { value: 'Plus-size Models', label: 'Plus-size / Curve' },
                ]}
                searchPlaceholder="Search modeling categories..."
                tone="alabaster"
              />
            )}
          />
          {errors.category && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-height" className={labelClass}>
            Height (cm) *
          </label>
          <input
            id="app-height"
            type="number"
            placeholder="176"
            {...register('height')}
            className={`${inputClass} tabular-nums`}
          />
          {errors.height && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.height.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-weight" className={labelClass}>
            Weight (kg, Optional)
          </label>
          <input
            id="app-weight"
            type="number"
            placeholder="Optional"
            {...register('weight')}
            className={`${inputClass} tabular-nums`}
          />
          {errors.weight && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.weight.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="app-experience" className={labelClass}>
            Experience *
          </label>
          <Controller
            control={control}
            name="experience"
            render={({ field }) => (
              <SearchableSelect
                id="app-experience"
                value={field.value ?? ''}
                onChange={field.onChange}
                options={[
                  {
                    value: 'No Prior Experience (New Face)',
                    label: 'No Prior Experience (New Face)',
                  },
                  { value: '1-2 Years (Emerging)', label: '1–2 Years (Emerging)' },
                  { value: '3+ Years (Professional)', label: '3+ Years (Professional)' },
                ]}
                searchPlaceholder="Search experience level..."
                tone="alabaster"
              />
            )}
          />
          {errors.experience && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.experience.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="app-instagram" className={labelClass}>
            Instagram Handle
          </label>
          <input
            id="app-instagram"
            type="text"
            placeholder="@username"
            {...register('instagram')}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="app-portfolioUrl" className={labelClass}>
            Portfolio Link
          </label>
          <input
            id="app-portfolioUrl"
            type="url"
            placeholder="https://..."
            {...register('portfolioUrl')}
            className={inputClass}
          />
          {errors.portfolioUrl && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.portfolioUrl.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="app-introduction" className={labelClass}>
          Short Introduction *
        </label>
        <textarea
          id="app-introduction"
          rows={4}
          placeholder="Tell us about yourself, languages you speak, and your creative ambitions."
          {...register('introduction')}
          className={inputClass}
        />
        {errors.introduction && (
          <p className="mt-1 text-xs text-[#632B37]">{errors.introduction.message}</p>
        )}
      </div>

      {/* Photo Uploads with Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="border border-[#101010]/15 bg-[#FAF8F4] p-5">
          <p className={labelClass}>Profile Headshot (Natural Light) *</p>
          {profilePhoto ? (
            <div className="relative aspect-[3/4] max-w-[180px] bg-[#101010]/5 overflow-hidden">
              <img
                src={profilePhoto.previewUrl}
                alt="Profile upload preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setProfilePhoto(null)}
                aria-label="Remove profile headshot"
                className="absolute top-2 right-2 w-7 h-7 bg-[#101010] text-[#FAF8F4] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border border-dashed border-[#101010]/25 py-8 px-4 cursor-pointer hover:border-[#632B37] transition-colors">
              <ImagePlus className="w-5 h-5 text-[#101010]/50 mb-2" />
              <span className="text-xs uppercase tracking-[0.14em] text-[#101010]/70">
                Upload Portrait
              </span>
              <span className="text-[11px] text-[#101010]/45 mt-1">
                JPG or PNG, minimal makeup
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="sr-only"
              />
            </label>
          )}
          {photoError && <p className="mt-2 text-xs text-[#632B37]">{photoError}</p>}
        </div>

        <div className="border border-[#101010]/15 bg-[#FAF8F4] p-5">
          <p className={labelClass}>Additional Portfolio / Digitals (Up to 4)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {portfolioPhotos.map((photo, idx) => (
              <div
                key={`${photo.name}-${idx}`}
                className="relative aspect-[3/4] bg-[#101010]/5 overflow-hidden"
              >
                <img
                  src={photo.previewUrl}
                  alt={`Portfolio preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPortfolioPhotos((prev) => prev.filter((_, i) => i !== idx))
                  }
                  aria-label="Remove portfolio photo"
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#101010] text-[#FAF8F4] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {portfolioPhotos.length < 4 && (
            <label className="flex flex-col items-center justify-center border border-dashed border-[#101010]/25 py-6 px-4 cursor-pointer hover:border-[#632B37] transition-colors">
              <ImagePlus className="w-5 h-5 text-[#101010]/50 mb-2" />
              <span className="text-xs uppercase tracking-[0.14em] text-[#101010]/70">
                Add Portfolio Images
              </span>
              <span className="text-[11px] text-[#101010]/45 mt-1">
                Full-length &amp; side profile recommended
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePortfolioUpload}
                className="sr-only"
              />
            </label>
          )}
          {portfolioError && (
            <p className="mt-2 text-xs text-[#632B37]">{portfolioError}</p>
          )}
        </div>
      </div>

      {/* Privacy & Consent */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('consentAccepted')}
            className="mt-1 w-4 h-4 accent-[#632B37]"
          />
          <span className="text-xs text-[#101010]/75 leading-relaxed">
            I confirm that I am at least 18 years of age and consent to House of Fashion Nepal reviewing my submitted photographs and details under our{' '}
            <Link to="/privacy-policy" className="underline underline-offset-2 text-[#632B37] hover:text-[#101010]">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms-and-conditions" className="underline underline-offset-2 text-[#632B37] hover:text-[#101010]">
              Terms &amp; Conditions
            </Link>{' '}
            (Individual Privacy Act, 2075 of Nepal).
          </span>
        </label>
        {errors.consentAccepted && (
          <p className="mt-1 text-xs text-[#632B37]">{errors.consentAccepted.message}</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#632B37]" role="alert">
          Submission encountered an issue. Please check all required fields.
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors duration-150 cursor-pointer disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Application...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Submit Model Application</span>
          </>
        )}
      </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
