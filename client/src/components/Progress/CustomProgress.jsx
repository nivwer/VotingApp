// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
// Components.
import { Progress } from "@chakra-ui/react";

// Component.
function CustomProgress() {
  const { ThemeColor } = useThemeInfo();
  return (
    <>
      <Progress
        colorScheme={ThemeColor}
        borderTopRadius="14px"
        m="auto"
        w={"98%"}
        size="xs"
        isIndeterminate
      />
    </>
  );
}

export default CustomProgress;
