export const getProfileModalStyles = (ThemeColor, isDark) => {
  return {
    content: {
      bg: isDark ? "black" : "white",
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      outline: "2px solid",
      outlineColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
      borderRadius: "14px",
      p: "5px",
    },

    body: {},

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
