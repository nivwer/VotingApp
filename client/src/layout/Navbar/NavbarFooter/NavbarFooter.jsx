import { NavLink } from "react-router-dom";
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
import { FaPlus, FaHouse, FaMagnifyingGlass, FaUser, FaGear, FaIcons } from "react-icons/fa6";

import { useThemeInfo } from "../../../hooks/Theme";
import PollModal from "../../../components/Modals/PollModal/PollModal";
import NavbarMenu from "./NavbarMenu/NavbarMenu";
import NavbarMenuItem from "./NavbarMenu/NavbarMenuItem/NavbarMenuItem";
import CustomIconButton from "../../../components/Buttons/CustomIconButton/CustomIconButton";
import CustomButton from "../../../components/Buttons/CustomButton/CustomButton";

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
              <NavLink to={"/home"}>
                <CustomIconButton variant={"ghost"} icon={<FaHouse />} />
              </NavLink>
              <NavLink to={"/search"}>
                <CustomIconButton variant={"ghost"} icon={<FaMagnifyingGlass />} />
              </NavLink>
              <NavLink to={"/categories"}>
                <CustomIconButton variant={"ghost"} icon={<FaIcons />} />
              </NavLink>
              <CustomIconButton
                onClick={pollModalDisclosure.onOpen}
                variant={"ghost"}
                icon={<FaPlus />}
                color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
              />
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

              <Divider my={2} borderColor={"gothicPurpleAlpha.300"} />
              <NavbarMenuItem children={"Sign Out"} onClick={handleLogout} />
            </NavbarMenu>
            <PollModal disclosure={pollModalDisclosure} />
          </Show>
        </HStack>
      ) : (
        <Hide below="sm">
          <HStack spacing="2">
            <NavLink to={"/signin"}>
              <CustomButton children={"Sign In"} size="sm" variant={"ghost"} px={4} />
            </NavLink>
            <NavLink to={"/signup"}>
              <Button
                children={"Sign Up"}
                colorScheme={ThemeColor}
                size="sm"
                borderRadius={"full"}
                px={4}
              />
            </NavLink>
          </HStack>
        </Hide>
      )}
    </Box>
  );
}

export default NavbarFooter;
