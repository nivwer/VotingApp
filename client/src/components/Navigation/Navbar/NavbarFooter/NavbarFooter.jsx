// Hooks.
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Icons.
import { SearchIcon } from "@chakra-ui/icons";

// SubComponent ( Navbar ).
function NavbarFooter({ disclosure }) {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, profile } = useSelector((state) => state.session);
  const { onOpen } = disclosure;
  return (
    <Box>
      {isAuthenticated ? (
        <HStack spacing="6">
          <InputGroup size={"sm"}>
            <InputLeftElement
              px={6}
              w={10}
              children={
                <SearchIcon
                  opacity={0.5}
                  color={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
                  boxSize={4}
                />
              }
            />
            <Input
              pl={10}
              variant={"filled"}
              size={"sm"}
              fontWeight={"medium"}
              borderRadius={"full"}
              placeholder="Search"
              focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
            />
          </InputGroup>

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
