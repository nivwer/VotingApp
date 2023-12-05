import { extendTheme } from "@chakra-ui/react";
import config from "./config";
import styles from "./styles";
import colors from "./foundations/colors";

const theme = extendTheme({ config, styles, colors });
export default theme;
