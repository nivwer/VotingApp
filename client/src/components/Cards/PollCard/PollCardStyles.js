// Styles.
export const getPollCardStyles = (ThemeColor, isDark) => {
  return {
    card: {
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      bg: isDark ? "black" : "white",
      w: "100%",
      maxW: "xl",
    },

    // Card Header.
    header: {
      flex: {
        flex: "1",
        gap: "4",
        alignItems: "center",
        flexWrap: "wrap",
      },
      heading: { size: "sm" },
      text: {
        opacity: 0.5,
        fontWeight: "hairline",
        fontSize: "sm",
      },
      menu: {
        button: {
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
      heading: {
        textAlign: "center",
        size: "md",
      },
      text: {
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
