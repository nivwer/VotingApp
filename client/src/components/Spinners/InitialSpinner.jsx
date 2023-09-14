// Components.
import { Center, Flex, Spinner } from "@chakra-ui/react";

// Component.
function InitialSpinner() {
  return (
    <Flex minH="100vh" justifyContent={"center"}>
      <Center>
        <Spinner size="xl" thickness="4px" speed="0.55s" />
      </Center>
    </Flex>
  );
}

export default InitialSpinner;
