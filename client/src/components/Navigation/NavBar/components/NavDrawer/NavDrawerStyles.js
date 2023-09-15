export const getNavDrawerStyles = (ThemeColor, isDark) => {
  return {
    content: {
      bg: isDark ? "black" : "white",
      border: "2px solid",
      borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
      borderLeftRadius: "14px",
    },
  };
};
