import { IconButton } from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

function ToggleShowPassword({ isLoading, showPassword, setShowPassword }) {
  return (
    <IconButton
      borderRadius={"full"}
      isDisabled={isLoading}
      colorScheme={"default"}
      variant={"unstyled"}
      h="1.75rem"
      size="sm"
      onClick={() => setShowPassword(!showPassword)}
      children={showPassword ? <ViewIcon /> : <ViewOffIcon />}
    />
  );
}

export default ToggleShowPassword;
