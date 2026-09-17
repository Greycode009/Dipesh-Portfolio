import { useRef, useState, type FormEvent } from 'react';
import { sendContactMessage } from '@/api/contact';
import { bio } from '@/content/bio';

const shell = 'mx-auto max-w-[110rem] px-5 sm:px-8';

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'subject', label: 'Subject & budget', type: 'text' },
] as const;

const details = [
  { label: 'Location', value: bio.location },
  { label: 'Email', value: bio.email },
  { label: 'Phone', value: bio.phone },
] as const;

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  );
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');
    try {
      await sendContactMessage(formRef.current);
      formRef.current.reset();
      setStatus('sent');
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Could not send. Try again later.',
      );
      setStatus('error');
    }
  };

  const inputClass =
    'w-full border-2 border-border bg-background px-4 py-3 font-sans outline-none placeholder:text-muted focus:bg-surface';

  return (
    <>
      <section className="border-b-2 border-border">
        <div className={`${shell} py-14 md:py-20`}>
          <p className="eyebrow">
            {bio.availableForWork ? 'Available for work' : 'Currently booked'} —
            replies within 24h
          </p>
          <h1 className="mt-5 text-display font-bold uppercase">
            Contact<span className="text-primary">.</span>
          </h1>
        </div>
      </section>

      <section className="border-b-2 border-border">
        <dl className={`${shell} grid gap-px bg-border md:grid-cols-3`}>
          {details.map((detail) => (
            <div key={detail.label} className="bg-background py-6">
              <dt className="eyebrow">{detail.label}</dt>
              <dd className="mt-2 break-all text-lg">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${shell} py-14 md:py-20`}>
        {status === 'sent' ? (
          <div className="border-2 border-border bg-primary p-10 text-on-primary md:p-16">
            <h2 className="text-headline font-bold uppercase">Message sent.</h2>
            <p className="mt-5 max-w-xl text-lg leading-snug">
              Thanks for reaching out. {bio.name.split(' ')[0]} will review it and
              get back to you within a day.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="grid gap-10 md:grid-cols-12"
          >
            <div className="md:col-span-5">
              <p className="eyebrow">01 — Brief</p>
              <h2 className="mt-4 text-headline font-bold uppercase">
                Tell me
                <br />
                what you
                <br />
                need<span className="text-primary">.</span>
              </h2>
            </div>

            <div className="space-y-5 md:col-span-7">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="eyebrow mb-2 block">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    className={inputClass}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="eyebrow mb-2 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className={`${inputClass} resize-y`}
                />
              </div>

              <input
                type="hidden"
                name="to_email"
                value={import.meta.env.VITE_CONTACT_TO_EMAIL ?? bio.email}
              />

              {status === 'error' && (
                <p
                  role="alert"
                  className="border-2 border-primary px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-primary"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="block-shadow-hover w-full border-2 border-border bg-primary px-7 py-5 font-mono text-xs uppercase tracking-[0.2em] text-on-primary disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send it'}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
