import { useThemeInfo } from "../../../hooks/Theme";
import { Box, HStack, Show, Text } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import NavbarBreadcrumb from "./NavbarBreadcrumb/NavbarBreadcrumb";

function NavbarHeader() {
  const { isDark } = useThemeInfo();
  const location = useLocation();
  return (
    <HStack opacity={1} spacing={5}>
      <NavLink to={"/home"}>
        <Text children={"VotingApp"} fontSize="xl" fontWeight={"bold"} />
      </NavLink>
      {location.pathname !== "/signup" && location.pathname !== "/signin" && (
        <Show above="md">
          <Box
            bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
            p={"5px"}
            px={"25px"}
            borderRadius={"3xl"}
            boxShadow={"none"}
            children={<NavbarBreadcrumb />}
          />
        </Show>
      )}
    </HStack>
  );
}

export default NavbarHeader;
