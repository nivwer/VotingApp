import { useThemeInfo } from "../../../hooks/Theme";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import NavRightDrawerHeader from "./NavRightDrawerHeader/NavRightDrawerHeader";
import NavRightDrawerBody from "./NavRightDrawerBody/NavRightDrawerBody";

function NavRightDrawer({ disclosure, handleLogout }) {
  const { isDark } = useThemeInfo();
  const { isOpen, onClose } = disclosure;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={isDark ? "black" : "white"}>
        <DrawerCloseButton />

        {/* Drawer Header. */}
        <DrawerHeader px={0}>
          <NavRightDrawerHeader />
        </DrawerHeader>

        {/* Drawer Body. */}
        <DrawerBody px={0}>
          <NavRightDrawerBody handleLogout={handleLogout} onClose={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default NavRightDrawer;
