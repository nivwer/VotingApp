export const getPollModalStyles = (ThemeColor, isDark) => {
  return {
    content: {
      bg: isDark ? "black" : "white",
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      outline: "2px solid",
      outlineColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
      borderRadius: "14px",
      p: "5px",
    },

    body: {
      options: {
        add_button: {
          colorScheme: ThemeColor,
          variant: "ghost",
          bg: isDark
            ? `${ThemeColor}.bg-d-dimmed`
            : `${ThemeColor}.bg-l-dimmed`,
          color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
          opacity: 0.9,
        },
        list: {
          bg: isDark
            ? `${ThemeColor}.bg-d-dimmed`
            : `${ThemeColor}.bg-l-dimmed`,
          color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
          justifyContent: "space-between",
          variant: "ghost",
          borderRadius: 5,
          pr: 0,
          opacity: isDark ? 0.8 : 0.6,
        },
        item: {
          px: 4,
          py: 2,
          wordBreak: "break-all",
          fontWeight: "bold",
        },
      },
    },

    footer: {
      submit: {
        colorScheme: ThemeColor,
        mr: 3,
      },
      cancel: {
        variant: "ghost",
        colorScheme: "default",
      },
    },

    focusBorderColor: isDark ? "whiteAlpha.600" : "blackAlpha.700",
  };
};
