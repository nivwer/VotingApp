// Components.
import { Button, HStack, IconButton } from "@chakra-ui/react";

// Component.
function PollCardButton({ children, isLoading, onClick, icon }) {
  return (
    <IconButton
      size={"md"}
      variant={"ghost"}
      isDisabled={isLoading}
      onClick={onClick}
      borderRadius={"full"}
    >
      {icon}
    </IconButton>
  );
}

export default PollCardButton;
