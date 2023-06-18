export async function hasClipboardReadPermission() {
  const permission = await navigator.permissions.query({
    // @ts-ignore
    name: "clipboard-read",
  });

  const has = permission.state === "granted";

  return has;
}
