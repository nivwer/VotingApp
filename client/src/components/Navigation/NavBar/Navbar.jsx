// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Components.
import NavDrawer from "./NavDrawer";
import ToggleColorMode from "../../Toggles/Theme/ToggleColorMode";
import { NavLink } from "react-router-dom";
import { ButtonGroup, HStack, useDisclosure } from "@chakra-ui/react";
import { Box, Button, Text, Avatar } from "@chakra-ui/react";
// Styles.
import { getNavBarStyles } from "./NavBarStyles";
// Icons.
import { FaHouse, FaUser, FaPaintbrush } from "react-icons/fa6";

// Component.
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getNavBarStyles(ThemeColor, isDark);
  // User session.
  const session = useSelector((state) => state.session);

  // Drawer.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Pages.
  const [pages, setPages] = useState([]);
  const [userPages, setUserPages] = useState([]);
  useEffect(() => {
    if (session.user) {
      setPages([
        { page: "home", link: "/home", text: "Home", icon: <FaHouse /> },
        { page: "about", link: "/about", text: "About", icon: <FaHouse /> },
      ]);
      setUserPages([
        {
          page: "user_profile",
          link: `/${session.user.username}`,
          text: "Profile",
          icon: <FaUser />,
        },
        {
          page: "settings_theme",
          link: "/settings/theme",
          text: "Theme",
          icon: <FaPaintbrush />,
        },
      ]);
    } else {
      setPages([]);
      setUserPages([]);
    }
  }, [session]);

  return (
    <>
      <Box {...styles.container}>
        {/* Toolbar. */}
        <Box {...styles.content}>
          {/* Logotipo. */}
          <Box>
            <NavLink to={"/home"}>
              <Text
                fontSize="xl"
                as="b"
                color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
              >
                VotingApp
              </Text>
            </NavLink>
          </Box>

          {/* Right group buttons. */}
          <Box>
            {session.token ? (
              <HStack spacing="6">
                <ButtonGroup spacing="0">
                  {pages.map((page, index) => (
                    <NavLink key={index} to={page.link}>
                      <Button
                        opacity={isDark ? 1 : 0.6}
                        colorScheme={"default"}
                        size="sm"
                        variant={"ghost"}
                      >
                        <HStack spacing={1}>
                          {page.icon}
                          <Text
                            display={"flex"}
                            h={"100%"}
                            mt={"2px"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            {page.text}
                          </Text>
                        </HStack>
                      </Button>
                    </NavLink>
                  ))}
                </ButtonGroup>
                <ToggleColorMode />
                <Button variant={"unstyled"} onClick={onOpen}>
                  <Box>
                    <Avatar
                      bg={"gray.400"}
                      size="sm"
                      src={session.profile.profile_picture}
                    />
                  </Box>
                </Button>
              </HStack>
            ) : (
              <HStack spacing="3">
                <ButtonGroup spacing="1">
                  <NavLink to={"/signin"}>
                    <Button colorScheme={"default"} size="sm" variant={"ghost"}>
                      Sign In
                    </Button>
                  </NavLink>
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
          {session.user && (
            <NavDrawer
              session={session}
              userPages={userPages}
              isOpen={isOpen}
              onClose={onClose}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default Navbar;
