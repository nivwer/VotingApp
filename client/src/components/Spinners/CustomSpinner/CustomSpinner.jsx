// Components.
import { Flex, Spinner } from "@chakra-ui/react";

// Component.
function CustomSpinner({ opacity = 0.7 }) {
  return (
    <Flex
      h={"100px"}
      w={"100%"}
      align={"center"}
      justify={"center"}
      opacity={opacity}
    >
      <Spinner size="md" />
    </Flex>
  );
}

export default CustomSpinner;
