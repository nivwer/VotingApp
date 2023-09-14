// Components.
import { Progress } from "@chakra-ui/react";

// Component.
function CustomProgress() {
  return (
    <>
      <Progress
        colorScheme={"default"}
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
