// Hooks.
import { useSelector } from "react-redux";
// Components.
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Icons.
import {
  FaPlus,
  FaHouse,
  FaMagnifyingGlass,
  FaUser,
  FaGear,
} from "react-icons/fa6";
import { useThemeInfo } from "../../../hooks/Theme";
import NavbarMenu from "./NavbarMenu/NavbarMenu";
import NavbarMenuItem from "./NavbarMenu/NavbarMenuItem/NavbarMenuItem";

// SubComponent ( Navbar ).
function NavbarFooter({ disclosure }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, user, profile } = useSelector(
    (state) => state.session
  );
  const { onOpen } = disclosure;
  return (
    <Box>
      {isAuthenticated ? (
        <HStack spacing={6}>
          <HStack>
              <IconButton
                size={"md"}
                variant={"ghost"}
                borderRadius={"full"}
                icon={<FaPlus />}
                color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
              />
            <NavLink to={"/home"}>
            <IconButton
              size={"md"}
              variant={"ghost"}
              opacity={isDark ? 0.9 : 0.8}
              borderRadius={"full"}
              icon={<FaHouse />}
              />
              </NavLink>
            <NavLink to={"/search"}>
            <IconButton
              size={"md"}
              variant={"ghost"}
              opacity={isDark ? 0.9 : 0.8}
              borderRadius={"full"}
              icon={<FaMagnifyingGlass />}
              />
              </NavLink>
          </HStack>
          {/* <IconButton
            variant={"unstyled"}
            size={"md"}
            onClick={onOpen}
            borderRadius={"full"}
          >
            <Avatar
              bg={profile.profile_picture ? "transparent" : "gray.400"}
              size="md"
              h={"40px"}
              w={"40px"}
              src={profile.profile_picture}
            />
          </IconButton> */}

          <NavbarMenu profile={profile} user={user}>
            <NavLink to={`/${user.username}`}>
              <NavbarMenuItem icon={<FaUser />}>Profile</NavbarMenuItem>
            </NavLink>

            <NavLink to={"/settings"}>
              <NavbarMenuItem icon={<FaGear />}>Settings</NavbarMenuItem>
            </NavLink>

            <Divider my={2} bg={"gothicPurpleAlpha.50"} />
            <NavLink to={"/settings"}>
              <NavbarMenuItem>Sign Out</NavbarMenuItem>
            </NavLink>
          </NavbarMenu>
        </HStack>
      ) : (
        <HStack spacing="3">
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
        </HStack>
      )}
    </Box>
  );
}

export default NavbarFooter;
