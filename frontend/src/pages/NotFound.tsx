import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 md:py-36">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 text-display font-bold uppercase">
        Not found<span className="text-primary">.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-snug text-muted">
        That page does not exist. It may have moved, or the link may be out of
        date.
      </p>
      <Link
        to="/"
        className="block-shadow-hover mt-10 inline-block border-2 border-border bg-primary px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-on-primary"
      >
        Back to index
      </Link>
    </section>
  );
}
