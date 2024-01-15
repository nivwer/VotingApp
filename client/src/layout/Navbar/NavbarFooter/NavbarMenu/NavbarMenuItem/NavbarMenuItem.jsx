import { useThemeInfo } from "../../../../../hooks/Theme";
import CustomButton from "../../../../../components/Buttons/CustomButton/CustomButton";
import { HStack, MenuItem, Text } from "@chakra-ui/react";

function NavbarMenuItem({ children, onClick, icon }) {
  const { isDark } = useThemeInfo();
  return (
    <CustomButton
      as={MenuItem}
      onClick={onClick}
      variant={"ghost"}
      justifyContent={"start"}
      borderRadius={0}
      opacity={0.8}
      px={4}
      bg={isDark ? "black" : "white"}
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

export default NavbarMenuItem;
