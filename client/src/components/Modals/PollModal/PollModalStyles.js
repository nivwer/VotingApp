export const getPollModalStyles = (ThemeColor, isDark) => {
  return {
    content: {
      bg: isDark ? "black" : `${ThemeColor}.bg-l-s`,
      color: isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`,
      outline: isDark ? "1px solid" : "2px solid",
      outlineColor: isDark ? `${ThemeColor}.border-d` : `${ThemeColor}.600`,
      borderRadius: "10px",
      p: "5px"
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
