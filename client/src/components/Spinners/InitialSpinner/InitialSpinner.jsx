// Components.
import { Center, Flex, Spinner } from "@chakra-ui/react";

// Component.
function InitialSpinner() {
  return (
    <Flex minH="100vh" justify={"center"}>
      <Center>
        <Spinner size="md" thickness="2px" speed="0.55s" />
      </Center>
    </Flex>
  );
}

export default InitialSpinner;
