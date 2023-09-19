// Styles.
export const getProfileStyles = (isDark, ThemeColor) => {
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

      stack_links: {
        color: isDark ? `${ThemeColor}.100` : `${ThemeColor}.600`,
        opacity: ThemeColor === "default" ? 0.6 : 0.8,
        spacing: 0,
        fontSize: "md",
      },

      box_icon: {
        color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
        opacity: ThemeColor === "default" ? 1 : 0.8,
      },
    },

    body: {
      tab_list: {
        borderBottom: "1px solid",
        borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
        color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      },
    },
  };
};
