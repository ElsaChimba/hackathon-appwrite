"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        Task Manager
      </h1>

      <p className="mt-6 text-xl text-gray-400 max-w-2xl leading-relaxed">
        Organize suas tarefas de forma <span className="text-indigo-400 font-semibold">simples</span>, 
        <span className="text-purple-400 font-semibold"> flexível</span> e 
        <span className="text-pink-400 font-semibold"> elegante</span>.
      </p>

      <div className="mt-10 flex gap-6">
        <Link
          href="/login"
          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition transform hover:scale-105 shadow-lg"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="px-7 py-3 rounded-2xl border border-gray-700 bg-gray-900 hover:border-indigo-400 hover:text-indigo-300 transition transform hover:scale-105 shadow-lg"
        >
          Criar conta
        </Link>
      </div>

      <footer className="absolute bottom-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Task Manager — Todos os direitos reservados by Elsa Chimba
      </footer>
    </div>
  );
}
