// Styles.
export const getPollCardStyles = (ThemeColor, isDark) => {
  return {
    card: {
      color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
      bg: isDark ? `black` : `${ThemeColor}.bg-l-p`,
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
          colorScheme: ThemeColor,
          color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
          bg: "transparent"
        },
        list: {
          bg: isDark ? `black` : `${ThemeColor}.bg-l-p`,
          outline: isDark ? "1px solid" : "2px solid",
          outlineColor: isDark ? `${ThemeColor}.border-d` : `${ThemeColor}.600`,
          borderRadius: "14px",
        },
        item: {
          p: 0,
          w: "100%",
          h: "100%",
          px: 3,
          py: 2,
          borderRadius: 0,
          colorScheme: ThemeColor,
          color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
          bg: isDark ? `black` : `${ThemeColor}.bg-l-p`,
          variant: "ghost",
          justifyContent: "start",
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
