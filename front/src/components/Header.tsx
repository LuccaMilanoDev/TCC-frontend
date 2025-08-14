"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
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
              placeholder="Busca"
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
          <button aria-label="Profile" className="p-2 rounded hover:bg-gray-100">
            👤
          </button>
        </nav>
      </div>
    </header>
  );
}
