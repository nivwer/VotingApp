import { useThemeInfo } from "../../../hooks/Theme";
import { Radio } from "@chakra-ui/react";

function CustomRadio(props) {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <Radio
      colorScheme={ThemeColor}
      borderColor={isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.400"}
      {...props}
    />
  );
}

export default CustomRadio;
