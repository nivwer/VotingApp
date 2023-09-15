// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { NavLink } from "react-router-dom";
import { Button, HStack, Text } from "@chakra-ui/react";

// Component.
function NavLinkButton({ children, icon, link }) {
  const { isDark } = useThemeInfo();
  return (
    <NavLink to={link}>
      <Button
        opacity={isDark ? 1 : 0.6}
        colorScheme={"default"}
        size="sm"
        variant={"ghost"}
      >
        <HStack spacing={1}>
          {icon}
          <Text
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
    </NavLink>
  );
}

export default NavLinkButton;
