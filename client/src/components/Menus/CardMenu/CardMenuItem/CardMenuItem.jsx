import { useThemeInfo } from "../../../../hooks/Theme";
import CustomButton from "../../../Buttons/CustomButton/CustomButton";
import { HStack, MenuItem, Text } from "@chakra-ui/react";

function CardMenuItem({ children, onClick, icon, isLoading }) {
  const { isDark } = useThemeInfo();
  return (
    <CustomButton
      as={MenuItem}
      onClick={onClick}
      isDisabled={isLoading}
      variant={"ghost"}
      justifyContent={"start"}
      borderRadius={0}
      opacity={0.8}
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
    </CustomButton>
  );
}

export default CardMenuItem;
