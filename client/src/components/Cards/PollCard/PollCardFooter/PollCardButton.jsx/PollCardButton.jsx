import { useThemeInfo } from "../../../../../hooks/Theme";
import CustomIconButton from "../../../../Buttons/CustomIconButton/CustomIconButton";
import { HStack, Text } from "@chakra-ui/react";

function PollCardButton({ children, isLoading, isDisabled, onClick, icon, active }) {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <HStack spacing={0}>
      <CustomIconButton
        size={"md"}
        variant={"ghost"}
        color={
          active
            ? isDark
              ? `${ThemeColor}.200`
              : `${ThemeColor}.500`
            : isDark
            ? "whiteAlpha.600"
            : "blackAlpha.600"
        }
        isDisabled={isDisabled || isLoading}
        onClick={onClick}
        children={icon}
      />
      <Text children={children} opacity={0.6} p={0} fontSize={"sm"} fontWeight={"medium"} />
    </HStack>
  );
}

export default PollCardButton;
