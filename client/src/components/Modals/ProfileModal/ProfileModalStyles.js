export const getProfileModalStyles = (ThemeColor, isDark) => {
  return {
    content: {
      bg: isDark ? "black" : `${ThemeColor}.bg-l-s`,
      color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
      outline: isDark ? "1px solid" : "2px solid",
      outlineColor: isDark ? `${ThemeColor}.border-d` : `${ThemeColor}.600`,
      borderRadius: "14px",
      p: "5px"
    },

    body: {},

    footer: {
      submit: {
        colorScheme: ThemeColor,
        mr: 3,
        opacity: isDark ? 0.9 : 1,
      },
      cancel: {
        colorScheme: ThemeColor,
        variant: "ghost",
        bg: isDark ? `${ThemeColor}.bg-d-dimmed` : `${ThemeColor}.bg-l-dimmed`,
        color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
        opacity: 0.9,
      },
    },

    focusBorderColor: isDark ? `${ThemeColor}.border-d` : `${ThemeColor}.600`,
  };
};
