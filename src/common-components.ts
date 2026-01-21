// Utility to cleanly import parcels from @common/common-components
// This avoids repetitive System.import().then() patterns

// Cache the loading promise to avoid multiple imports
let loadingPromise: Promise<any> | null = null;

function getCommonComponents(): Promise<any> {
  if (!loadingPromise) {
    loadingPromise = System.import("@common/common-components");
  }
  return loadingPromise;
}

// Export individual parcel loaders - clean and reusable
export const FeeSummaryParcel = () =>
  getCommonComponents().then((m) => m.FeeSummaryParcel);
