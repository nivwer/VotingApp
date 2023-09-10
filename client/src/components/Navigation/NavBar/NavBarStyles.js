export const getNavBarStyles = (ThemeColor, isDark) => {
  return {
    container: {
      bg: isDark ? "black" : "white",
      w: "100%",
      pos: "fixed",
      borderBottom: isDark ? "1px solid" : "1px solid",
      borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
    },
    content: {
      w: "100%",
      minH: "64px",
      m: "auto",
      p: "4px 50px",
      alignItems: "center",
      justifyContent: "space-between",
      display: "flex",
    },
  };
};
