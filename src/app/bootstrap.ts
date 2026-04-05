import { AppRoot } from "./AppRoot";
import { installGlobalErrorHandlers } from "./installGlobalErrorHandlers";

export function createApp(): AppRoot {
  installGlobalErrorHandlers();
  return new AppRoot();
}
