import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure, Box, Flex, Hide } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import Cookies from "js-cookie";

import { useThemeInfo } from "../../hooks/Theme";
import { logout } from "../../features/auth/sessionSlice";
import { useSignOutMutation } from "../../api/accountsAPISlice";
import NavRightDrawer from "./NavRightDrawer/NavRightDrawer";
import NavbarFooter from "./NavbarFooter/NavbarFooter";
import NavbarHeader from "./NavbarHeader/NavbarHeader";
import NavbarBottomBody from "./NavbarBottomBody/NavbarBottomBody";
import PollModal from "../../components/Modals/PollModal/PollModal";
import CustomIconButton from "../../components/Buttons/CustomIconButton/CustomIconButton";

function Navbar({ section }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const csrftoken = Cookies.get("csrftoken");
  const { isAuthenticated } = useSelector((state) => state.session);
  const { isDark, ThemeColor } = useThemeInfo();
  const disclosureRight = useDisclosure();
  const pollModalDisclosure = useDisclosure();
  const [signOut] = useSignOutMutation();

  // Logout.
  const handleLogout = async () => {
    try {
      const res = await signOut({ headers: { "X-CSRFToken": csrftoken } });
      if (res && !res.error) {
        dispatch(logout());
        if (disclosureRight.isOpen) disclosureRight.onClose();
        navigate("/signin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Top. */}
      <Box w={"100%"} pos={"fixed"} bg={isDark ? "black" : "white"} zIndex={1300}>
        {/* Toolbar. */}
        <Flex minH={{ base: "60px", md: "80px" }} w={"100%"} justify={"center"}>
          <Flex maxW="1248px" px={4} w="100%" align="center" justify="space-between">
            <NavbarHeader />
            <NavbarFooter handleLogout={handleLogout} disclosure={disclosureRight} />
          </Flex>

          {/* RightDrawer. */}
          {isAuthenticated && (
            <NavRightDrawer handleLogout={handleLogout} disclosure={disclosureRight} />
          )}
        </Flex>
      </Box>

      {/* Bottom. */}
      <Hide above="sm">
        <Box w={"100%"} pos={"fixed"} bg={isDark ? "black" : "white"} zIndex={1300} bottom={0}>
          {/* Toolbar. */}
          <Box children={<NavbarBottomBody />} minH="60px" w="100%" h="100%" align="center" />
        </Box>
        {isAuthenticated && section !== "settings" && (
          <Box pos="fixed" bottom="70px" right="10px" zIndex={1200} bg="black" borderRadius="full">
            <PollModal disclosure={pollModalDisclosure} />
            <CustomIconButton
              onClick={pollModalDisclosure.onOpen}
              icon={<FaPlus />}
              color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
              size={"lg"}
            />
          </Box>
        )}
      </Hide>
    </>
  );
}

export default Navbar;
