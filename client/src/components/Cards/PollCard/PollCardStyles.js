// Styles.
export const getPollCardStyles = (ThemeColor, isDark) => {
  return {
    card: {
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      bg: isDark ? "black" : "white",
      w: "100%",
      maxW: "100%",
      borderRadius: "0",
      borderBottom: "1px solid",
      borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
    },

    // Card Header.
    header: {
      flex: {
        flex: "1",
        gap: "3",
        alignItems: "center",
        flexWrap: "wrap",
      },
      heading: { size: "sm", opacity: isDark ? 1 : 0.9 },
      text: {
        opacity: 0.5,
        fontWeight: "medium",
        fontSize: "sm",
      },
      menu: {
        button: {
          borderRadius: "full",
          variant: "ghost",
          colorScheme: "default",
          color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
          bg: "transparent",
        },
        list: {
          bg: isDark ? "black" : "white",
          outline: "1px solid",
          outlineColor: isDark ? "whiteAlpha.100" : "blackAlpha.100",
          borderRadius: "14px",
        },
        item: {
          p: 0,
          w: "100%",
          h: "100%",
          px: 3,
          py: 2,
          borderRadius: 0,
          colorScheme: "default",
          color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
          bg: isDark ? "black" : "white",
          variant: "ghost",
          justifyContent: "start",
          opacity: isDark ? 0.9 : 0.7,
        },
      },
    },

    // Card Body.
    body: {
      title: {
        textAlign: "center",
        size: "md",
        opacity: 0.9,
      },
      description: {
        textAlign: "center",
        fontSize: "md",
        opacity: 0.8,
      },
    },

    // Card Footer.
    footer: {
      justify: "space-between",
      flexWrap: "wrap",
      sx: { "& > button": { minW: "136px" } },
    },
  };
};
