import { describe, expect, it } from "vitest";
import {
  DEFAULT_CASE_ID,
  getCasePack,
  isRegisteredCaseId,
  listCaseSummaries,
  resolveHostCaseId,
} from "./caseRegistry";

describe("caseRegistry", () => {
  it("lists at least three dossiers", () => {
    expect(listCaseSummaries().length).toBeGreaterThanOrEqual(3);
  });

  it("resolves default pack", () => {
    const p = getCasePack(DEFAULT_CASE_ID);
    expect(p.id).toBe(DEFAULT_CASE_ID);
    expect(p.prosecutionCards.length).toBeGreaterThan(0);
    expect(p.evidence.length).toBeGreaterThan(0);
  });

  it("falls back for unknown ids", () => {
    const p = getCasePack("not_a_real_case");
    expect(p.id).toBe(DEFAULT_CASE_ID);
  });

  it("resolveHostCaseId validates", () => {
    expect(resolveHostCaseId("case_parcel_of_doubt")).toBe("case_parcel_of_doubt");
    expect(resolveHostCaseId(undefined)).toBe(DEFAULT_CASE_ID);
    expect(resolveHostCaseId("nope")).toBe(DEFAULT_CASE_ID);
  });

  it("isRegisteredCaseId", () => {
    expect(isRegisteredCaseId("case_verified_hot_take")).toBe(true);
    expect(isRegisteredCaseId("missing")).toBe(false);
  });
});
