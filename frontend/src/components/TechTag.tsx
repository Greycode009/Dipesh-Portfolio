/** Small pill used for technology lists. */
export default function TechTag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/20">
      {children}
    </span>
  );
}
