import { useThemeInfo } from "../../hooks/Theme";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure, Box, Flex, Hide } from "@chakra-ui/react";
import NavRightDrawer from "./NavRightDrawer/NavRightDrawer";
import NavbarFooter from "./NavbarFooter/NavbarFooter";
import NavbarHeader from "./NavbarHeader/NavbarHeader";
import NavLeftDrawer from "./NavLeftDrawer/NavLeftDrawer";
import NavbarBottomBody from "./NavbarBottomBody/NavbarBottomBody";
import PollModal from "../../components/Modals/PollModal/PollModal";
import CustomIconButton from "../../components/Buttons/CustomIconButton/CustomIconButton";
import { FaPlus } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useSignOutMutation } from "../../api/authApiSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/sessionSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated } = useSelector((state) => state.session);
  const disclosureRight = useDisclosure();
  const disclosureLeft = useDisclosure();
  const pollModalDisclosure = useDisclosure();
  const csrftoken = Cookies.get("csrftoken");
  const [signOut] = useSignOutMutation();

  // Logout.
  const handleLogout = async () => {
    try {
      const res = await signOut({ headers: { "X-CSRFToken": csrftoken } });
      // If the logout is successful.
      if (res.data) {
        dispatch(logout());
        if (disclosureLeft.isOpen) disclosureRight.onClose();
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
          <Flex maxW="1248px" px={6} w="100%" align="center" justify="space-between">
            <NavbarHeader disclosure={disclosureLeft} />
            <NavbarFooter handleLogout={handleLogout} disclosure={disclosureRight} />
          </Flex>

          {/* LeftDrawer. */}
          {isAuthenticated && <NavLeftDrawer disclosure={disclosureLeft} />}
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
          <Box minH="60px" w={"100%"} h={"100%"} align="center">
            <NavbarBottomBody />
          </Box>
        </Box>
        {isAuthenticated && (
          <>
            <PollModal disclosure={pollModalDisclosure} />
            <Box
              pos="fixed"
              bottom="70px"
              right="10px"
              zIndex={1200}
              bg="black"
              borderRadius="full"
            >
              <CustomIconButton
                onClick={pollModalDisclosure.onOpen}
                icon={<FaPlus />}
                color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
                size={"lg"}
              />
            </Box>
          </>
        )}
      </Hide>
    </>
  );
}

export default Navbar;
