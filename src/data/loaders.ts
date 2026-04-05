import { getCasePack, listCaseSummaries } from "./caseRegistry";

/**
 * Validates the bundled case catalog at startup (throws if JSON or index is wrong).
 */
export async function loadCaseCatalog(): Promise<void> {
  await Promise.resolve();
  for (const c of listCaseSummaries()) {
    void getCasePack(c.id);
  }
}
