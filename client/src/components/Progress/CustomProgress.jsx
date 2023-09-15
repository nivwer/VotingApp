// Components.
import { Progress } from "@chakra-ui/react";

// Component.
function CustomProgress() {
  return (
    <>
      <Progress
        colorScheme={"default"}
        borderBottomRadius="14px"
        m="auto"
        w={"95%"}
        size="xs"
        isIndeterminate
      />
    </>
  );
}

export default CustomProgress;
