import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import { Box, Button, Divider, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import PollModal from "../../../components/Modals/PollModal/PollModal";
import { FaPlus, FaHouse, FaMagnifyingGlass, FaUser, FaGear } from "react-icons/fa6";
import NavbarMenu from "./NavbarMenu/NavbarMenu";
import NavbarMenuItem from "./NavbarMenu/NavbarMenuItem/NavbarMenuItem";
import CustomIconButton from "../../../components/Buttons/CustomIconButton/CustomIconButton";

// SubComponent ( Navbar ).
function NavbarFooter({ disclosure }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, user, profile } = useSelector((state) => state.session);
  const { onOpen } = disclosure;
  const pollModalDisclosure = useDisclosure();

  return (
    <Box>
      {isAuthenticated ? (
        <HStack spacing={6}>
          <HStack>
            <CustomIconButton
              onClick={pollModalDisclosure.onOpen}
              variant={"ghost"}
              icon={<FaPlus />}
              color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
            />
            <NavLink to={"/home"}>
              <CustomIconButton variant={"ghost"} icon={<FaHouse />} />
            </NavLink>
            <NavLink to={"/search"}>
              <CustomIconButton variant={"ghost"} icon={<FaMagnifyingGlass />} />
            </NavLink>
          </HStack>
          {/* <IconButton
            variant={"unstyled"}
            size={"md"}
            onClick={onOpen}
            borderRadius={"full"}
          >
            <Avatar
              bg={profile.profile_picture ? "transparent" : "gray.400"}
              size="md"
              h={"40px"}
              w={"40px"}
              src={profile.profile_picture}
            />
          </IconButton> */}

          <NavbarMenu profile={profile} user={user}>
            <NavLink to={`/${user.username}`}>
              <NavbarMenuItem children={"Profile"} icon={<FaUser />} />
            </NavLink>
            <NavLink to={"/settings"}>
              <NavbarMenuItem children={"Settings"} icon={<FaGear />} />
            </NavLink>

            <Divider my={2} bg={"gothicPurpleAlpha.50"} />
            <NavLink to={"/settings"}>
              <NavbarMenuItem children={"Sign Out"} />
            </NavLink>
          </NavbarMenu>
          <PollModal disclosure={pollModalDisclosure} />
        </HStack>
      ) : (
        <HStack spacing="3">
          <NavLink to={"/signin"}>
            <Button children={"Sign In"} colorScheme={"default"} size="sm" variant={"ghost"} />
          </NavLink>
          <NavLink to={"/signup"}>
            <Button children={"Sign Up"} colorScheme={"default"} size="sm" />
          </NavLink>
        </HStack>
      )}
    </Box>
  );
}

export default NavbarFooter;
