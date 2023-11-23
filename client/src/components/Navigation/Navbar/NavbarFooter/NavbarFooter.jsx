// Hooks.
import { useSelector } from "react-redux";
// Components.
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// SubComponents.
import NavbarSearchInput from "./NavbarSearchInput/NavbarSearchInput";

// SubComponent ( Navbar ).
function NavbarFooter({ disclosure }) {
  const { isAuthenticated, profile } = useSelector((state) => state.session);
  const { onOpen } = disclosure;
  return (
    <Box>
      {isAuthenticated ? (
        <HStack spacing="6">
          <NavbarSearchInput />

          {/* <ButtonGroup spacing="0"></ButtonGroup> */}
          <IconButton variant={"unstyled"} onClick={onOpen}>
            <Avatar bg={"gray.400"} size="sm" src={profile.profile_picture} />
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
  );
}

export default NavbarFooter;
