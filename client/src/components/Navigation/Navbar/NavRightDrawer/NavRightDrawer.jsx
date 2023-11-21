// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from "../../../../api/authApiSlice";
// Actions.
import { logout } from "../../../../features/auth/sessionSlice";
// Components.
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
// SubComponents.
import NavRightDrawerHeader from "./NavRightDrawerHeader/NavRightDrawerHeader";
import NavRightDrawerBody from "./NavRightDrawerBody/NavRightDrawerBody";
import NavRightDrawerFooter from "./NavRightDrawerFooter/NavRightDrawerFooter";
// Cookies.
import Cookies from "js-cookie";

// SubComponent ( Navbar ).
function NavRightDrawer({ disclosure }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useThemeInfo();
  const { isOpen, onClose } = disclosure;

  // Get csrftoken.
  const csrftoken = Cookies.get("csrftoken");

  // Request to the backend.
  const [signOut, { isLoading: isSignOutLoading }] = useSignOutMutation();

  // Logout.
  const handleLogout = async () => {
    try {
      const res = await signOut({
        headers: { "X-CSRFToken": csrftoken },
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
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.300"}
          borderLeftRadius="14px"
        >
          <DrawerCloseButton />

          {/* Drawer Header. */}
          <DrawerHeader>
            <NavRightDrawerHeader />
          </DrawerHeader>

          {/* Drawer Body. */}
          <DrawerBody>
            <NavRightDrawerBody handleLogout={handleLogout} onClose={onClose} />
          </DrawerBody>

          {/* Drawer Footer. */}
          <DrawerFooter>
            <NavRightDrawerFooter onClose={onClose} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavRightDrawer;
