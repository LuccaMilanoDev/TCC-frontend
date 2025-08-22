"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const q = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  const makeUrl = useMemo(() => {
    return (nextQ: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextQ) params.set("q", nextQ);
      else params.delete("q");
      return `${pathname}?${params.toString()}`.replace(/\?$/, "");
    };
  }, [pathname, searchParams]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    // Atualiza apenas quando estiver na /home
    if (pathname === "/home") {
      router.replace(makeUrl(value));
    }
  };
  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === href ? "text-black" : "text-gray-600 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="w-full bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/Logo (3).png" alt="Logo" width={42} height={42} />
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <input
              type="text"
              aria-label="Buscar produtos"
              placeholder="Busca"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-black placeholder:text-gray-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink href="/home" label="Inicio" />
          <NavLink href="/about" label="Sobre" />
          <NavLink href="#" label="Contato" />

          <Link
            href="/cart"
            aria-label="Cart"
            className={`ml-2 p-2 rounded transition-colors ${
              pathname.startsWith("/cart") ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            🛒
          </Link>
          <div className="relative">
            <button
              aria-label="Profile"
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setShowMenu((v) => !v)}
            >
              👤
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-2 z-50">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                    router.replace("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
