import { useRef, useState, type FormEvent } from 'react';
import { sendContactMessage } from '@/api/contact';
import Guestbook from '@/components/Guestbook';
import { useContent } from '@/hooks/useContent';
import { usePageAnimations } from '@/hooks/usePageAnimations';

const shell = 'mx-auto max-w-[92rem] px-5 sm:px-8';

const fields = [
  { name: 'name', label: 'Your name', type: 'text', placeholder: 'Jane Doe' },
  {
    name: 'email',
    label: 'Your email',
    type: 'email',
    placeholder: 'jane@company.com',
  },
  {
    name: 'subject',
    label: 'Subject & budget',
    type: 'text',
    placeholder: 'Landing page · $2k',
  },
] as const;

export default function Contact() {
  const { bio } = useContent();
  const scope = usePageAnimations();

  const details = [
    { label: 'Location', value: bio.location },
    { label: 'Email', value: bio.email },
    { label: 'Phone', value: bio.phone },
  ];
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
    'nb-box w-full bg-background px-4 py-3 font-medium outline-none placeholder:text-muted/70 focus:bg-surface';

  return (
    <div ref={scope}>
      <section className={`${shell} py-12 md:py-16`}>
        <p className="eyebrow" data-reveal>
          Replies within 24 hours
        </p>
        <h1
          className="mt-4 font-display text-[clamp(2.5rem,9vw,5rem)] uppercase leading-[0.92]"
          data-reveal
        >
          Say <span className="nb-mark">hello</span>
        </h1>

        <dl className="mt-8 grid gap-5 sm:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.label} className="nb-card p-5" data-reveal>
              <dt className="eyebrow">{detail.label}</dt>
              <dd className="mt-2 break-all font-semibold">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${shell} pb-16 md:pb-24`}>
        {status === 'sent' ? (
          <div className="nb-box nb-shadow-lg -rotate-1 bg-primary p-10 text-on-primary md:p-16">
            <h2 className="font-display text-[clamp(1.75rem,5vw,3rem)] uppercase leading-[0.95]">
              Message sent
            </h2>
            <p className="mt-5 max-w-xl text-lg font-medium leading-snug">
              Thanks for reaching out. {bio.name.split(' ')[0]} will read it and
              get back to you within a day.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="nb-card grid gap-8 p-7 md:grid-cols-12 md:p-10"
            data-reveal
          >
            <div className="md:col-span-5">
              <p className="eyebrow">01 — The brief</p>
              <h2 className="mt-4 font-display text-[clamp(1.5rem,4vw,2.5rem)] uppercase leading-[0.95]">
                Tell me what
                <br />
                you need built
              </h2>
              <p className="mt-5 font-medium leading-snug text-muted">
                A sentence or two is plenty to start. The more detail on budget
                and timeline, the faster the reply is useful.
              </p>
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
                    placeholder={field.placeholder}
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
                  rows={5}
                  placeholder="What are you building?"
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
                  className="nb-box bg-primary px-4 py-3 text-sm font-bold text-on-primary"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="nb-btn-primary w-full py-4 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send it →'}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className={`${shell} pb-16 md:pb-24`}>
        <Guestbook />
      </section>
    </div>
  );
}
