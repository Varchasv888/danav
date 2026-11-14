/**
 * The page a document prints on. Every print page states its own paper (a size the browser's print dialog can honour), its margin, that
 * backgrounds and images print as drawn, that table headings repeat on each sheet, and that a row is not cut across two sheets.
 * Anything marked `no-print` (buttons, help text) is left off the paper.
 */
export function PrintSetup({ size, margin = "10mm" }: { size: string; margin?: string }) {
  return (
    <style>{`@page { size: ${size}; margin: ${margin} } @media print { .no-print { display: none !important } html, body { background: #fff !important; margin: 0 } * { -webkit-print-color-adjust: exact; print-color-adjust: exact } thead { display: table-header-group } tr, img { break-inside: avoid } }`}</style>
  );
}
