// Utility to cleanly import parcels from @shared-ui/shared-ui
// This avoids repetitive System.import().then() patterns

// Cache the loading promise to avoid multiple imports
let loadingPromise = null;

function getSharedUi() {
  if (!loadingPromise) {
    loadingPromise = System.import("@shared-ui/shared-ui");
  }
  return loadingPromise;
}

export const sharedUIPromise = () => getSharedUi().then((m) => m);


// Export individual parcel loaders - clean and reusable
// These can be imported like normal imports and used directly with Single-SPA Parcel components
export const ButtonParcel = () => getSharedUi().then((m) => {
  return m.ButtonParcel
});
export const VerticalStepperParcel = () =>
  getSharedUi().then((m) => m.VerticalStepperParcel);
export const NavigationButtonsParcel = () =>
  getSharedUi().then((m) => m.NavigationButtonsParcel);
export const ServicePageLayoutParcel = () =>
  getSharedUi().then((m) => m.ServicePageLayoutParcel);

export const FormLabelParcel = () =>
  getSharedUi().then((m) => m.FormLabelParcel);
export const FormInputParcel = () =>
  getSharedUi().then((m) => m.FormInputParcel);
export const FormSelectParcel = () =>
  getSharedUi().then((m) => m.FormSelectParcel);

// Table component
export const PaymentTableParcel = () =>
  getSharedUi().then((m) => m.PaymentTableParcel);

// Export form utilities if needed
export const form = () => getSharedUi().then((m) => m.form);
