import { createContext } from "react";

/**
 * Context providing rename control callbacks for key items.
 * Key provides the callbacks; children like KeyActions consume them.
 */
const RenameContext = createContext<{
  /**
   * Enter rename mode for this key.
   */
  startRename: () => void;
  /**
   * Exit rename mode for this key.
   */
  endRename: () => void;
}>({
  startRename: () => {},
  endRename: () => {},
});

export default RenameContext;
