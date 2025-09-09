"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isProblemUser, isPerformanceUser } from "@/lib/flags";
import { getCartCount } from "@/lib/cart";
import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaCartShopping, FaUser } from 'react-icons/fa6'; // Fa6 para a versão mais recente
      
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const q = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(q);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const performance = isPerformanceUser();
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    // Initialize cart count on mount
    setCartCount(getCartCount());
    // Listen for cart updates
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as { count?: number } | undefined;
      if (detail && typeof detail.count === "number") {
        setCartCount(detail.count);
      } else {
        // Fallback in case no detail
        setCartCount(getCartCount());
      }
    };
    window.addEventListener("cart:updated", onUpdate as EventListener);
    return () => {
      window.removeEventListener("cart:updated", onUpdate as EventListener);
    };
  }, []);

  // Close profile menu on outside click or Escape
  useEffect(() => {
    if (!showMenu) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setShowMenu(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showMenu]);

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
    
    // Performance problem: Simulate rapid clicks and delayed search for performance_user
    if (performance) {
      clickCountRef.current++;
      
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Simulate performance issue with artificial delay (debounce with long delay)
      searchTimeoutRef.current = setTimeout(() => {
        if (pathname === "/home") {
          // Add extra delay to simulate slow search
          setTimeout(() => {
            router.replace(makeUrl(value));
          }, 300 + Math.random() * 700); // Random delay 300-1000ms
        }
      }, 800); // Long debounce delay
      
      return;
    }
    
    // Normal behavior for other users
    if (pathname === "/home" && !isProblemUser()) {
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
            <Image src="/Logo (3).png" alt="Logo" width={42} height={42} style={{ height: "auto" }} />
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
          <NavLink href={isProblemUser() ? "/cart" : "/about"} label="Sobre" />
          <NavLink href="#" label="Contato" />

          <Link
            href={isProblemUser() ? "/about" : "/cart"}
            aria-label="Cart"
            className={`relative ml-2 p-2 rounded transition-colors text-black ${
              pathname.startsWith("/cart") ? "bg-gray-300" : "hover:bg-gray-300"
            }`}
          >
            <FaCartShopping />
            {cartCount > 0 && (
              <span
                aria-label="Itens no carrinho"
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] leading-[18px] text-center font-semibold"
              >
                {cartCount}
              </span>
            )}
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              aria-label="Profile"
              className="p-2 rounded hover:bg-gray-300 cursor-pointer text-black"
              onClick={() => setShowMenu((v) => !v)}
            >
              <FaUser />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-2 z-50">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-300 cursor-pointer text-black"
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
