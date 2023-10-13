// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import NavDrawer from "./components/NavDrawer/NavDrawer";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
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

// Component.
function Navbar() {
  const navigate = useNavigate();
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);

  const location = useLocation();
  const currentPath = location.pathname;
  const path = currentPath.split("/").filter((segment) => segment !== "");
  const { username } = useParams();

  // Drawer.
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatPathSegment = (segment) => {
    return decodeURIComponent(segment)
      .split(" ")
      .map((word) =>
        word.toLowerCase() === "and"
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

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
                <BreadcrumbLink
                  onClick={() => navigate(`/${path[0]}`)}
                  fontWeight={path[1] ? "medium" : "bold"}
                >
                  {username ? `@${username}` : formatPathSegment(path[0])}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {path && path[1] && (
              <BreadcrumbItem isCurrentPage={path[2] ? false : true}>
                <BreadcrumbLink
                  onClick={() => navigate(`/${path[0]}/${path[1]}`)}
                  fontWeight={path[2] ? "medium" : "bold"}
                >
                  {formatPathSegment(path[1])}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {path && path[2] && (
              <BreadcrumbItem isCurrentPage={true}>
                <BreadcrumbLink
                  onClick={() => navigate(`/${path[0]}/${path[1]}/${path[2]}`)}
                  fontWeight={"bold"}
                >
                  {formatPathSegment(path[2])}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
        </HStack>

        {/* Right group buttons. */}
        <Box>
          {session.token ? (
            <HStack spacing="6">
              <ButtonGroup spacing="0"></ButtonGroup>
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
