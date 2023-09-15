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
    },

    body: {
      content: {
        w: "100%",
        display: "flex",
        flexDir: "column",
        alignItems: "center",
      },

      tab_list: {
        borderBottom: "1px solid",
        borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
        color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
        // Tab component.
        sx: {
          "& > button": { opacity: isDark ? 0.9 : 0.6, fontWeight: "bold" },
        },
      },

      tab_indicator: {
        mt: "-1.5px",
        height: "3px",
        bg: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`,
        borderRadius: "3px",
        opacity: 0.7,
      },
    },
  };
};
