// Shared loader settings so every useJsApiLoader call uses identical args
// (mismatched options across components blank the page when the second
// loader tries to re-init Google Maps with different libraries).

const RAW_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? "";

// Tolerate trailing punctuation/whitespace in the .env value.
export const GOOGLE_MAPS_API_KEY = RAW_KEY.replace(/[;\s]+$/, "").trim();

export const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];
