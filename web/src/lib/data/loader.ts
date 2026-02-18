import { readFileSync } from "fs";
import { join } from "path";
import type { TUDatabase, InterpelliDatabase } from "../types";

let tuCache: TUDatabase | null = null;
let ipCache: InterpelliDatabase | null = null;

function getDataDir(): string {
  return join(process.cwd(), "data");
}

export function getTUDatabase(): TUDatabase {
  if (!tuCache) {
    const raw = readFileSync(
      join(getDataDir(), "testo_unico_iva_database.json"),
      "utf-8"
    );
    tuCache = JSON.parse(raw) as TUDatabase;
  }
  return tuCache;
}

export function getInterpelliDatabase(): InterpelliDatabase {
  if (!ipCache) {
    const raw = readFileSync(
      join(getDataDir(), "interpelli_2024_2025_database.json"),
      "utf-8"
    );
    ipCache = JSON.parse(raw) as InterpelliDatabase;
  }
  return ipCache;
}
