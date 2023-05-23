export async function isPermissionDenied() {
  const permission = await navigator.permissions.query({
    // @ts-ignore
    name: "clipboard-read",
  });

  const has = permission.state === "denied";

  return has;
}
