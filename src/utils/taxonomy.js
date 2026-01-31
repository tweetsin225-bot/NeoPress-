const normalizeValue = (value) => value?.trim();

export const getAllTags = (posts) => {
  const tags = new Set();
  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      const normalized = normalizeValue(tag);
      if (normalized) tags.add(normalized);
    });
  });
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
};

export const getAllCategories = (posts) => {
  const categories = new Set();
  posts.forEach((post) => {
    const normalized = normalizeValue(post.category);
    if (normalized) categories.add(normalized);
  });
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
};

export const groupPostsByCategory = (posts) => {
  const groups = new Map();
  posts.forEach((post) => {
    const category = normalizeValue(post.category) || "Uncategorized";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(post);
  });
  return Array.from(groups.entries())
    .map(([category, items]) => ({ category, posts: items }))
    .sort((a, b) => b.posts.length - a.posts.length);
};
