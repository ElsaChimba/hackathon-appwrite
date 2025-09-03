"use client";
import { useState } from "react";
import { account, ID } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await account.create(ID.unique(), email, password, name);
    } catch (err: any) {
      if (err.code !== 409) {
        alert(err.message);
        return;
      }
    }
    await account.createEmailPasswordSession({ email, password });
    router.push("/tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-950 text-gray-100">
      <div className="w-full max-w-md bg-gray-900 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-6">Criar Conta</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
