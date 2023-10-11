// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
// Components.
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
// Icons.
import {
  FaUserLock,
  FaUserGear,
  FaUserPen,
  FaPaintbrush,
} from "react-icons/fa6";

function SettingLinkButton({ children, to, icon }) {
  return (
    <NavLink to={to}>
      <Button
        size={"lg"}
        variant={"ghost"}
        w={"100%"}
        justifyContent={"start"}
        borderRadius={0}
      >
        <HStack px={"2"} spacing={"4"} fontSize={"lg"} fontWeight={"medium"}>
          <Icon fontSize={"2xl"}>{icon && icon}</Icon>
          <Text>{children}</Text>
        </HStack>
      </Button>
    </NavLink>
  );
}

// Page.
function Settings() {
  const { isDark } = useThemeInfo();
  return (
    <Box w={"100%"} pt={5} opacity={isDark ? 0.9 : 0.6}>
      <Stack spacing={0}>
        <SettingLinkButton icon={<FaUserGear />} to={"/settings/account"}>
          Account
        </SettingLinkButton>
        <SettingLinkButton icon={<FaUserPen />} to={"/settings/profile"}>
          Profile
        </SettingLinkButton>
        <SettingLinkButton icon={<FaPaintbrush />} to={"/settings/theme"}>
          Theme
        </SettingLinkButton>
      </Stack>
    </Box>
  );
}

export default Settings;
