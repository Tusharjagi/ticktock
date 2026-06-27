"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in, skip the login screen.
  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/timesheets");
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/timesheets");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : TEXT.login.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
          <h1 className="mb-8 text-2xl font-bold text-ink">{TEXT.login.heading}</h1>

          <div className="flex flex-col gap-5">
            <Field label={TEXT.login.emailLabel} htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={TEXT.login.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label={TEXT.login.passwordLabel} htmlFor="password">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder={TEXT.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-body">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand accent-brand focus:ring-brand"
              />
              {TEXT.login.rememberMe}
            </label>

            {error && (
              <p className="rounded-md bg-bad-bg px-3 py-2 text-sm text-bad-fg" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth loading={submitting}>
              {TEXT.login.submit}
            </Button>

            <p className="text-center text-xs text-faint">
              {TEXT.login.demoLabel}{" "}
              <span className="font-medium">{TEXT.login.demoEmail}</span> /{" "}
              {TEXT.login.demoPassword}
            </p>
          </div>
        </form>
      </div>

      {/* Right — brand panel */}
      <div className="hidden flex-col justify-center bg-brand px-12 py-12 lg:flex">
        <h2 className="mb-5 text-4xl font-bold text-white">{TEXT.app.name}</h2>
        <p className="max-w-md text-base leading-relaxed text-white/85">
          {TEXT.login.brandDescription}
        </p>
      </div>
    </div>
  );
}
