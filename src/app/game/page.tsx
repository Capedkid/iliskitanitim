"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    // Ana oyun sayfasına yönlendir
    router.push("/game/selection");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-fuchsia-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">💖</div>
        <p className="text-rose-600">Oyunlar yükleniyor...</p>
      </div>
    </div>
  );
}
