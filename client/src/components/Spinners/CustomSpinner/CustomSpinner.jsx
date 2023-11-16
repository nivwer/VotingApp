// Components.
import { Flex, Spinner } from "@chakra-ui/react";

// Component.
function CustomSpinner() {
  return (
    <Flex minH={"150px"} h={"100%"} w={"100%"} align={"center"} justify={"center"}>
      <Spinner size="md" />
    </Flex>
  );
}

export default CustomSpinner;
