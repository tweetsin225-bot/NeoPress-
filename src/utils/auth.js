const AUTH_KEY = "neopress_admin";

export const adminCredentials = {
  email: "admin@neopress.io",
  password: "NeoTokyo2024!",
};

export const getAdminSession = () => {
  return localStorage.getItem(AUTH_KEY) === "active";
};

export const setAdminSession = (isActive) => {
  if (isActive) {
    localStorage.setItem(AUTH_KEY, "active");
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};
