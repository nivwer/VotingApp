// Styles.
export const getProfileStyles = (isDark) => {
  return {
    header: {
      content: {
        minHeight: "328px",
        p: "7",
        pb: "10",
        overflow: "hidden",
        w: "100%",
        bg: isDark ? "black" : "white",
        color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
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
