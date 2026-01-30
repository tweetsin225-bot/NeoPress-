const STORAGE_KEY = "neopress_posts";
const DELETED_KEY = "neopress_deleted";

export const loadPosts = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse posts", error);
    return [];
  }
};

export const savePosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const loadDeletedIds = () => {
  const raw = localStorage.getItem(DELETED_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse deleted ids", error);
    return [];
  }
};

export const saveDeletedIds = (ids) => {
  localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
};
