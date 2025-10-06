"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function HeartDivider() {
  return (
    <div className="relative mx-auto h-[1px] w-full max-w-[560px] bg-rose-100/70">
      <div className="absolute left-1/2 -top-3 -translate-x-1/2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 shadow-sm ring-1 ring-rose-300/40">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 21s-6.716-4.507-9.192-7.4C.948 11.51 1.2 7.7 4.32 6.34 6.4 5.4 8.3 6.1 9.4 7.2L12 9.8l2.6-2.6c1.1-1.1 3-1.8 5.08-.86 3.12 1.36 3.37 5.17 1.51 7.26C18.716 16.493 12 21 12 21z" fill="currentColor" className="text-rose-500" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === "1309") {
      // Store authentication in cookie
      document.cookie = "authenticated=true; path=/; max-age=86400"; // 24 hours
      router.push("/");
    } else {
      setError("Yanlış şifre, tekrar dene 💔");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-white mb-2">
            Aşkımızın
            <br />
            <span className="text-rose-400">Özel Sayfası</span>
          </h1>
          <p className="text-white/70 text-lg">
            :)
          </p>
        </div>

        <div className="mt-8">
          <HeartDivider />
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-3xl bg-black/20 backdrop-blur ring-1 ring-rose-300/50 p-8">
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Özel Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="şifre..."
                className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur border border-rose-300/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/50 text-white font-medium rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-rose-500/30"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap 💖"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
