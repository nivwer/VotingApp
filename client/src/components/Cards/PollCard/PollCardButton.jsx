// Components.
import { Button } from "@chakra-ui/react";

// Component.
function PollCardButton({ children, isLoading, onClick }) {
  return (
    <Button
      flex={"1"}
      variant={"ghost"}
      isDisabled={isLoading}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default PollCardButton;
