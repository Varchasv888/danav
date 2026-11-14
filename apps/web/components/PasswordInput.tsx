"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type InputHTMLAttributes } from "react";
import { Input } from "./ui";

/** A password field with a button that shows or hides what was typed. The button is a real, labelled control, so it works by keyboard and screen reader. */
export function PasswordInput({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const t = useTranslations("auth");
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={shown ? "text" : "password"} className={`pr-10 ${className ?? ""}`} />
      <button type="button" onClick={() => setShown((s) => !s)} aria-pressed={shown} aria-controls={props.id}
        title={shown ? t("hidePassword") : t("showPassword")}
        className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-md text-muted hover:text-text">
        {shown ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        <span className="sr-only">{shown ? t("hidePassword") : t("showPassword")}</span>
      </button>
    </div>
  );
}
