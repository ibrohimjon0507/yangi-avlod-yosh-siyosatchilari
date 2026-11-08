"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import BrandMark from "../BrandMark";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <div className="adm-login">
      <form action={action} className="adm-login-card">
        <div className="adm-brand">
          <BrandMark />
          <span>
            <b>YANGI AVLOD</b>
            <small>Admin panel</small>
          </span>
        </div>
        <h1>Tizimga kirish</h1>
        {!configured && <p className="adm-alert">Admin paroli hali oʻrnatilmagan. Vercel loyihasi sozlamalarida <code>ADMIN_PASSWORD</code> oʻzgaruvchisini qoʻshing.</p>}
        <label htmlFor="password">Parol</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus disabled={!configured || pending} />
        {state.error && (
          <p className="adm-error" role="alert">
            {state.error}
          </p>
        )}
        <button className="adm-btn primary" type="submit" disabled={!configured || pending}>
          {pending ? "Tekshirilmoqda…" : "Kirish"}
        </button>
        <Link className="adm-back" href="/">
          ← Saytga qaytish
        </Link>
      </form>
    </div>
  );
}
