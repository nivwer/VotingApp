// Components.
import { Flex, Spinner } from "@chakra-ui/react";

// Component.
function CustomSpinner() {
  return (
    <Flex h={"100px"} w={"100%"} align={"center"} justify={"center"} opacity={0.7}>
      <Spinner size="md" />
    </Flex>
  );
}

export default CustomSpinner;
