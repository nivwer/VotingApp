// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import NavDrawer from "./components/NavDrawer/NavDrawer";
import NavLinkButton from "./components/NavLinkButton";
import ToggleColorMode from "../../Toggles/Theme/ToggleColorMode";
import { NavLink } from "react-router-dom";
import {
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
  useDisclosure,
  Box,
  Button,
  Avatar,
} from "@chakra-ui/react";
// Styles.
import { getNavBarStyles } from "./NavBarStyles";
// Icons.
import { FaHouse } from "react-icons/fa6";

// Component.
function Navbar() {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getNavBarStyles(ThemeColor, isDark);
  const session = useSelector((state) => state.session);

  // Drawer.
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box {...styles.container}>
      {/* Toolbar. */}
      <Box {...styles.content}>
        {/* Logotipo. */}
        <NavLink to={"/home"}>
          <Heading fontSize="xl">VotingApp</Heading>
        </NavLink>

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
      </Box>
    </Box>
  );
}

export default Navbar;
