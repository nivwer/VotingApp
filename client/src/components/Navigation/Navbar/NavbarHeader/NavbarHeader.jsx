// Components.
import { HStack, Heading } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// SubComponents.
import NavbarBreadcrumb from "./NavbarBreadcrumb/NavbarBreadcrumb";

// SubComponent ( Navbar ).
function NavbarHeader() {
  return (
    <HStack spacing={"5"} pt={"3px"}>
      {/* Logotipo. */}
      <NavLink to={"/home"}>
        <Heading fontSize="xl">VotingApp</Heading>
      </NavLink>

      {/* Breadcrumb. */}
      <NavbarBreadcrumb />
    </HStack>
  );
}

export default NavbarHeader;
