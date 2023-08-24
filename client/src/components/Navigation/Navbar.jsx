// Hooks.
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useColorMode, useDisclosure, } from "@chakra-ui/react";
// Actions.
import { logout } from "../../features/auth/authSlice";
// CSS module.
import styles from "./Navbar.module.css";
// Components.
import ToggleColorMode from "./ToggleColorMode.jsx";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  Avatar,
  ButtonGroup,
  HStack,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";

// Component.
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
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
        { page: "home", link: "/home", text: "Home" },
        { page: "about", link: "/about", text: "About" },
      ]);
      setUserPages([
        {
          page: "user_profile",
          link: `/${session.user.username}`,
          text: "Profile",
        },
      ]);
    } else {
      setPages([]);
      setUserPages([]);
    }
  }, [session]);

  return (
    <>
      {/* <div className="navbar">
        <NavLink to={'/home'}>VotingApp </NavLink>
        <NavLink to={'/home'}>Home </NavLink>
        <NavLink to={'/signin'}>signin </NavLink>
        <NavLink to={'/signup'}>signup </NavLink>
        <NavLink to={'/user/new'}>newpoll </NavLink>
        <NavLink to={'/nivwer'}>nivwer </NavLink>
        <NavLink to={'/user'}>user </NavLink>
        <NavLink to={'/user2'}>user2 </NavLink>
      </div> */}

      <Box className={styles["navbar"]}>
        <Box
          className={styles["content"]}
          bg={isDark ? "black" : `${color}.25`}
          outline={isDark ? "1px solid" : "2px solid"}
          outlineColor={isDark ? `${color}.200` : `${color}.500`}
        >
          {/* Logotipo. */}
          <Box>
            <NavLink to={"/home"}>
              <Text
                fontSize="xl"
                as="b"
                color={isDark ? `${color}.100` : `${color}.900`}
              >
                VotingApp
              </Text>{" "}
            </NavLink>
          </Box>

          {/* Toolbar. */}
          <Box>
            {session.token ? (
              <HStack spacing="6">
                <ButtonGroup spacing="0">
                  {pages.map((page, index) => (
                    <NavLink key={index} to={page.link}>
                      <Button colorScheme={color} size="sm" variant={"ghost"}>
                        {page.text}
                      </Button>
                    </NavLink>
                  ))}
                </ButtonGroup>
                <ToggleColorMode />
                <Button variant={"unstyled"} onClick={onOpen}>
                  <Avatar size="sm" />
                </Button>
              </HStack>
            ) : (
              <ButtonGroup spacing="1">
                <NavLink to={"/signin"}>
                  <Button colorScheme={color} size="sm" variant={"ghost"}>
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to={"/signup"}>
                  <Button
                    colorScheme={color}
                    variant={isDark ? "outline" : undefined}
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </NavLink>
                <ToggleColorMode />
              </ButtonGroup>
            )}
          </Box>

          {/* Drawer. */}
          {session.user && (
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent
                bg={isDark ? "black" : `${color}.25`}
                border={isDark ? "1px solid" : "2px solid"}
                borderColor={isDark ? `${color}.200` : `${color}.500`}
                borderLeftRadius="14px"
              >
                <DrawerCloseButton />

                {/* Drawer Header. */}
                <DrawerHeader>
                  {/* User Avatar. */}
                  <Flex>
                    <Avatar size="md" />
                    <Box
                      color={isDark ? `${color}.100` : `${color}.900`}
                      ml="4"
                    >
                      <Text fontSize="md" fontWeight="bold">
                        Apodo
                      </Text>
                      <Text opacity={0.5} fontSize="sm">
                        {session.user.username}
                      </Text>
                    </Box>
                  </Flex>
                </DrawerHeader>
                <Box px="5">
                  <Divider
                    borderColor={isDark ? `${color}.100` : `${color}.200`}
                  />
                </Box>

                {/* Drawer Body. */}
                <DrawerBody mt="2">
                  {/* User Pages. */}
                  <Stack>
                    {userPages.map((page, index) => (
                      <NavLink key={index} to={page.link}>
                        <Button
                          colorScheme={color}
                          size="sm"
                          variant={"ghost"}
                          w="100%"
                          px="6"
                          justifyContent="start"
                        >
                          {page.text}
                        </Button>
                      </NavLink>
                    ))}
                  </Stack>

                  <Stack>
                    <Button
                      onClick={() => {
                        dispatch(logout());
                        onClose();
                        navigate("/home");
                      }}
                      colorScheme={color}
                      size="sm"
                      variant={"ghost"}
                      w="100%"
                      px="6"
                      justifyContent="start"
                    >
                      Sign Out
                    </Button>
                  </Stack>
                </DrawerBody>

                {/* Drawer Footer. */}
                <DrawerFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue">Save</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Navbar;
