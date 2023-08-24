import { extendTheme } from "@chakra-ui/react";
// Config.
import config from "./config"
// Global style overrides.
import styles from "./styles";
// Foundational style overrides.
import colors from "./foundations/colors";
// Component style overrides.


const theme = extendTheme({
  config,
  styles,
  colors,
  // components: {
  //   Button,
  // },
});
export default theme;
