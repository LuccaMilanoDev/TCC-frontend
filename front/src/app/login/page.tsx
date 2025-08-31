"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/home");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(username.trim(), password);
    if (res.ok) {
      router.replace("/home");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <section className="w-full md:w-1/2 bg-white flex flex-col">
        <div className="p-8">
          <Image src="/Logo (3).png" alt="Logo" width={120} height={120} priority />
        </div>
        <div className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-md px-8 mt-24">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Login</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400 text-black placeholder:text-gray bg-white caret-black"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-gray-400 text-black placeholder:text-gray bg-white caret-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Alternar visibilidade da senha"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-700 cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {error && (
                <p role="alert" className="text-red-600 text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gray-700 text-white rounded-md py-2 cursor-pointer hover:bg-gray-300 hover:text-black"
                disabled={!username || !password}
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </section>
      <section className="hidden md:flex w-1/2 bg-gray-200 items-start justify-center">
        <div className="mt-28 w-full max-w-md px-6">
          <h2 className="text-5xl font-semibold text-gray-700 mb-8 text-center">Logins</h2>
          <div className="space-y-4">
            <div className="bg-white border border-gray-300 rounded-md p-4">
              <h3 className="text-gray-800 font-semibold mb-2 text-sm uppercase tracking-wide">Usuarios aceitos:</h3>
              <ul className="text-gray-700 text-sm space-y-1 list-disc pl-5">
                <li><code className="px-1 bg-gray-100 rounded">standard_user</code></li>
                <li><code className="px-1 bg-gray-100 rounded">problem_user</code></li>
              </ul>
            </div>
            <div className="bg-white border border-gray-300 rounded-md p-4">
              <h3 className="text-gray-800 font-semibold mb-2 text-sm uppercase tracking-wide">Senha para todos os usuarios:</h3>
              <p className="text-gray-700 text-sm"><code className="px-1 bg-gray-100 rounded">password</code></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
