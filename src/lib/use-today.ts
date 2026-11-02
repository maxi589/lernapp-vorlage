"use client";

import { useEffect, useState } from "react";
import { iso } from "./dates";

// "Heute" erst im Browser bestimmen. Beim Bauen ist es leer, damit nichts falsch vorab gerendert wird.
export function useToday() {
  const [today, setToday] = useState("");
  useEffect(() => setToday(iso(new Date())), []);
  return today;
}
