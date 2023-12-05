import { useThemeInfo } from "../../../../hooks/Theme";
import CustomButton from "../../../Buttons/CustomButton/CustomButton";
import { HStack, MenuItem, Text } from "@chakra-ui/react";

function CardMenuItem({ children, onClick, icon, isLoading }) {
  const { isDark } = useThemeInfo();
  return (
    <MenuItem
      as={CustomButton}
      onClick={onClick}
      isDisabled={isLoading}
      variant={"ghost"}
      justifyContent={"start"}
      borderRadius={0}
      opacity={0.7}
      px={4}
    >
      <HStack
        spacing={3}
        color={isDark ? "gothicPurple.50" : "gothicPurple.900"}
        opacity={isDark ? 1 : 0.9}
      >
        <Text children={icon} />
        <Text children={children} mt={"3px"} fontWeight={"semibold"} />
      </HStack>
    </MenuItem>
  );
}

export default CardMenuItem;
