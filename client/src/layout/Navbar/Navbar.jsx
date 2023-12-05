import { useThemeInfo } from "../../hooks/Theme";
import { useSelector } from "react-redux";
import { useDisclosure, Box, Flex } from "@chakra-ui/react";
import NavRightDrawer from "./NavRightDrawer/NavRightDrawer";
import NavbarFooter from "./NavbarFooter/NavbarFooter";
import NavbarHeader from "./NavbarHeader/NavbarHeader";
import NavLeftDrawer from "./NavLeftDrawer/NavLeftDrawer";

// Component.
function Navbar() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated } = useSelector((state) => state.session);
  const disclosureRight = useDisclosure();
  const disclosureLeft = useDisclosure();

  return (
    <>
      <Box w={"100%"} pos={"fixed"} bg={isDark ? "black" : "white"} zIndex={1300}>
        {/* Toolbar. */}
        <Flex minH="80px" w={"100%"} justify={"center"}>
          <Flex maxW="1248px" px={6} w="100%" align="center" justify="space-between">
            <NavbarHeader disclosure={disclosureLeft} />
            <NavbarFooter disclosure={disclosureRight} />
          </Flex>

          {/* LeftDrawer. */}
          {isAuthenticated && <NavLeftDrawer disclosure={disclosureLeft} />}
          {/* RightDrawer. */}
          {isAuthenticated && <NavRightDrawer disclosure={disclosureRight} />}
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
