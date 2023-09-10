// Styles.
export const getProfileStyles = (ThemeColor, isDark) => {
  return {
    header: {
      content: {
        minHeight: "328px",
        p: "6",
        overflow: "hidden",
        w: "100%",
        bg: isDark ? "black" : `${ThemeColor}.bg-l-p`,
        color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
      },
      container: {
        spacing: "2",
        flex: "1",
        flexDir: "column",
        alignItems: "start",
        flexWrap: "wrap",
      },
      flex: {
        justifyContent: "space-between",
        w: "100%",
        p: 5,
        px: 3,
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
