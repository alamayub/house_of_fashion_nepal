import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateContactMutation } from '../../features/bookings/bookingsApi.ts';
import { SearchableSelect } from '../common/SearchableSelect.tsx';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  company: z.string().optional(),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(2, 'Please choose or enter a subject'),
  message: z.string().min(15, 'Message must be at least 15 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [createContact, { isLoading, error }] = useCreateContactMutation();
  const [sentId, setSentId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: 'Press & Editorial Collaborations',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await createContact({
        name: values.name,
        company: values.company || undefined,
        email: values.email,
        phone: values.phone || undefined,
        subject: values.subject,
        message: values.message,
      }).unwrap();
      setSentId(res.id);
      reset({ subject: 'Press & Editorial Collaborations' });
    } catch {
      // Error feedback rendered cleanly via RTK Query error state
    }
  };

  const labelClass = 'block text-xs uppercase tracking-[0.16em] text-[#101010]/70 mb-2';
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#FAF8F4] border border-[#101010]/20 text-[#101010] placeholder:text-[#101010]/35 focus:outline-none focus:border-[#632B37] transition-colors';

  return (
    <AnimatePresence mode="wait">
      {sentId ? (
        <motion.div
          key="contact-confirmed"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 border border-[#101010]/15 bg-[#FAF8F4]"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#632B37] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B6A48D]">
                Dispatched · Ref {sentId}
              </p>
              <h4 className="font-serif text-2xl">Message Received</h4>
              <p className="text-sm text-[#101010]/75 leading-relaxed">
                Thank you for reaching out to House of Fashion Nepal. A member of our team will respond within one business day.
              </p>
              <button
                type="button"
                onClick={() => setSentId(null)}
                className="mt-2 text-xs uppercase tracking-[0.16em] underline underline-offset-4 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="contact-form"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your Name *
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Full name"
            {...register('name')}
            className={inputClass}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Organization / Publication
          </label>
          <input
            id="contact-company"
            type="text"
            placeholder="Optional"
            {...register('company')}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@organization.com"
            {...register('email')}
            className={inputClass}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#632B37]">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="Optional"
            {...register('phone')}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject *
        </label>
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <SearchableSelect
              id="contact-subject"
              value={field.value ?? ''}
              onChange={field.onChange}
              options={[
                {
                  value: 'Press & Editorial Collaborations',
                  label: 'Press & Editorial Collaborations',
                },
                {
                  value: 'Photoshoot Production in Nepal',
                  label: 'Photoshoot Production in Nepal',
                },
                {
                  value: 'International Agency Partnership',
                  label: 'International Agency Partnership',
                },
                { value: 'General Inquiry', label: 'General Inquiry' },
              ]}
              searchPlaceholder="Search subjects..."
              tone="alabaster"
            />
          )}
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-[#632B37]">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="How can House of Fashion Nepal collaborate with you across Nepal or internationally?"
          {...register('message')}
          className={inputClass}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-[#632B37]">{errors.message.message}</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#632B37]" role="alert">
          Unable to dispatch message right now. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 inline-flex items-center justify-center gap-2 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#632B37] transition-colors duration-150 cursor-pointer disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </>
        )}
      </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
