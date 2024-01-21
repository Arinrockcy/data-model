// Importing ERRORCONSTANTS from the "error-code" file
import ERRORCONSTANTS from "./error-code.js";

// Creating a new constant ERRORCONSTANTS_KEYS_AS_VALUES by mapping keys to their values
const ERRORLABEL = Object.entries(ERRORCONSTANTS).reduce((acc, [key,]) => {
  // Mapping each key to itself as the value
  acc[key] = key;
  return acc;
}, {});

// Exporting the ERRORCONSTANTS_KEYS_AS_VALUES constant for use in other modules
export default ERRORLABEL;