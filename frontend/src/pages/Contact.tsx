import { useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '@/api/contact';
import { bio } from '@/content/bio';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fields = [
  { name: 'name', label: 'Name', icon: 'fa-solid fa-user', type: 'text' },
  { name: 'email', label: 'Email', icon: 'fa-solid fa-envelope', type: 'email' },
  {
    name: 'subject',
    label: 'Subject & Budget',
    icon: 'fa-solid fa-tag',
    type: 'text',
  },
] as const;

const details = [
  { icon: 'fa-solid fa-location-dot', label: 'Location', value: bio.location },
  { icon: 'fa-solid fa-envelope', label: 'Email', value: bio.email },
  { icon: 'fa-solid fa-phone', label: 'Phone', value: bio.phone },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren' as const, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');
    try {
      await sendContactMessage(formRef.current);
      formRef.current.reset();
      setStatus('success');
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Failed to send message. Please try again later.',
      );
      setStatus('error');
    }
  };

  return (
    <motion.div
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <motion.section variants={itemVariants}>
          <h1 className="mb-3 text-4xl font-bold text-primary">
            Let&apos;s Connect
          </h1>
          <p className="mb-10 text-lg text-muted">
            I&apos;m excited to collaborate on your next project
          </p>

          <div className="space-y-4">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center gap-4 rounded-xl border border-primary/10 bg-surface p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
                  <i className={detail.icon} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                    {detail.label}
                  </h2>
                  <p className="break-all">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>

          {bio.availableForWork && (
            <div className="mt-8 rounded-xl border-l-4 border-primary bg-primary/10 p-5">
              <p className="flex items-center gap-2 font-medium">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                </span>
                Available for freelance work
              </p>
              <p className="mt-1 text-sm text-muted">
                I typically respond within 24 hours
              </p>
            </div>
          )}
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="rounded-2xl border border-primary/10 bg-surface p-8"
        >
          <header className="mb-8">
            <h2 className="mb-1 text-2xl font-bold text-primary">
              Hire Me for Your Project
            </h2>
            <p className="text-muted">
              Fill out the form below to discuss your project needs
            </p>
          </header>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 flex items-center gap-2 text-sm font-medium"
                >
                  <i className={`${field.icon} text-primary`} aria-hidden="true" />
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="message"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <i className="fa-solid fa-message text-primary" aria-hidden="true" />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* The EmailJS template reads {{to_email}} for the recipient. */}
            <input
              type="hidden"
              name="to_email"
              value={import.meta.env.VITE_CONTACT_TO_EMAIL ?? bio.email}
            />

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ scale: status === 'sending' ? 1 : 1.03 }}
              whileTap={{ scale: status === 'sending' ? 1 : 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  Hire Me
                </>
              )}
            </motion.button>
          </form>

          <div aria-live="polite">
            {status === 'success' && (
              <motion.p
                className="mt-5 flex items-start gap-3 rounded-lg bg-primary/10 p-4 text-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <i className="fa-solid fa-circle-check mt-1" aria-hidden="true" />
                Thanks for reaching out! I&apos;ll review your project request
                and get back to you soon.
              </motion.p>
            )}

            {status === 'error' && (
              <motion.p
                className="mt-5 flex items-start gap-3 rounded-lg bg-red-500/10 p-4 text-red-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <i
                  className="fa-solid fa-circle-exclamation mt-1"
                  aria-hidden="true"
                />
                {error}
              </motion.p>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
