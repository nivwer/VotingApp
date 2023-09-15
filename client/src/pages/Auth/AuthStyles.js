export const getAuthStyles = (isDark) => {
  return {
    content: {
      w: "100%",
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      outline: "2px solid",
      outlineColor: isDark ? "whiteAlpha.300" : "blackAlpha.600",
      borderRadius: "14px",
      textAlign: "center",
    },

    footer: {
      submit: {
        type: "submit",
        colorScheme: "default",
        variant: "solid",
        opacity: isDark ? 0.9 : 1,
      },
    },

    focusBorderColor: isDark ? "whiteAlpha.600" : "blackAlpha.700",
  };
};
