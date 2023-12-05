import { useThemeInfo } from "../../../hooks/Theme";
import { Box, HStack, Heading, IconButton, Show, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import NavbarBreadcrumb from "./NavbarBreadcrumb/NavbarBreadcrumb";
import { FaBars } from "react-icons/fa6";

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

      <HStack opacity={1} spacing={5}>
        <NavLink to={"/home"}>
          <Text children={"VotingApp"} fontSize="xl" fontWeight={"bold"} />
        </NavLink>
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
      </HStack>
    </HStack>
  );
}

export default NavbarHeader;
