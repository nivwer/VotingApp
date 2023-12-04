import { Center, Flex, Spinner } from "@chakra-ui/react";

function InitialSpinner() {
  return (
    <Flex minH="100vh" justify={"center"}>
      <Center children={<Spinner size="md" thickness="2px" speed="0.55s" />} />
    </Flex>
  );
}

export default InitialSpinner;
