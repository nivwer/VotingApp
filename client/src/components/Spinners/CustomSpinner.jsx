// Components.
import { Flex, Spinner } from "@chakra-ui/react";

// Component.
function CustomSpinner() {
  return (
    <Flex
      h={"100px"}
      w={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Spinner size="md" />
    </Flex>
  );
}

export default CustomSpinner;
