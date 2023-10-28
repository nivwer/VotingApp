// Components.
import { HStack, IconButton, Text } from "@chakra-ui/react";

// Component.
function PollCardButton({ children, isLoading, onClick, icon }) {
  return (
    <HStack spacing={0} opacity={0.6}>
      <IconButton
        size={"md"}
        variant={"ghost"}
        isDisabled={isLoading}
        onClick={onClick}
        borderRadius={"full"}
      >
        {icon}
      </IconButton>
      <Text p={0} fontSize={"sm"} fontWeight={"medium"}>
        {children}
      </Text>
    </HStack>
  );
}

export default PollCardButton;
