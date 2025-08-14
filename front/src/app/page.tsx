"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen flex">
      <section className="w-1/2 bg-white flex flex-col">
        <div className="p-8">
          <Image src="/Logo (3).png" alt="Logo" width={120} height={120} priority />
        </div>
        <div className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-md px-8 mt-24">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Login</h1>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Usuário"
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400 text-black placeholder:text-gray bg-white caret-black"
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Senha"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-gray-400 text-black placeholder:text-gray bg-white caret-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Alternar visibilidade da senha"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-700"
                >
                </button>
              </div>
              <button
                type="button"
                onClick={() => router.push("/home")}
                className="w-full bg-gray-700 text-white rounded-md py-2"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="w-1/2 bg-gray-200 flex items-start justify-center">
        <h2 className="text-5xl font-semibold text-gray-700 mt-52">logins</h2>
      </section>
    </div>
  );
}
