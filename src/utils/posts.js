export const mergePosts = (basePosts, storedPosts, deletedIds = []) => {
  const storedById = new Map(storedPosts.map((post) => [post.id, post]));
  const merged = [...storedPosts, ...basePosts.filter((post) => !storedById.has(post.id))];
  return merged.filter((post) => !deletedIds.includes(post.id));
};

export const getPostStatus = (post, now = new Date()) => {
  const status = post.status || "published";
  if (status === "scheduled") {
    const scheduledFor = post.scheduledFor ? new Date(post.scheduledFor) : null;
    if (scheduledFor && scheduledFor <= now) {
      return "published";
    }
  }
  return status;
};

export const isPostVisible = (post, now = new Date()) => {
  const status = getPostStatus(post, now);
  return status === "published";
};

export const getVisiblePosts = (posts, now = new Date()) => posts.filter((post) => isPostVisible(post, now));
