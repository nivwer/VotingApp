// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
// Components.
import { HStack, IconButton, Text } from "@chakra-ui/react";

// SubComponent ( PollCardFooter ).
function PollCardButton({
  children,
  isLoading,
  isDisabled,
  onClick,
  icon,
  active,
}) {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <HStack spacing={0}>
      <IconButton
        size={"md"}
        variant={"ghost"}
        color={
          active
            ? isDark
              ? `${ThemeColor}.200`
              : `${ThemeColor}.500`
            : "default"
        }
        isDisabled={isDisabled}
        onClick={onClick}
        borderRadius={"full"}
        isLoading={isLoading}
        opacity={active ? 0.9 : 0.6}
      >
        {icon}
      </IconButton>
      <Text opacity={0.6} p={0} fontSize={"sm"} fontWeight={"medium"}>
        {children}
      </Text>
    </HStack>
  );
}

export default PollCardButton;
