// Hooks.
import { useThemeInfo } from "../../../../../../hooks/Theme";
// Components.
import { Button, HStack, Text } from "@chakra-ui/react";

// SubComponent ( NavRightDrawerBody ).
function NavRightDrawerButton({ children, icon = null, onClick }) {
  const { isDark } = useThemeInfo();
  return (
    <Button
      colorScheme={"default"}
      size="sm"
      variant={"ghost"}
      w="100%"
      px={icon ? "3" : "5"}
      onClick={onClick}
      justifyContent="start"
      opacity={isDark ? 0.9 : 0.6}
    >
      <HStack spacing={2}>
        {icon}
        <Text
          fontWeight={"bold"}
          display={"flex"}
          h={"100%"}
          mt={"2px"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {children}
        </Text>
      </HStack>
    </Button>
  );
}

export default NavRightDrawerButton;
