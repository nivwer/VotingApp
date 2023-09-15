// Components.
import { IconButton } from "@chakra-ui/react";
// Icons.
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

// Component.
function ToggleShowPassword({ isLoading, showPassword, setShowPassword }) {
  return (
    <IconButton
      borderRadius={"full"}
      isDisabled={isLoading}
      colorScheme={"default"}
      variant={"unstyled"}
      h="1.75rem"
      size="sm"
      onClick={() => {
        setShowPassword(!showPassword);
      }}
    >
      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
    </IconButton>
  );
}

export default ToggleShowPassword;
