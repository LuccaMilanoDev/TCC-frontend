"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-zinc-400 to-zinc-800">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center md:justify-start">
              <Image
                src="/Logo (3).png"
                alt="Logo Teste Lab"
                width={420}
                height={420}
                className="opacity-80"
                priority
              />
            </div>

            <div className="text-white/90">
              <h1 className="text-4xl font-semibold mb-6">Sobre nós</h1>
              <p className="leading-relaxed text-base md:text-lg text-white/90">
                A plataforma propõe um ambiente especializado para o ensino e a prática de testes de software, pensado para iniciantes e estudantes da área de tecnologia. Em um espaço controlado e seguro, o usuário pode explorar conceitos, aplicar diferentes tipos de testes e acompanhar resultados de forma prática e interativa. O objetivo é facilitar o aprendizado, reduzir barreiras de entrada e estimular o desenvolvimento de habilidades essenciais para a qualidade de software no mercado.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
