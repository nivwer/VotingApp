// Styles.
export const getProfileStyles = (ThemeColor, isDark) => {
  return {
    header: {
      content: {
        p: "6",
        overflow: "hidden",
        w: "100%",
        bg: isDark ? "black" : `${ThemeColor}.bg-l-p`,
        color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
      },
      flex: {
        spacing: "2",
        flex: "1",
        flexDir: "column",
        alignItems: "start",
        flexWrap: "wrap",
      },
    },

    body: {
      content: {
        w: "100%",
        display: "flex",
        flexDir: "column",
        alignItems: "center",
      },
    },
  };
};
