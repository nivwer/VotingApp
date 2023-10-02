import { HStack, Stack, Text } from "@chakra-ui/react";

function Categories() {
  return (
    <Stack>
      <HStack>
        <Text>Category</Text>
        <Text>Total encuestas</Text>
        <Text>Total votos</Text>
      </HStack>
    </Stack>
  );
}

export default Categories;
