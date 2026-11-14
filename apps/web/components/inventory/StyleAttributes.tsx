"use client";

import { STYLE_ATTRIBUTES } from "@varchasv/domain";
import { useTranslations } from "next-intl";
import { LookupOptions } from "../masters/LookupOptions";
import { Field, Input } from "../ui";

const field = (kind: string) => `attr_${kind}`;

/** The values collected by <StyleAttributes>: a record of attribute to value, empty ones left out. */
export function readAttributes(f: FormData): Record<string, string> {
  return Object.fromEntries(STYLE_ATTRIBUTES.map((k) => [k, String(f.get(field(k)) ?? "").trim()]));
}

/**
 * Describes a style with the business's own lists (fabric, sleeves, neck, fit, style, gender, type, material
 * and two spare sub-categories). Each box suggests the entries of its list and still accepts a new word.
 */
export function StyleAttributes({ values = {}, prefix }: { values?: Record<string, string>; prefix: string }) {
  const t = useTranslations();
  return (
    <fieldset className="col-span-full">
      <legend className="mb-2 text-[0.8571rem] font-medium text-muted">{t("styles.attributes")}</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STYLE_ATTRIBUTES.map((k) => (
          <Field key={k} label={t(`menu.i.${k}`)} htmlFor={`${prefix}-${k}`}>
            <Input id={`${prefix}-${k}`} name={field(k)} defaultValue={values[k] ?? ""} maxLength={60} list={`${prefix}-${k}-list`} />
            <LookupOptions id={`${prefix}-${k}-list`} kind={k} />
          </Field>
        ))}
      </div>
    </fieldset>
  );
}
