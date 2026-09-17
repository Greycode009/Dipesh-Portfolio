import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-bold text-primary">404</p>
      <h1 className="mb-3 text-2xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="mb-8 text-muted">
        The link may be out of date, or the page may have moved.
      </p>
      <Link
        to="/"
        className="rounded bg-primary px-6 py-3 font-medium text-on-primary transition-colors hover:bg-secondary"
      >
        Back to home
      </Link>
    </div>
  );
}
