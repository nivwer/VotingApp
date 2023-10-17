// Components.
import { IconButton } from "@chakra-ui/react";

// Component.
function PollCardButton({ isLoading, onClick, icon }) {
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
