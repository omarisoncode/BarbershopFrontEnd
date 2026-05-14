export const getAuthenticatedUserId = (user) => user?.id || user?._id || '';

export const shouldProcessUserEvent = (payload, user) => {
  if (!payload?.userId) {
    return true;
  }

  return payload.userId === getAuthenticatedUserId(user);
};
