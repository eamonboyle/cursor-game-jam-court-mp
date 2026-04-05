export type CaseCard = { readonly id: string; readonly label: string };
export type CaseEvidence = { readonly id: string; readonly label: string };

export type CasePack = {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly witnessId: string;
  readonly prosecutionCards: readonly CaseCard[];
  readonly defenseCards: readonly CaseCard[];
  readonly evidence: readonly CaseEvidence[];
};

export type CaseIndexEntry = { readonly id: string; readonly title: string };

export type CaseIndexFile = {
  readonly defaultCaseId: string;
  readonly cases: readonly CaseIndexEntry[];
};

function isNonEmptyString(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

export function assertCasePack(raw: unknown): CasePack {
  if (raw === null || typeof raw !== "object") throw new Error("case: not an object");
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o["id"])) throw new Error("case: missing id");
  if (!isNonEmptyString(o["title"])) throw new Error("case: missing title");
  const tagline = isNonEmptyString(o["tagline"]) ? o["tagline"] : "";
  if (!isNonEmptyString(o["witnessId"])) throw new Error("case: missing witnessId");

  const pro = o["prosecutionCards"];
  const def = o["defenseCards"];
  const ev = o["evidence"];
  if (!Array.isArray(pro) || pro.length === 0) throw new Error("case: prosecutionCards");
  if (!Array.isArray(def) || def.length === 0) throw new Error("case: defenseCards");
  if (!Array.isArray(ev) || ev.length === 0) throw new Error("case: evidence");

  const mapCard = (x: unknown, i: number): CaseCard => {
    if (x === null || typeof x !== "object") throw new Error(`case: card ${i}`);
    const c = x as Record<string, unknown>;
    if (!isNonEmptyString(c["id"]) || !isNonEmptyString(c["label"]))
      throw new Error(`case: card ${i} id/label`);
    return { id: c["id"], label: c["label"] };
  };
  const mapEv = (x: unknown, i: number): CaseEvidence => {
    if (x === null || typeof x !== "object") throw new Error(`case: ev ${i}`);
    const c = x as Record<string, unknown>;
    if (!isNonEmptyString(c["id"]) || !isNonEmptyString(c["label"]))
      throw new Error(`case: ev ${i} id/label`);
    return { id: c["id"], label: c["label"] };
  };

  return {
    id: o["id"],
    title: o["title"],
    tagline,
    witnessId: o["witnessId"],
    prosecutionCards: pro.map(mapCard),
    defenseCards: def.map(mapCard),
    evidence: ev.map(mapEv),
  };
}

export function assertCaseIndexFile(raw: unknown): CaseIndexFile {
  if (raw === null || typeof raw !== "object") throw new Error("case index: not an object");
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o["defaultCaseId"])) throw new Error("case index: defaultCaseId");
  const cases = o["cases"];
  if (!Array.isArray(cases) || cases.length === 0) throw new Error("case index: cases");
  const out: CaseIndexEntry[] = [];
  for (let i = 0; i < cases.length; i++) {
    const e = cases[i];
    if (e === null || typeof e !== "object") throw new Error(`case index: entry ${i}`);
    const r = e as Record<string, unknown>;
    if (!isNonEmptyString(r["id"]) || !isNonEmptyString(r["title"]))
      throw new Error(`case index: entry ${i}`);
    out.push({ id: r["id"], title: r["title"] });
  }
  return { defaultCaseId: o["defaultCaseId"], cases: out };
}
