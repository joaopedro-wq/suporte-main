"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-center">
          Redirecionando para a página de login...
        </h1>
      </div>
    </AuthProvider>
  );
}
