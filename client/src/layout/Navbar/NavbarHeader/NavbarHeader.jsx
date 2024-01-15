import { useThemeInfo } from "../../../hooks/Theme";
import { Box, HStack, Heading, IconButton, Show, Text } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import NavbarBreadcrumb from "./NavbarBreadcrumb/NavbarBreadcrumb";
import { FaBars } from "react-icons/fa6";

function NavbarHeader({ disclosure }) {
  const { isDark } = useThemeInfo();
  const { onOpen } = disclosure;
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
              boxShadow={"base"}
            >
              <NavbarBreadcrumb />
            </Box>
          </Show>
        )}
      </HStack>
  );
}

export default NavbarHeader;
