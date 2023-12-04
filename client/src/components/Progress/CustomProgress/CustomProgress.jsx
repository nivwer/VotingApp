import { Progress } from "@chakra-ui/react";

function CustomProgress() {
  return (
    <Progress
      colorScheme={"default"}
      borderBottomRadius="14px"
      m="auto"
      w={"95%"}
      size="xs"
      isIndeterminate
    />
  );
}

export default CustomProgress;
