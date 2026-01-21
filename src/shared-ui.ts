// Utility to cleanly import parcels from @shared-ui/shared-ui
// This avoids repetitive System.import().then() patterns

// Cache the loading promise to avoid multiple imports
let loadingPromise: Promise<any> | null = null;

function getSharedUi(): Promise<any> {
  if (!loadingPromise) {
    loadingPromise = System.import("@shared-ui/shared-ui");
  }
  return loadingPromise;
}

// Export individual parcel loaders - clean and reusable
export const ButtonParcel = () => getSharedUi().then((m) => m.ButtonParcel);
export const VerticalStepperParcel = () =>
  getSharedUi().then((m) => m.VerticalStepperParcel);
export const NavigationButtonsParcel = () =>
  getSharedUi().then((m) => m.NavigationButtonsParcel);
export const ServicePageLayoutParcel = () =>
  getSharedUi().then((m) => m.ServicePageLayoutParcel);

// Form components
export const FormLabelParcel = () =>
  getSharedUi().then((m) => m.FormLabelParcel);
export const FormInputParcel = () =>
  getSharedUi().then((m) => m.FormInputParcel);
export const FormSelectParcel = () =>
  getSharedUi().then((m) => m.FormSelectParcel);

// Table component
export const PaymentTableParcel = () =>
  getSharedUi().then((m) => m.PaymentTableParcel);
