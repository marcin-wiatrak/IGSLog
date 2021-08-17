export const checkPermissions = (permission, userPermissions) => {
  const permsArray = userPermissions || [];
  if (permsArray.includes('admin') || !permission) return true;
  return permission ? permsArray.includes(permission) : true;
};
