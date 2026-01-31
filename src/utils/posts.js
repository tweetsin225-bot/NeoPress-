export const mergePosts = (basePosts, storedPosts, deletedIds = []) => {
  const storedById = new Map(storedPosts.map((post) => [post.id, post]));
  const merged = [...storedPosts, ...basePosts.filter((post) => !storedById.has(post.id))];
  return merged.filter((post) => !deletedIds.includes(post.id));
};
