export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
    // extraEnhancers: [persistEnhancer()],
  },
};
