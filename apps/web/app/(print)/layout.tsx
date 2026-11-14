/** Print pages: no sidebar or app chrome, just the document on white paper. */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="print-page min-h-dvh bg-white text-black">{children}</div>;
}
