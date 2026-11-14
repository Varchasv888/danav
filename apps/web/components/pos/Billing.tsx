"use client";

import { CheckCircle2, ListRestart, PauseCircle, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees } from "@/lib/format";
import { fileUrl } from "@/lib/images";
import { SendWhatsApp } from "../sharing/SendWhatsApp";
import { ExchangePanel, type Exchange } from "./Exchange";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { addToCart, CartTable, Checkout, ItemSearch, POS_NS, type Bill, type CartLine, type PosItem, type PosSettings, type Salesman } from "./Checkout";

export interface Terminal {
  id: string; code: string; name: string; warehouseId: string; warehouse: string; branchId?: string | null; deviceId: string | null; device: string | null; archived: boolean;
  openSession: { id: string; openingCash: string; openedAt: string } | null;
}
type Totals = { bills: string; total: string; cash: string; upi: string; card: string; credit: string };
const KEY = "varchasv.pos.terminal";

/** Chosen counter, remembered on this browser. */
export function useTerminal(terminals: Terminal[]) {
  const usable = terminals.filter((x) => !x.archived);
  const [id, setId] = useState(usable[0]?.id ?? "");
  useEffect(() => {
    try { const saved = localStorage.getItem(KEY); if (saved && usable.some((x) => x.id === saved)) setId(saved); } catch { /* storage blocked */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (v: string) => { setId(v); try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };
  return { terminal: usable.find((x) => x.id === id) ?? null, usable, choose };
}

export function TerminalPicker({ usable, value, onChange }: { usable: Terminal[]; value: string; onChange: (v: string) => void }) {
  const t = useTranslations();
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} aria-label={t("pos.billing.terminal")} className="w-56">
      {usable.map((x) => <option key={x.id} value={x.id}>{x.code} · {x.name}</option>)}
    </Select>
  );
}

function ShiftBar({ terminal }: { terminal: Terminal }) {
  const t = useTranslations();
  const router = useRouter();
  const s = terminal.openSession!;
  const [live, setLive] = useState<Totals | null>(null);
  const [closing, setClosing] = useState(false);
  const [counted, setCounted] = useState("");
  const [closed, setClosed] = useState<{ expectedCash: string; countedCash: string; difference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = () => api<{ live: Totals }>(`/pos/sessions/${s.id}`).then((r) => setLive(r.live)).catch(() => undefined);
  useEffect(() => { void refresh(); }, [s.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function close(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try { setClosed(await api(`/pos/sessions/${s.id}/close`, { body: { countedCash: counted } })); } catch (err) { setError(errorText(t, err, POS_NS)); }
  }
  if (closed) {
    return (
      <Card className="flex flex-wrap items-center gap-6">
        <span>{t("pos.billing.expected")}: <b className="num">{rupees(closed.expectedCash)}</b></span>
        <span>{t("pos.billing.countedCash")}: <b className="num">{rupees(closed.countedCash)}</b></span>
        <span className={Number(closed.difference) < 0 ? "text-danger" : Number(closed.difference) > 0 ? "text-success" : ""}>{t("pos.billing.difference")}: <b className="num">{rupees(closed.difference)}</b></span>
        <Button variant="outline" onClick={() => router.refresh()}>{t("pos.billing.openShift")}</Button>
      </Card>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <span className="text-muted">{t("pos.billing.shiftTotals")}</span>
      {live ? (
        <>
          <span>{t("pos.billing.bills")}: <b className="num">{live.bills}</b></span>
          <span>{t("pos.billing.total")}: <b className="num">{rupees(live.total)}</b></span>
          <span>{t("pos.billing.modes.cash")}: <b className="num">{rupees(live.cash)}</b></span>
          <span>{t("pos.billing.modes.upi")}: <b className="num">{rupees(live.upi)}</b></span>
          <span>{t("pos.billing.modes.card")}: <b className="num">{rupees(live.card)}</b></span>
        </>
      ) : null}
      {closing ? (
        <form onSubmit={close} className="flex items-center gap-2">
          <Input value={counted} onChange={(e) => setCounted(e.target.value)} placeholder={t("pos.billing.countedCash")} aria-label={t("pos.billing.countedCash")} inputMode="decimal" className="num h-9 w-40" required autoFocus />
          <Button type="submit" variant="danger" className="h-9">{t("pos.billing.closeShift")}</Button>
          <Button type="button" variant="ghost" className="h-9" onClick={() => setClosing(false)}>{t("common.cancel")}</Button>
        </form>
      ) : <Button variant="outline" className="h-9" onClick={() => setClosing(true)}>{t("pos.billing.closeShift")}</Button>}
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}

export function OpenShift({ terminal }: { terminal: Terminal }) {
  const t = useTranslations();
  const router = useRouter();
  const [cash, setCash] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function open(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try { await api("/pos/sessions", { body: { terminalId: terminal.id, openingCash: cash || "0" } }); router.refresh(); } catch (err) { setError(errorText(t, err, POS_NS)); }
  }
  return (
    <Card className="max-w-md">
      <form onSubmit={open} className="flex flex-col gap-4">
        <Field label={t("pos.billing.openingCash")} htmlFor="sh-cash"><Input id="sh-cash" value={cash} onChange={(e) => setCash(e.target.value)} inputMode="decimal" className="num" autoFocus /></Field>
        {error ? <Alert>{error}</Alert> : null}
        <div><Button type="submit">{t("pos.billing.openShift")}</Button></div>
      </form>
    </Card>
  );
}

export function Billing({ terminals, items: allItems, settings, customers, voucher, memo, salesmen = [], canOverride = false }: {
  terminals: Terminal[]; items: PosItem[]; settings: PosSettings; customers: { id: string; name: string; nameHi: string | null }[]; voucher?: string | undefined; memo?: { id: string; number: string; lines: { itemId: string; qty: string }[] } | undefined;
  salesmen?: Salesman[]; canOverride?: boolean;
}) {
  const t = useTranslations();
  const { terminal, usable, choose } = useTerminal(terminals);
  // The store's own rates over the usual ones, for the counter in use.
  const [rates, setRates] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!terminal?.warehouseId || terminal.deviceId) { setRates({}); return; }
    api<{ rates: Record<string, string> }>(`/pos/branch-prices?warehouseId=${terminal.warehouseId}`).then((r) => setRates(r.rates)).catch(() => setRates({}));
  }, [terminal?.warehouseId, terminal?.deviceId]);
  const items = useMemo(() => allItems.map((i) => (rates[i.id] ? { ...i, saleRate: rates[i.id]! } : i)), [allItems, rates]);
  // Billing goods out on approval starts with the pieces still out; take away the ones the customer is not keeping.
  const [cart, setCart] = useState<CartLine[]>(memo ? memo.lines.map((l) => ({ itemId: l.itemId, qty: l.qty })) : []);
  const [done, setDone] = useState<Bill | null>(null);
  const [round, setRound] = useState(0);
  const [salesman, setSalesman] = useState("");
  const [helper, setHelper] = useState("");
  const [last, setLast] = useState<string | null>(null);
  const [resumed, setResumed] = useState<{ phone?: string; name?: string } | null>(null);
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const add = (id: string) => { setCart((c) => addToCart(c, id, salesman || undefined, Math.max(1, Number(items.find((x) => x.id === id)?.defaultQty) || 1))); setLast(id); };
  const reset = () => { setCart([]); setLast(null); setResumed(null); setExchange(null); setRound((r) => r + 1); };

  if (!usable.length) return <Alert>{t("pos.billing.chooseTerminal")} → <a href="/settings/pos" className="underline">{t("pos.settings.title")}</a></Alert>;
  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
      <TerminalPicker usable={usable} value={terminal?.id ?? ""} onChange={(v) => { choose(v); setCart([]); setDone(null); }} />
      {terminal?.openSession && !terminal.deviceId ? <ShiftBar key={`${terminal.id}-${round}`} terminal={terminal} /> : null}
    </div>
  );
  if (!terminal) return header;
  if (terminal.deviceId) return <div className="flex flex-col gap-4">{header}<Alert>{t("pos.billing.deviceTerminal")}</Alert></div>;
  if (!terminal.openSession) return <div className="flex flex-col gap-4">{header}<OpenShift terminal={terminal} /></div>;
  const sellable = items.filter((i) => !i.archived);
  const lastItem = last ? items.find((i) => i.id === last) : undefined;
  return (
    <div className="flex flex-col gap-4">
      {header}
      {done ? (
        <Card className="flex flex-col items-center gap-4 py-10 text-center">
          <CheckCircle2 className="size-12 text-success" aria-hidden />
          <p className="text-xl font-semibold">{t("pos.billing.done", { number: done.number })}</p>
          <p className="num text-3xl font-semibold">{rupees(done.total)}</p>
          {Number(done.change) > 0 ? <p className="text-lg text-success">{t("pos.billing.change")}: <span className="num">{rupees(done.change)}</span></p> : null}
          {done.exchange ? <p className="text-sm text-muted">{t("exchange.done", { number: done.exchange.number, amount: rupees(done.exchange.used) })}</p> : null}
          {done.exchange?.voucherCode && Number(done.exchange.left) > 0 ? (
            <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm">{t("exchange.leftCode", { amount: rupees(done.exchange.left) })} <span className="font-mono text-base font-semibold">{done.exchange.voucherCode}</span></p>
          ) : null}
          <div className="flex flex-wrap items-start justify-center gap-3">
            <a href={`/print/receipt/${done.id}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2"><Printer className="size-4" aria-hidden />{t("pos.billing.print")}</a>
            <SendWhatsApp endpoint={`/pos/bills/${done.id}/send`} phone={done.customerPhone} sent={done.autoSent} />
            <Button onClick={() => { setDone(null); setCart([]); setLast(null); }} autoFocus>{t("pos.billing.newBill")}</Button>
          </div>
        </Card>
      ) : (
        <>
          <KeyBar />
          <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="flex min-w-0 flex-col gap-3">
              <Card className="p-3">
                <ItemSearch items={sellable} onAdd={add} />
              </Card>
              <Card className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
                  <h2 className="flex items-center gap-2 text-[1rem] font-semibold">
                    {t("pos.counter.billItems")}
                    {cart.length ? <span className="rounded-[3px] bg-navy px-1.5 text-[0.7857rem] font-bold text-white">{cart.length}</span> : null}
                  </h2>
                  <Select value={salesman} onChange={(e) => { const v = e.target.value; setSalesman(v); setCart((c) => c.map((l) => (l.salesmanId || !v ? l : { ...l, salesmanId: v }))); }} className="h-8 w-48 text-[0.8571rem]" aria-label={t("pos.counter.billSalesman")}>
                    <option value="">{t("pos.counter.billSalesman")}</option>
                    {salesmen.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Select>
                  {salesman ? (
                    <Select value={helper} onChange={(e) => setHelper(e.target.value)} className="h-8 w-40 text-[0.8571rem]" aria-label={t("pos.counter.billHelper")}>
                      <option value="">{t("pos.counter.billHelper")}</option>
                      {salesmen.filter((s) => s.id !== salesman).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                  ) : null}
                </div>
                <CartTable lines={cart} items={items} onChange={setCart} salesmen={salesmen} rateEditable={!!settings.allowRateChange || canOverride} />
                <div className="flex flex-col gap-2 border-t border-border bg-surface-3 px-3 py-2.5">
                  <HeldBills terminalId={terminal.id} cart={cart}
                    onResume={(h) => { reset(); setCart(h.lines); setResumed({ ...(h.customerPhone ? { phone: h.customerPhone } : {}), ...(h.customerName ? { name: h.customerName } : {}) }); }}
                    onHeld={reset} />
                  <ExchangePanel value={exchange} onChange={setExchange} />
                </div>
              </Card>
              {lastItem?.styleId ? <SizeStock item={lastItem} warehouseId={terminal.warehouseId} onAdd={add} /> : null}
            </div>
            <div className="flex flex-col gap-3 xl:sticky xl:top-[4.5rem]">
              {cart.length ? (
                <Checkout key={round} lines={cart} items={items} settings={{ ...settings, schemes: (settings.schemes ?? []).filter((s) => !s.branchIds?.length || (terminal.branchId ? s.branchIds.includes(terminal.branchId) : true)) }} customers={customers} voucherCode={round === 0 ? voucher : undefined} canOverride={canOverride}
                  initialPhone={resumed?.phone} initialName={resumed?.name} exchange={exchange}
                  submit={(body) => api<Bill>("/pos/bills", { body: {
                    ...body, terminalId: terminal.id, ...(memo ? { memoId: memo.id } : {}), ...(salesman ? { salesmanId: salesman } : {}), ...(salesman && helper ? { helperId: helper } : {}),
                    lines: cart.map((l) => ({ itemId: l.itemId, qty: l.qty, ...(l.price ? { price: l.price } : {}), ...(l.discount ? { discount: l.discount } : {}), ...(l.salesmanId ? { salesmanId: l.salesmanId } : {}), ...(l.serials ? { serials: l.serials.split(/[\s,;]+/).filter(Boolean) } : {}) })),
                  } })}
                  onDone={(b) => { setDone(b); setRound(round + 1); setResumed(null); setExchange(null); }} />
              ) : (
                <Card className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-md bg-navy px-3 py-2.5 text-white">
                    <span className="text-[0.8571rem] font-semibold">{t("pos.billing.total")}</span>
                    <span className="num text-[1.6rem] font-bold">{rupees("0")}</span>
                  </div>
                  <p className="text-[0.9286rem] text-muted">{t("pos.counter.scanToStart")}</p>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type Held = { id: string; label: string | null; terminal: string; customerPhone: string | null; customerName: string | null; pieces: number; createdAt: string; lines: CartLine[] };

/** Park the cart (F3) and pick a parked bill back up (F4); parked bills are shared by every counter. */
function HeldBills({ terminalId, cart, onResume, onHeld }: { terminalId: string; cart: CartLine[]; onResume: (h: Held) => void; onHeld: () => void }) {
  const t = useTranslations();
  const [list, setList] = useState<Held[]>([]);
  const [open, setOpen] = useState(false);
  const [naming, setNaming] = useState(false);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const load = () => api<Held[]>("/pos/held").then(setList).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  const hold = async () => {
    setError(null);
    try {
      await api("/pos/held", { body: { terminalId, ...(label.trim() ? { label: label.trim() } : {}), lines: cart } });
      setNaming(false);
      setLabel("");
      onHeld();
      void load();
    } catch (err) { setError(errorText(t, err, POS_NS)); }
  };
  const resume = async (id: string) => {
    setError(null);
    try {
      onResume(await api<Held>(`/pos/held/${id}/resume`, { body: {} }));
      setOpen(false);
    } catch (err) { setError(errorText(t, err, POS_NS)); }
    void load();
  };
  const keys = useRef({ cart, setNaming, setOpen });
  keys.current = { cart, setNaming, setOpen };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F3") { e.preventDefault(); if (keys.current.cart.length) keys.current.setNaming(true); }
      else if (e.key === "F4") { e.preventDefault(); keys.current.setOpen((o) => !o); void load(); }
      else if (e.key === "F2") { e.preventDefault(); document.getElementById("pos-search")?.focus(); }
      // The rest of F5 to F10 belong to the bill here, even before anything is scanned.
      else if (/^F([5-9]|10)$/.test(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey, true); // capture: before the app-wide shortcuts
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="h-8 text-xs" disabled={!cart.length} onClick={() => setNaming(true)}><PauseCircle className="size-4" aria-hidden />{t("pos.counter.hold")}</Button>
        <Button variant={list.length ? "outline" : "ghost"} className="h-8 text-xs" onClick={() => { setOpen(!open); void load(); }}><ListRestart className="size-4" aria-hidden />{t("pos.counter.heldBills", { n: list.length })}</Button>
      </div>
      {naming ? (
        <form onSubmit={(e) => { e.preventDefault(); void hold(); }} className="flex gap-2">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t("pos.counter.holdLabel")} aria-label={t("pos.counter.holdLabel")} maxLength={60} className="h-8 text-sm" autoFocus />
          <Button type="submit" className="h-8 text-xs">{t("pos.counter.holdNow")}</Button>
          <Button type="button" variant="ghost" className="h-8 text-xs" onClick={() => setNaming(false)}>{t("common.cancel")}</Button>
        </form>
      ) : null}
      {open ? (
        <ul className="divide-y divide-border rounded-lg border border-border text-sm">
          {list.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="min-w-0">
                <span className="font-medium">{h.label ?? h.customerName ?? h.customerPhone ?? t("pos.counter.unnamed")}</span>
                <span className="ml-2 text-xs text-muted">{h.terminal} · {t("pos.counter.pieces", { n: h.pieces })} · {new Date(h.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              </span>
              <Button variant="outline" className="h-7 text-xs" disabled={cart.length > 0} onClick={() => void resume(h.id)}>{t("pos.counter.resume")}</Button>
            </li>
          ))}
          {!list.length ? <li className="px-3 py-2 text-muted">{t("pos.counter.noneHeld")}</li> : null}
        </ul>
      ) : null}
      {open && cart.length > 0 && list.length > 0 ? <p className="text-xs text-muted">{t("pos.counter.holdFirst")}</p> : null}
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}

type StyleGrid = { id: string; code: string; name: string; sizes: string[]; colors: string[]; variants: { id: string; color: string; size: string; stockQty: string }[] };

/** The scanned design's stock by colour and size at this counter's store; a click adds that piece. */
function SizeStock({ item, warehouseId, onAdd }: { item: PosItem; warehouseId: string; onAdd: (id: string) => void }) {
  const t = useTranslations();
  const [grid, setGrid] = useState<StyleGrid | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void api<StyleGrid>(`/styles/${item.styleId}?warehouseId=${warehouseId}`).then((g) => { if (live) setGrid(g); }).catch(() => undefined);
    void api<{ color: string | null; thumbFileId: string }[]>(`/styles/${item.styleId}/images`)
      .then((imgs) => { if (live) setPhoto((imgs.find((i) => i.color === item.color) ?? imgs.find((i) => i.color === null))?.thumbFileId ?? null); })
      .catch(() => undefined);
    return () => { live = false; };
  }, [item.styleId, item.color, warehouseId]);
  if (!grid) return null;
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-surface p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {photo ? <img src={fileUrl(photo)} alt={`${grid.name} ${item.color ?? ""}`} className="h-36 w-28 shrink-0 rounded-md object-cover" /> : null}
      <div className="min-w-0 flex-1 overflow-x-auto">
        <h3 className="mb-2 text-sm font-semibold"><span className="font-mono text-xs text-muted">{grid.code}</span> {grid.name} · {t("pos.counter.sizeStock")}</h3>
        <table className="text-sm">
          <thead><tr><th className="pr-3" />{grid.sizes.map((s) => <th key={s} className="num min-w-12 px-1 text-center font-medium text-muted">{s}</th>)}</tr></thead>
          <tbody>
            {grid.colors.map((c) => (
              <tr key={c} className={c === item.color ? "bg-primary-soft" : ""}>
                <td className="py-1 pr-3 whitespace-nowrap">{c}</td>
                {grid.sizes.map((s) => {
                  const v = grid.variants.find((x) => x.color === c && x.size === s);
                  const n = v ? Number(v.stockQty) : 0;
                  return (
                    <td key={s} className="px-1 py-1 text-center">
                      {v ? (
                        <button type="button" onClick={() => onAdd(v.id)} title={t("pos.counter.addSize")}
                          className={`num w-full rounded px-1 hover:bg-primary hover:text-on-primary ${n > 0 ? "" : "text-muted"} ${v.id === item.id ? "font-bold" : ""}`}>{n}</button>
                      ) : <span className="text-muted">·</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** The keyboard map, always visible under the counter. */
function KeyBar() {
  const t = useTranslations();
  const keys: [string, string][] = [["F2", "search"], ["F3", "hold"], ["F4", "held"], ["F5", "exchange"], ["F6", "customer"], ["F7", "discount"], ["F8", "cash"], ["F9", "upi"], ["F10", "card"], ["Ctrl+Enter", "pay"]];
  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 text-[0.8571rem] max-md:hidden">
      {keys.map(([k, v]) => <span key={k} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-3 px-2 py-1"><kbd>{k}</kbd><span className="text-text">{t(`pos.counter.keys.${v}`)}</span></span>)}
    </div>
  );
}
