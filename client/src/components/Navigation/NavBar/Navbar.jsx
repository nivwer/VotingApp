// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import NavDrawer from "./components/NavDrawer/NavDrawer";
import NavLinkButton from "./components/NavLinkButton";
import ToggleColorMode from "../../Toggles/Theme/ToggleColorMode";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
  useDisclosure,
  Box,
  Button,
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react";
// Icons.
import { FaHouse } from "react-icons/fa6";

// Component.
function Navbar() {
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);

  const location = useLocation();
  const currentPath = location.pathname;
  const path = currentPath.split("/").filter((segment) => segment !== "");
  const { username } = useParams();

  // Drawer.
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <HStack spacing={"5"} pt={"3px"}>
          {/* Logotipo. */}
          <NavLink to={"/home"}>
            <Heading fontSize="xl">VotingApp</Heading>
          </NavLink>

          {/* Breadcrumb. */}
          <Breadcrumb fontSize={"md"} opacity={isDark ? 0.9 : 0.7}>
            {path && path[0] && (
              <BreadcrumbItem isCurrentPage={path[1] ? false : true}>
                <BreadcrumbLink fontWeight={path[1] ? "medium" : "bold"}>
                  <NavLink to={`/${path[0]}`}>
                    {username
                      ? `@${username}`
                      : path[0].replace(/^./, path[0][0].toUpperCase())}
                  </NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {path && path[1] && (
              <BreadcrumbItem isCurrentPage={path[2] ? false : true}>
                <BreadcrumbLink fontWeight={path[2] ? "medium" : "bold"}>
                  <NavLink to={`/${path[0]}/${path[1]}`}>
                    {path[1].replace(/^./, path[1][0].toUpperCase())}
                  </NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {path && path[2] && (
              <BreadcrumbItem isCurrentPage={true}>
                <BreadcrumbLink fontWeight={"bold"}>
                  <NavLink to={`/${path[0]}/${path[1]}/${path[2]}`}>
                    {path[2].replace(/^./, path[2][0].toUpperCase())}
                  </NavLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
        </HStack>

        {/* Right group buttons. */}
        <Box>
          {session.token ? (
            <HStack spacing="6">
              <ButtonGroup spacing="0">
                <NavLinkButton link={"/home"} icon={<FaHouse />}>
                  Home
                </NavLinkButton>
                <NavLinkButton link={"/about"} icon={<FaHouse />}>
                  About
                </NavLinkButton>
              </ButtonGroup>
              <ToggleColorMode />
              <IconButton variant={"unstyled"} onClick={onOpen}>
                <Avatar
                  bg={"gray.400"}
                  size="sm"
                  src={session.profile.profile_picture}
                />
              </IconButton>
            </HStack>
          ) : (
            <HStack spacing="3">
              <ButtonGroup spacing="1">
                {/* Sign In. */}
                <NavLink to={"/signin"}>
                  <Button colorScheme={"default"} size="sm" variant={"ghost"}>
                    Sign In
                  </Button>
                </NavLink>
                {/* Sign Up. */}
                <NavLink to={"/signup"}>
                  <Button colorScheme={"default"} size="sm">
                    Sign Up
                  </Button>
                </NavLink>
              </ButtonGroup>
            </HStack>
          )}
        </Box>

        {/* Drawer. */}
        {session.token && <NavDrawer isOpen={isOpen} onClose={onClose} />}
      </Flex>
    </Box>
  );
}

export default Navbar;
