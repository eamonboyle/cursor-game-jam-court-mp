import caseParcel from "../../data/cases/case_parcel_of_doubt.json";
import caseStub from "../../data/cases/case_stub_v_internet.json";
import caseHotTake from "../../data/cases/case_verified_hot_take.json";
import caseIndex from "../../data/cases/index.json";
import {
  assertCaseIndexFile,
  assertCasePack,
  type CaseIndexEntry,
  type CasePack,
} from "./caseTypes";

const INDEX = assertCaseIndexFile(caseIndex);

const RAW_PACKS: Record<string, unknown> = {
  case_stub_v_internet: caseStub,
  case_verified_hot_take: caseHotTake,
  case_parcel_of_doubt: caseParcel,
};

const PACKS: Map<string, CasePack> = new Map();

for (const entry of INDEX.cases) {
  const raw = RAW_PACKS[entry.id];
  if (raw === undefined) {
    throw new Error(`caseRegistry: missing JSON for case ${entry.id}`);
  }
  PACKS.set(entry.id, assertCasePack(raw));
}

/** Default docket for URLs with no `?case=` and for invalid IDs. */
export const DEFAULT_CASE_ID: string = INDEX.defaultCaseId;

export function getCasePack(caseId: string): CasePack {
  const p = PACKS.get(caseId);
  if (p) return p;
  return PACKS.get(DEFAULT_CASE_ID) ?? (() => {
    throw new Error("caseRegistry: no packs");
  })();
}

export function isRegisteredCaseId(caseId: string): boolean {
  return PACKS.has(caseId);
}

export function listCaseSummaries(): readonly CaseIndexEntry[] {
  return INDEX.cases;
}

export function resolveHostCaseId(caseId: string | undefined): string {
  if (caseId && isRegisteredCaseId(caseId)) return caseId;
  return DEFAULT_CASE_ID;
}
