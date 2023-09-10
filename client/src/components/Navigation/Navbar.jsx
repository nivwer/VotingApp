// Hooks.
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon, useColorMode, useDisclosure } from "@chakra-ui/react";
// Actions.
import { logout } from "../../features/auth/sessionSlice";
// Components.
import ToggleColorMode from "./ToggleColorMode";
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
  Divider,
  Heading,
} from "@chakra-ui/react";
// Icons.
import { FaHouse } from "react-icons/fa6";

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
        { page: "home", link: "/home", text: "Home", icon: <FaHouse /> },
        { page: "about", link: "/about", text: "About", icon: <FaHouse /> },
      ]);
      setUserPages([
        {
          page: "user_profile",
          link: `/${session.user.username}`,
          text: "Profile",
        },
        {
          page: "settings_theme",
          link: "/settings/theme",
          text: "Theme",
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

      <Box w={"100%"} pos={"fixed"} top={"26px"}>
        <Box
          bg={isDark ? "black" : `${color}.bg-l-s`}
          outline={isDark ? "1px solid" : "2px solid"}
          outlineColor={isDark ? `${color}.border-d` : `${color}.600`}
          w={"96%"}
          minH={"57px"}
          m={"auto"}
          p={"4px 40px"}
          alignItems={"center"}
          justifyContent={"space-between"}
          display={"flex"}
          borderRadius={"14px"}
        >
          {/* Logotipo. */}
          <Box>
            <NavLink to={"/home"}>
              <Text
                fontSize="xl"
                as="b"
                color={isDark ? `${color}.text-d-p` : `${color}.900`}
              >
                VotingApp
              </Text>
            </NavLink>
          </Box>

          {/* Toolbar. */}
          <Box>
            {session.token ? (
              <HStack spacing="6">
                <ButtonGroup spacing="0">
                  {pages.map((page, index) => (
                    <NavLink key={index} to={page.link}>
                      <Button
                        opacity={isDark ? 0.9 : 0.6}
                        colorScheme={color}
                        size="sm"
                        variant={"ghost"}
                      >
                        {page.icon}
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
                  <Button
                    opacity={isDark ? 0.9 : 1}
                    colorScheme={color}
                    size="sm"
                    variant={"ghost"}
                  >
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to={"/signup"}>
                  <Button
                    opacity={isDark ? 0.9 : 1}
                    colorScheme={color}
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
                bg={isDark ? "black" : `${color}.bg-l-s`}
                border={isDark ? "1px solid" : "2px solid"}
                borderColor={isDark ? `${color}.border-d` : `${color}.600`}
                borderLeftRadius="14px"
              >
                <DrawerCloseButton />

                {/* Drawer Header. */}
                <DrawerHeader>
                  {/* User Avatar. */}
                  <Flex>
                    <Avatar name={session.profile.profile_name} size="md" />
                    <Box
                      color={isDark ? `${color}.text-d-p` : `${color}.900`}
                      ml="4"
                    >
                      <Heading pt={"5px"} fontSize="md" fontWeight="bold">
                        {session.profile.profile_name}
                      </Heading>

                      <Text opacity={0.5} fontWeight="hairline" fontSize="sm">
                        @{session.user.username}
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
                  <Stack spacing={0}>
                    {userPages.map((page, index) => (
                      <NavLink key={index} to={page.link}>
                        <Button
                          colorScheme={color}
                          size="sm"
                          variant={"ghost"}
                          w="100%"
                          px="6"
                          onClick={() => {
                            onClose();
                          }}
                          justifyContent="start"
                          opacity={isDark ? 0.8 : 0.6}
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
                        navigate("/signin");
                      }}
                      colorScheme={color}
                      size="sm"
                      variant={"ghost"}
                      w="100%"
                      px="6"
                      justifyContent="start"
                      opacity={isDark ? 0.8 : 0.6}
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
