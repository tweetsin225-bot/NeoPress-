const ROLE_KEY = "neopress_role";

export const ROLES = {
  ADMIN: "Admin",
  EDITOR: "Editor",
  AUTHOR: "Author",
};

export const getStoredRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const setStoredRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const clearStoredRole = () => {
  localStorage.removeItem(ROLE_KEY);
};

export const canManageAllPosts = (role) => {
  return role === ROLES.ADMIN || role === ROLES.EDITOR;
};

export const canEditPosts = (role) => {
  return role === ROLES.ADMIN || role === ROLES.EDITOR || role === ROLES.AUTHOR;
};
