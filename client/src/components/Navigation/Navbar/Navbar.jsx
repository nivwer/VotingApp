// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import { useDisclosure, Box, Flex } from "@chakra-ui/react";
// SubComponents.
import NavDrawer from "./NavDrawer/NavDrawer";
import NavbarFooter from "./NavbarFooter/NavbarFooter";
import NavbarHeader from "./NavbarHeader/NavbarHeader";

// Component.
function Navbar() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated } = useSelector((state) => state.session);

  // Drawer.
  const disclosure = useDisclosure();

  return (
    <Box
      w={"100%"}
      pos={"fixed"}
      bg={isDark ? "black" : "white"}
      color={isDark ? "whiteAlpha.900" : "blackAlpha.800"}
      borderBottom={isDark ? "1px solid" : "1px solid"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
    >
      {/* Toolbar. */}
      <Flex minH="64px" px="50px" align="center" justify="space-between">
        {/* Navbar Header. ( LeftSide ) */}
        <NavbarHeader />

        {/* Navbar Footer. ( RightSide ) */}
        <NavbarFooter disclosure={disclosure} />

        {/* Drawer. */}
        {isAuthenticated && <NavDrawer disclosure={disclosure} />}
      </Flex>
    </Box>
  );
}

export default Navbar;
