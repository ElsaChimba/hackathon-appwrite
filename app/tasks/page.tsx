"use client";
import { useEffect, useState } from "react";
import { databases, account, ID, client } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

const DB_ID = "68b71018000720d68a36";
const COLLECTION_ID = "tasks";

type Task = {
  $id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  userId: string;
};

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get().then(setUser).catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const res = await databases.listDocuments(DB_ID, COLLECTION_ID as any);
      setTasks(res.documents as unknown as Task[]);
      setLoading(false);
      unsubscribe = client.subscribe(
        `databases.${DB_ID}.collections.${COLLECTION_ID}.documents`,
        (response: any) => {
          const doc = response.payload as Task;
          const events: string[] = response.events || [];
          if (events.some(e => e.endsWith(".create"))) {
            setTasks(prev => [...prev, doc]);
          } else if (events.some(e => e.endsWith(".update"))) {
            setTasks(prev => prev.map(t => (t.$id === doc.$id ? doc : t)));
          } else if (events.some(e => e.endsWith(".delete"))) {
            setTasks(prev => prev.filter(t => t.$id !== doc.$id));
          }
        }
      );
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const addTask = async () => {
    if (!newTask.trim() || !user) return;
    const payload = {
      title: newTask.trim(),
      description: "",
      status: "todo",
      userId: user.email,
    };
    const created = await databases.createDocument(
      DB_ID,
      COLLECTION_ID,
      ID.unique(),
      payload
    );
    setTasks(prev => [...prev, created as unknown as Task]);
    setNewTask("");
  };

  const updateStatus = async (taskId: string, newStatus: Task["status"]) => {
    const updated = await databases.updateDocument(
      DB_ID,
      COLLECTION_ID,
      taskId,
      { status: newStatus } as any
    );
    setTasks(prev =>
      prev.map(t => (t.$id === taskId ? (updated as unknown as Task) : t))
    );
  };

  const removeTask = async (taskId: string) => {
    await databases.deleteDocument(DB_ID, COLLECTION_ID, taskId);
    setTasks(prev => prev.filter(t => t.$id !== taskId));
  };

  const columns: { key: Task["status"]; label: string }[] = [
    { key: "todo", label: "A Fazer" },
    { key: "doing", label: "Em Progresso" },
    { key: "done", label: "Concluídas" },
  ];

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-gray-950 text-gray-100">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <button
          onClick={async () => {
            await account.deleteSession("current");
            router.push("/login");
          }}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition"
        >
          Sair
        </button>
      </header>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Nova tarefa..."
          className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {columns.map(({ key, label }) => (
          <div key={key} className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4">{label}</h2>
            {loading ? (
              <p className="text-gray-400">Carregando…</p>
            ) : (
              tasks
                .filter(t => t.status === key)
                .map(task => (
                  <div
                    key={task.$id}
                    className="bg-gray-800 p-3 rounded-xl flex justify-between items-center gap-3 mb-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {key !== "todo" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              task.$id,
                              key === "doing" ? "todo" : "doing"
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                        >
                          ◀
                        </button>
                      )}
                      {key !== "done" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              task.$id,
                              key === "todo" ? "doing" : "done"
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm"
                        >
                          ▶
                        </button>
                      )}
                      <button
                        onClick={() => removeTask(task.$id)}
                        className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
