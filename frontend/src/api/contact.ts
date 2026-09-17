import emailjs from '@emailjs/browser';

/**
 * Contact delivery. This is the seam that moves to our own Express API in
 * Phase 2 — only the body of `sendContactMessage` changes, not its callers.
 *
 * Credentials come from env now rather than being committed in source. See
 * `.env.example`.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactError extends Error {}

export async function sendContactMessage(
  form: HTMLFormElement,
): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new ContactError(
      'Contact form is not configured. Set the VITE_EMAILJS_* environment variables.',
    );
  }

  await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, {
    publicKey: PUBLIC_KEY,
  });
}
