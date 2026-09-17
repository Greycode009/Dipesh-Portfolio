import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 md:py-32">
      <div className="nb-box nb-shadow-lg max-w-2xl -rotate-1 bg-surface p-8 md:p-14">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,9vw,4.5rem)] uppercase leading-[0.92]">
          Page <span className="nb-mark">missing</span>
        </h1>
        <p className="mt-5 max-w-md font-medium leading-snug text-muted">
          That page does not exist. It may have moved, or the link may be out of
          date.
        </p>
        <Link to="/" className="nb-btn-primary mt-8">
          Back home →
        </Link>
      </div>
    </section>
  );
}
