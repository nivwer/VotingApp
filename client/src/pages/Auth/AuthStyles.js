export const getAuthStyles = (ThemeColor, isDark) => {
  return {
    content: {
      w: "100%",
      bg: isDark ? "black" : `${color}.bg-l-s`,
      color: isDark ? `${color}.text-d-p` : `${color}.900`,
      outline: isDark ? "1px solid" : "2px solid",
      outlineColor: isDark ? `${color}.border-d` : `${color}.600`,
      borderRadius: "14px",
      textAlign: "center",
    },

    body: {},

    footer: {},

    focusBorderColor: isDark ? `${ThemeColor}.border-d` : `${ThemeColor}.600`,
  };
};
