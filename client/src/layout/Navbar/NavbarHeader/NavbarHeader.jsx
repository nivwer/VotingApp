// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Box, HStack, Heading, IconButton, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// SubComponents.
import NavbarBreadcrumb from "./NavbarBreadcrumb/NavbarBreadcrumb";
// Icons.
import { FaBars } from "react-icons/fa6";

// SubComponent ( Navbar ).
function NavbarHeader({ disclosure }) {
  const { isDark } = useThemeInfo();
  const { onOpen } = disclosure;
  return (
    <HStack spacing={3}>
      {/* Open Left Drawer */}
      {/* <IconButton
        opacity={isDark ? 0.9 : 0.8}
        onClick={onOpen}
        variant={"ghost"}
        borderRadius={"full"}
        size={"md"}
        fontSize={"xl"}
        icon={<FaBars />}
      ></IconButton> */}

      <HStack opacity={0.9} spacing={5}>
        {/* Logotipo. */}
        <NavLink to={"/home"}>
          <Text pt={"1px"} fontSize="xl" fontWeight={"bold"}>
            VotingApp
          </Text>
        </NavLink>

        {/* Breadcrumb. */}
        <Box pt={"3px"}>
          <NavbarBreadcrumb />
        </Box>
      </HStack>
    </HStack>
  );
}

export default NavbarHeader;
