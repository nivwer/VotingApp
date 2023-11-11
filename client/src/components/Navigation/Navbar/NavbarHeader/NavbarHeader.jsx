// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { HStack, Heading, IconButton } from "@chakra-ui/react";
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
      <IconButton
        opacity={isDark ? 0.9 : 0.8}
        onClick={onOpen}
        variant={"ghost"}
        borderRadius={"full"}
        size={"md"}
        fontSize={"xl"}
        icon={<FaBars />}
      ></IconButton>

      <HStack spacing={5} pt={"4px"}>
        {/* Logotipo. */}
        <NavLink to={"/home"}>
          <Heading fontSize="xl">VotingApp</Heading>
        </NavLink>

        {/* Breadcrumb. */}
        <NavbarBreadcrumb />
      </HStack>
    </HStack>
  );
}

export default NavbarHeader;