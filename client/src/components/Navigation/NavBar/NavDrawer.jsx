// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from "../../../api/authApiSlice";
// Actions.
import { logout } from "../../../features/auth/sessionSlice";
// Components.
import { NavLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import Cookies from "js-cookie";

// Component.
function NavDrawer({ session, userPages, isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useThemeInfo();

  const csrftoken = Cookies.get("csrftoken");

  // Request to the backend.
  const [signOut, { isLoading: isLoggingOut }] = useSignOutMutation();

  const handleLogout = async () => {
    console.log(csrftoken);
    try {
      const res = await signOut({
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      // If the logout is successful.
      if (res.data) {
        dispatch(logout());
        onClose();
        navigate("/signin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          bg={isDark ? "black" : "white"}
          border={"2px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
          borderLeftRadius="14px"
        >
          <DrawerCloseButton />

          {/* Drawer Header. */}
          <DrawerHeader>
            {/* User Avatar. */}
            <Flex>
              <Box>
                <Avatar
                  bg={"gray.400"}
                  size="md"
                  src={session.profile.profile_picture}
                />
              </Box>
              <Box color={isDark ? "whiteAlpha.900" : "blackAlpha.900"} ml="4">
                <Heading
                  opacity={isDark ? 1 : 0.8}
                  pt={"5px"}
                  fontSize="md"
                  fontWeight="bold"
                >
                  {session.profile.profile_name}
                </Heading>

                <Text opacity={0.5} fontWeight="medium" fontSize="sm">
                  @{session.user.username}
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>
          <Box px="5">
            <Divider
              borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
            />
          </Box>

          {/* Drawer Body. */}
          <DrawerBody mt="2">
            {/* User Pages. */}
            <Stack spacing={0}>
              {userPages.map((page, index) => (
                <NavLink key={index} to={page.link}>
                  <Button
                    colorScheme={"default"}
                    size="sm"
                    variant={"ghost"}
                    w="100%"
                    px="3"
                    onClick={() => {
                      onClose();
                    }}
                    justifyContent="start"
                    opacity={isDark ? 0.9 : 0.5}
                  >
                    <HStack spacing={2}>
                      {page.icon}
                      <Text
                        fontWeight={"bold"}
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
            </Stack>

            <Stack>
              <Button
                onClick={handleLogout}
                colorScheme={"default"}
                size="sm"
                variant={"ghost"}
                w="100%"
                px="5"
                justifyContent="start"
                opacity={isDark ? 0.9 : 0.5}
              >
                <Text
                  fontWeight={"bold"}
                  display={"flex"}
                  h={"100%"}
                  mt={"2px"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  Sign Out
                </Text>
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
    </>
  );
}

export default NavDrawer;
