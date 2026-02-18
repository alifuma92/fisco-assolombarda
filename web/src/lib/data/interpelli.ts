import { getInterpelliDatabase } from "./loader";
import type { Interpello } from "../types";

let byIdIndex: Map<string, Interpello> | null = null;
let byNumeroAnnoIndex: Map<string, Interpello> | null = null;

function ensureIndexes() {
  if (byIdIndex) return;
  const db = getInterpelliDatabase();
  byIdIndex = new Map();
  byNumeroAnnoIndex = new Map();
  for (const ip of db.interpelli) {
    byIdIndex.set(ip.id, ip);
    byNumeroAnnoIndex.set(`${ip.numero}_${ip.anno}`, ip);
  }
}

export function getInterpelloById(id: string): Interpello | undefined {
  ensureIndexes();
  return byIdIndex!.get(id);
}

export function getInterpelloByNumeroAnno(
  numero: number,
  anno: number
): Interpello | undefined {
  ensureIndexes();
  return byNumeroAnnoIndex!.get(`${numero}_${anno}`);
}

export function getInterpelliByTag(tag: string): Interpello[] {
  const db = getInterpelliDatabase();
  return db.interpelli.filter((ip) => ip.tag === tag);
}

export function getInterpelliByTemi(temi: string[]): Interpello[] {
  const db = getInterpelliDatabase();
  const temiSet = new Set(temi);
  return db.interpelli.filter((ip) => ip.temi.some((t) => temiSet.has(t)));
}
