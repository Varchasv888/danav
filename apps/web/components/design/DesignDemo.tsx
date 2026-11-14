"use client";

import { useState } from "react";
import { Combobox, DateField, MoneyField, type ComboOption } from "../fields";
import { useToast } from "../Toast";
import { Button, Card, Field, Input, Select } from "../ui";

const PARTIES: ComboOption[] = [
  { value: "1", label: "Sharma Stores", sub: "Guwahati", right: "₹ 4,09,088 Dr" },
  { value: "2", label: "Gupta Suppliers", sub: "Kolkata", right: "₹ 82,500 Cr" },
  { value: "3", label: "Raymond Fabrics Ltd", sub: "Mumbai", right: "₹ 1,84,200 Cr" },
  { value: "4", label: "Arvind Mills Global", sub: "Ahmedabad", right: "₹ 0" },
];

/** Every primitive in its states, for checking the design system by eye. Not linked from the menus. */
export function DesignDemo() {
  const [amount, setAmount] = useState("1234567.5");
  const [date, setDate] = useState("2026-11-11");
  const [party, setParty] = useState("1");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [rows, setRows] = useState<ComboOption[]>(PARTIES);
  const { toast } = useToast();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-4">
        <h2 className="text-base leading-6 font-semibold">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">Delete</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button loading={saving} done={done} onClick={() => { setSaving(true); setDone(false); setTimeout(() => { setSaving(false); setDone(true); setTimeout(() => setDone(false), 1200); }, 900); }}>Save invoice</Button>
          <span className="text-sm text-muted">Press it: spinner keeps the width, then a green tick.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Invoice INV-26-27-00881 saved", detail: "Stock reduced and the books posted.", action: { label: "Print invoice (F9)", href: "/design" } })}>Show a success toast</Button>
          <Button variant="outline" onClick={() => toast({ tone: "danger", title: "Could not save", detail: "The customer is over their credit limit." })}>Show an error toast</Button>
        </div>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-base leading-6 font-semibold">Text fields</h2>
        <Field label="Customer name" required hint="As on the GST certificate."><Input placeholder="Type a name" value={text} onChange={(e) => setText(e.target.value)} /></Field>
        <Field label="GSTIN" error="This GSTIN is not valid."><Input defaultValue="27AAAA" aria-invalid /></Field>
        <Field label="Disabled"><Input disabled defaultValue="Locked after posting" /></Field>
        <Field label="Drop-down"><Select defaultValue="b"><option value="a">Regular</option><option value="b">Composition</option></Select></Field>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-base leading-6 font-semibold">Money and date</h2>
        <Field label="Amount received" hint="Type 1234567.5, paste ₹ 12,500.00, or Tab in to select it all."><MoneyField value={amount} onValueChange={setAmount} words /></Field>
        <Field label="Invoice date" hint="Try t, y, e, +3, 1111, 111126 or 5 dec."><DateField value={date} onValueChange={setDate} /></Field>
        <p className="text-sm text-muted">Kept as: <span className="font-mono">{amount || "(empty)"}</span> and <span className="font-mono">{date || "(empty)"}</span></p>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-base leading-6 font-semibold">Picker</h2>
        <Field label="Customer" hint="Type to search; Up and Down, Enter, Esc. The last row makes a new one.">
          <Combobox value={party} onValueChange={(v) => setParty(v)} options={rows} placeholder="Find a customer"
            onCreate={(q) => { const o = { value: String(rows.length + 1), label: q || "New customer", sub: "Just added", right: "₹ 0" }; setRows([...rows, o]); setParty(o.value); }} />
        </Field>
        <Field label="Table cell look">
          <table className="w-full"><tbody><tr><td className="w-1/2"><Input defaultValue="Cotton shirt" /></td><td><Select defaultValue="x"><option value="x">PCS</option></Select></td></tr></tbody></table>
        </Field>
      </Card>
    </div>
  );
}
