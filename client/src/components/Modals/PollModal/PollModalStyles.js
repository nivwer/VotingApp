export const getPollModalStyles = (ThemeColor, isDark) => {
  return {
    content: {
      bg: isDark ? "black" : "white",
      color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
      border: "2px solid",
      borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.200",
      borderRadius: "14px",
      
    },

    body: {
      options: {
        item: {
          justifyContent: "space-between",
          fontWeight: "semibold",
          borderRadius: "3xl",
          border: "1px solid",
          borderColor:isDark ? "whiteAlpha.300" : "blackAlpha.400",
          opacity:0.8,
          p: "3px",
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
