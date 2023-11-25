// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";

// SubComponent ( Navbar ).
function NavLeftDrawer({ disclosure }) {
  const { isDark } = useThemeInfo();
  const { isOpen, onClose } = disclosure;

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        bg={isDark ? "black" : "white"}
        border={"1px solid"}
        borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        borderRightRadius="14px"
      >
        <DrawerCloseButton />

        {/* Drawer Header. */}
        <DrawerHeader></DrawerHeader>

        {/* Drawer Body. */}
        <DrawerBody></DrawerBody>

        {/* Drawer Footer. */}
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default NavLeftDrawer;
