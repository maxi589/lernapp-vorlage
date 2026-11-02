"use client";

import { useCallback, useEffect, useState } from "react";
import { insert, list, remove, update, type TableName } from "./data";
import type { Tables } from "./types";

// Lädt eine Tabelle und bietet Hinzufügen, Ändern, Löschen. Die Liste aktualisiert sich sofort.
export function useTable<T extends TableName>(table: T) {
  const [rows, setRows] = useState<Tables[T][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setRows(await list(table));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Laden fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function add(row: Omit<Tables[T], "id" | "created_at">) {
    const saved = await insert(table, row);
    setRows((r) => [...r, saved]);
    return saved;
  }
  async function patch(id: string, p: Partial<Tables[T]>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));
    await update(table, id, p);
  }
  async function del(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
    await remove(table, id);
  }

  return { rows, loading, error, add, patch, del, reload };
}
