import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Hide,
  IconButton,
  Show,
  useDisclosure,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import PollModal from "../../../components/Modals/PollModal/PollModal";
import { FaPlus, FaHouse, FaMagnifyingGlass, FaUser, FaGear } from "react-icons/fa6";
import NavbarMenu from "./NavbarMenu/NavbarMenu";
import NavbarMenuItem from "./NavbarMenu/NavbarMenuItem/NavbarMenuItem";
import CustomIconButton from "../../../components/Buttons/CustomIconButton/CustomIconButton";

function NavbarFooter({ disclosure, handleLogout }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, user, profile } = useSelector((state) => state.session);
  const { onOpen } = disclosure;
  const pollModalDisclosure = useDisclosure();

  return (
    <Box>
      {isAuthenticated ? (
        <HStack spacing={6}>
          <Show above="sm">
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
          </Show>

          <Hide above="sm">
            <IconButton variant={"unstyled"} size={"md"} onClick={onOpen} borderRadius={"full"}>
              <Avatar
                bg={profile.profile_picture ? "transparent" : "gray.400"}
                size="md"
                h={"40px"}
                w={"40px"}
                src={profile.profile_picture}
              />
            </IconButton>
          </Hide>

          <Show above="sm">
            <NavbarMenu profile={profile} user={user}>
              <NavLink to={`/${user.username}`}>
                <NavbarMenuItem children={"Profile"} icon={<FaUser />} />
              </NavLink>
              <NavLink to={"/settings"}>
                <NavbarMenuItem children={"Settings"} icon={<FaGear />} />
              </NavLink>

              <Divider my={2} bg={"gothicPurpleAlpha.50"} />
              <NavbarMenuItem children={"Sign Out"} onClick={handleLogout} />
            </NavbarMenu>
            <PollModal disclosure={pollModalDisclosure} />
          </Show>
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
