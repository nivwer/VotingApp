// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from "../../../../../api/authApiSlice";
// Actions.
import { logout } from "../../../../../features/auth/sessionSlice";
// Components.
import NavDrawerButton from "./NavDrawerButton";
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
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
// Icons.
import { FaHouse, FaUser, FaPaintbrush } from "react-icons/fa6";
// Cookies.
import Cookies from "js-cookie";

// Component.
function NavDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, ThemeColor } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // Get csrftoken.
  const csrftoken = Cookies.get("csrftoken");

  // Request to the backend.
  const [signOut, { isLoading: isSignOutLoading }] = useSignOutMutation();

  // Logout.
  const handleLogout = async () => {
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
          border={"1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
          borderLeftRadius="14px"
        >
          <DrawerCloseButton />

          {/* Drawer Header. */}
          <DrawerHeader>
            <Flex>
              {/* User Avatar. */}
              <Avatar
                bg={"gray.400"}
                size="md"
                src={session.profile.profile_picture}
              />
              <Box color={isDark ? "whiteAlpha.900" : "blackAlpha.900"} ml="4">
                {/* Profile name. */}
                <Heading opacity={isDark ? 0.9 : 0.8} pt={"5px"} fontSize="md">
                  {session.profile.profile_name}
                </Heading>
                {/* Username. */}
                <Text opacity={0.5} fontWeight="medium" fontSize="sm">
                  @{session.user.username}
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>

          {/* Divider. */}
          <Box px="5">
            <Divider
              borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
            />
          </Box>

          {/* Drawer Body. */}
          <DrawerBody mt="2">
            {/* User Pages. */}
            <Stack spacing={0}>
              <NavLink to={`/${session.user.username}`}>
                <NavDrawerButton icon={<FaUser />} onClick={onClose}>
                  Profile
                </NavDrawerButton>
              </NavLink>
            </Stack>

            {/* Settings Pages. */}
            <Stack spacing={0}>
              <NavLink to={"/settings/theme"}>
                <NavDrawerButton icon={<FaPaintbrush />} onClick={onClose}>
                  Theme
                </NavDrawerButton>
              </NavLink>
            </Stack>

            {/* Sign Out. */}
            <NavDrawerButton onClick={handleLogout}>Sign Out</NavDrawerButton>
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
