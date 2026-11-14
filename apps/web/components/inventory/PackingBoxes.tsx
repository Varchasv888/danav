"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Badge, Button, Card, Field, Input, Select } from "../ui";

interface Company { id: string; name: string }
interface GoodsItem { id: string; name: string; sku: string | null; barcode: string | null; color: string | null; size: string | null; fit: string | null; kind: string; archived: boolean }
interface BoxLine { itemId: string; itemName: string; sku: string | null; barcode: string | null; color: string | null; size: string | null; fit: string | null; qty: string }
interface BoxContent { itemId: string; name: string; sku: string | null; barcode: string | null; color: string | null; size: string | null; fit: string | null; qty: string }
interface BoxEvent { id: string; operation: string; reason: string | null; beforeContents: BoxContent[]; afterContents: BoxContent[]; createdAt: string }
interface PackingBox { id: string; code: string; status: "open" | "packed"; createdAt: string; lines: BoxLine[]; events?: BoxEvent[] }
interface DraftLine { itemId: string; qty: string }

const validQty = (value: string) => /^\d+(\.\d{1,4})?$/.test(value) && /[1-9]/.test(value);
const showQty = (value: string) => value.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
const snapshotText = (contents: BoxContent[]) => contents.length
  ? contents.map((line) => `${[line.name, line.color, line.size, line.fit].filter(Boolean).join(" · ")} × ${showQty(line.qty)}`).join(", ")
  : "Empty";

function problem(error: unknown) {
  if (!(error instanceof ApiError)) return "The box could not be saved. Please try again.";
  if (error.code === "packing_box_not_open") return "This box is packed. Re-open it before changing its contents.";
  if (error.code === "packing_box_not_packed") return "This box is already open.";
  if (error.code === "packing_box_invalid_item") return "Choose active goods items from this company.";
  if (error.code === "packing_box_empty") return "Add at least one item before packing the box.";
  if (error.code === "qty_must_be_positive") return "Each quantity must be greater than zero.";
  return "The box could not be saved. Please check the details and try again.";
}

/** Shared English workflow for creating, packing, reopening, and printing company-scoped box records. */
export function PackingBoxes({
  mode, companies, initialCompanyId, initialBoxes, initialItems, canCreate, canEdit,
}: {
  mode: "repack" | "reopen";
  companies: Company[];
  initialCompanyId: string;
  initialBoxes: PackingBox[];
  initialItems: GoodsItem[];
  canCreate: boolean;
  canEdit: boolean;
}) {
  const [companyId, setCompanyId] = useState(initialCompanyId);
  const [boxes, setBoxes] = useState(initialBoxes);
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<PackingBox | null>(null);
  const [search, setSearch] = useState("");
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("1");
  const [draft, setDraft] = useState<DraftLine[]>([]);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selected = (detail?.id === selectedId ? detail : null) ?? boxes.find((box) => box.id === selectedId) ?? null;
  const filteredItems = items.filter((item) => {
    const q = search.trim().toLocaleLowerCase();
    return !q || item.name.toLocaleLowerCase().includes(q) || (item.sku ?? "").toLocaleLowerCase().includes(q)
      || (item.color ?? "").toLocaleLowerCase().includes(q) || (item.size ?? "").toLocaleLowerCase().includes(q) || (item.fit ?? "").toLocaleLowerCase().includes(q);
  });

  const selectBox = async (id: string) => {
    setSelectedId(id);
    setDetail(null);
    setDraft([]);
    setReason("");
    setError("");
    setMessage("");
    try { setDetail(await api<PackingBox>(`/packing-boxes/${id}?companyId=${companyId}`)); }
    catch { setError("That box could not be loaded. Refresh the page and try again."); }
  };

  const switchCompany = async (nextCompanyId: string) => {
    setBusy(true);
    setError("");
    setMessage("");
    setSelectedId("");
    setDetail(null);
    setDraft([]);
    setReason("");
    try {
      const [nextBoxes, nextItems] = await Promise.all([
        api<PackingBox[]>(`/packing-boxes?companyId=${nextCompanyId}`),
        api<GoodsItem[]>(`/items?companyId=${nextCompanyId}`),
      ]);
      setCompanyId(nextCompanyId);
      setBoxes(nextBoxes);
      setItems(nextItems.filter((item) => item.kind === "goods" && !item.archived));
    } catch { setError("The selected company could not be loaded."); }
    finally { setBusy(false); }
  };

  const createBox = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const created = await api<PackingBox>("/packing-boxes", { body: { companyId } });
      setBoxes((current) => [created, ...current.filter((box) => box.id !== created.id)]);
      setSelectedId(created.id);
      setDetail(created);
      setDraft([]);
      setMessage(`${created.code} is ready for packing.`);
    } catch (cause) { setError(problem(cause)); }
    finally { setBusy(false); }
  };

  const addItem = () => {
    if (!itemId || !validQty(qty)) return;
    if (draft.some((line) => line.itemId === itemId)) {
      setError("That item is already in the box. Change its quantity below.");
      return;
    }
    setDraft((current) => [...current, { itemId, qty }]);
    setItemId("");
    setQty("1");
    setError("");
  };

  const saveRepack = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || !draft.length || !draft.every((line) => validQty(line.qty)) || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await api<PackingBox>(`/packing-boxes/${selected.id}/repack`, {
        body: { companyId, lines: draft, ...(reason.trim() ? { reason: reason.trim() } : {}) },
      });
      setDetail(updated);
      setBoxes((current) => current.map((box) => box.id === updated.id ? updated : box));
      setDraft([]);
      setReason("");
      setMessage(`${updated.code} is packed.`);
    } catch (cause) { setError(problem(cause)); }
    finally { setBusy(false); }
  };

  const reopen = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || reason.trim().length < 3 || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const updated = await api<PackingBox>(`/packing-boxes/${selected.id}/reopen`, { body: { companyId, reason: reason.trim() } });
      setDetail(updated);
      setBoxes((current) => current.map((box) => box.id === updated.id ? updated : box));
      setReason("");
      setMessage(`${updated.code} is open again. Its contents have been preserved.`);
    } catch (cause) { setError(problem(cause)); }
    finally { setBusy(false); }
  };

  const title = mode === "repack" ? "Re-pack Box" : "Re-open Box";
  const actionLabel = mode === "repack" ? "Pack this box" : "Re-open this box";

  return (
    <div className="grid gap-4">
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Field label="Company" htmlFor="packing-company">
          <Select id="packing-company" value={companyId} disabled={busy || companies.length < 2} onChange={(event) => void switchCompany(event.target.value)} className="w-full sm:w-72">
            {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </Select>
        </Field>
        {mode === "repack" && canCreate ? <Button type="button" disabled={busy} onClick={() => void createBox()} className="min-h-11">Create a box</Button> : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Box records</h2>
            <span className="text-xs text-muted">{boxes.length} shown</span>
          </div>
          {boxes.length ? (
            <ul className="divide-y divide-border">
              {boxes.map((box) => (
                <li key={box.id}>
                  <button type="button" onClick={() => void selectBox(box.id)} aria-pressed={selectedId === box.id}
                    className={`flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 ${selectedId === box.id ? "bg-surface-2" : ""}`}>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-sm font-semibold">{box.code}</span>
                      <span className="block text-xs text-muted">{box.lines.length} {box.lines.length === 1 ? "item" : "items"}</span>
                    </span>
                    <Badge tone={box.status === "packed" ? "success" : "neutral"}>{box.status === "packed" ? "Packed" : "Open"}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="px-4 py-8 text-center text-sm text-muted">No boxes yet. Create one to record a pack.</p>}
        </Card>

        {selected ? (
          <Card className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-lg font-semibold">{selected.code}</p>
                <p className="mt-1 text-sm text-muted">{selected.status === "packed" ? "Packed" : "Open for packing"}</p>
              </div>
              <Link href={`/print/box-label/${selected.id}?record=packing-box&companyId=${companyId}`} target="_blank" rel="noreferrer"
                className="inline-flex min-h-10 items-center rounded-lg border border-border-strong px-3 text-sm font-medium hover:bg-surface-2">Print box label</Link>
            </div>

            <div className="mt-4 border-t border-border pt-3">
              <h3 className="text-sm font-semibold">Current contents</h3>
              {selected.lines.length ? <ul className="mt-2 divide-y divide-border">
                {selected.lines.map((line) => (
                  <li key={line.itemId} className="flex min-w-0 items-center justify-between gap-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{line.itemName}{line.color || line.size || line.fit ? ` · ${[line.color, line.size, line.fit].filter(Boolean).join(" / ")}` : ""}</span>
                      <span className="block truncate text-xs text-muted">{line.sku || line.barcode || "Goods item"}</span>
                    </span>
                    <span className="num shrink-0">{showQty(line.qty)}</span>
                  </li>
                ))}
              </ul> : <p className="mt-2 text-sm text-muted">This box is empty.</p>}
            </div>

            {mode === "repack" && selected.status === "open" ? (
              canEdit ? <form onSubmit={(event) => void saveRepack(event)} className="mt-4 grid gap-4 border-t border-border pt-4">
                <h3 className="text-sm font-semibold">Choose goods and quantities</h3>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:items-end">
                  <Field label="Find a goods item" htmlFor="box-item-search">
                    <Input id="box-item-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, SKU, colour, or size" autoComplete="off" className="w-full" />
                  </Field>
                  <Field label="Quantity" htmlFor="box-item-qty"><Input id="box-item-qty" value={qty} onChange={(event) => setQty(event.target.value)} inputMode="decimal" className="num w-full" /></Field>
                  <Button type="button" variant="outline" onClick={addItem} disabled={!itemId || !validQty(qty) || busy} className="min-h-10">Add item</Button>
                </div>
                <Field label="Goods item" htmlFor="box-item-select">
                  <Select id="box-item-select" value={itemId} onChange={(event) => setItemId(event.target.value)} className="w-full">
                    <option value="">Select an item</option>
                    {filteredItems.filter((item) => !draft.some((line) => line.itemId === item.id)).slice(0, 100).map((item) => (
                      <option key={item.id} value={item.id}>{item.name}{item.color || item.size || item.fit ? ` · ${[item.color, item.size, item.fit].filter(Boolean).join(" / ")}` : ""}{item.sku ? ` · ${item.sku}` : ""}</option>
                    ))}
                  </Select>
                </Field>
                {draft.length ? <ul className="divide-y divide-border rounded-lg border border-border">
                  {draft.map((line) => {
                    const item = items.find((candidate) => candidate.id === line.itemId)!;
                    return <li key={line.itemId} className="flex flex-wrap items-center gap-3 p-3">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}{item.color || item.size || item.fit ? ` · ${[item.color, item.size, item.fit].filter(Boolean).join(" / ")}` : ""}</span>
                      <Input aria-label={`Quantity for ${item.name}`} value={line.qty} onChange={(event) => setDraft((current) => current.map((candidate) => candidate.itemId === line.itemId ? { ...candidate, qty: event.target.value } : candidate))} inputMode="decimal" className="num w-28" />
                      <Button type="button" variant="ghost" onClick={() => setDraft((current) => current.filter((candidate) => candidate.itemId !== line.itemId))} className="min-h-9 px-2">Remove</Button>
                    </li>;
                  })}
                </ul> : <p className="text-sm text-muted">Add at least one goods item to pack this box.</p>}
                <Field label="Packing note (optional)" htmlFor="box-repack-reason"><Input id="box-repack-reason" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={300} className="w-full" /></Field>
                <Button type="submit" disabled={!draft.length || !draft.every((line) => validQty(line.qty)) || busy} className="min-h-11">{busy ? "Saving…" : actionLabel}</Button>
              </form> : <p className="mt-4 border-t border-border pt-4 text-sm text-muted">You have view-only access. Ask an inventory editor to pack this box.</p>
            ) : null}

            {mode === "repack" && selected.status === "packed" ? <p className="mt-4 border-t border-border pt-4 text-sm text-muted">Re-open this box before changing its contents.</p> : null}

            {mode === "reopen" && selected.status === "packed" ? (
              canEdit ? <form onSubmit={(event) => void reopen(event)} className="mt-4 grid gap-3 border-t border-border pt-4">
                <Field label="Reason for re-opening" htmlFor="box-reopen-reason"><Input id="box-reopen-reason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={3} maxLength={300} required className="w-full" /></Field>
                <Button type="submit" disabled={reason.trim().length < 3 || busy} className="min-h-11">{busy ? "Saving…" : actionLabel}</Button>
              </form> : <p className="mt-4 border-t border-border pt-4 text-sm text-muted">You have view-only access. Ask an inventory editor to re-open this box.</p>
            ) : null}
            {mode === "reopen" && selected.status === "open" ? <p className="mt-4 border-t border-border pt-4 text-sm text-muted">This box is already open.</p> : null}

            {selected.events?.length ? <details className="mt-4 border-t border-border pt-3">
              <summary className="cursor-pointer text-sm font-semibold">Packing history ({selected.events.length})</summary>
              <ol className="mt-2 grid gap-2">
                {selected.events.map((event) => <li key={event.id} className="rounded-lg bg-surface-2 p-3 text-xs">
                  <p className="font-medium">{event.operation === "create" ? "Box created" : event.operation === "repack" ? "Box packed" : "Box re-opened"} · {new Date(event.createdAt).toLocaleString("en-IN")}</p>
                  {event.reason ? <p className="mt-1 text-muted">{event.reason}</p> : null}
                  {event.operation !== "create" ? <>
                    <p className="mt-1"><span className="font-medium">Before:</span> {snapshotText(event.beforeContents)}</p>
                    <p className="mt-1"><span className="font-medium">After:</span> {snapshotText(event.afterContents)}</p>
                  </> : null}
                </li>)}
              </ol>
            </details> : null}
          </Card>
        ) : <Card className="flex min-h-52 items-center justify-center text-center text-sm text-muted">Select a box record to see its contents and available action.</Card>}
      </div>

      {error ? <p role="alert" className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">{error}</p> : null}
      {message ? <p role="status" className="rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-sm text-success">{message}</p> : null}
    </div>
  );
}
