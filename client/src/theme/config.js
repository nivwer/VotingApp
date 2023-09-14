const localColorMode = localStorage.getItem("chakra-ui-color-mode");

const config = {
  initialColorMode: localColorMode || "dark",
  useSystemColorMode: true,
};

export default config;
