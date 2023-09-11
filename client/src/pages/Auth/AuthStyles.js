export const getAuthStyles = (ThemeColor, isDark) => {
  return {
    content: {
      w: "100%",
      bg: isDark ? "black" : "white",
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      outline: "2px solid",
      outlineColor: isDark ? "whiteAlpha.300" : "blackAlpha.600",
      borderRadius: "14px",
      textAlign: "center",
    },

    body: {},

    footer: {},

    focusBorderColor: isDark ? "whiteAlpha.600" : "blackAlpha.700",
  };
};
