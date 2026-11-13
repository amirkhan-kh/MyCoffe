/** Admin tabs announce saves here so menus open in the same browser update instantly. */
export const MENU_CHANNEL = "mycoffee-menu";

export function announceMenuChange(updatedAt: string) {
  if (typeof BroadcastChannel === "undefined") return;
  const ch = new BroadcastChannel(MENU_CHANNEL);
  ch.postMessage(updatedAt);
  ch.close();
}
