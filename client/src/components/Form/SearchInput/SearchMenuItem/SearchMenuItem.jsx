import { HStack, MenuItem, Text } from "@chakra-ui/react";
import CustomButton from "../../../Buttons/CustomButton/CustomButton";
import { useThemeInfo } from "../../../../hooks/Theme";

function SearchMenuItem({ children, icon, value, setSearchType }) {
  const { isDark } = useThemeInfo();
  return (
    <CustomButton
      as={MenuItem}
      onClick={() => setSearchType(value)}
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

export default SearchMenuItem;
