// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
// Components.
import { Box, Stack } from "@chakra-ui/react";
// SubComponents.
import SettingLinkButton from "./SettingLinkButton/SettingLinkButton";
// Icons.
import { FaUserGear, FaUserPen, FaPaintbrush } from "react-icons/fa6";

// Page.
function Settings() {
  const { isDark } = useThemeInfo();
  return (
    <Box w={"100%"} pt={5} opacity={isDark ? 0.9 : 0.6}>
      <Stack spacing={0}>
        <SettingLinkButton icon={<FaUserGear />} to={"account"}>
          Account
        </SettingLinkButton>
        <SettingLinkButton icon={<FaUserPen />} to={"profile"}>
          Profile
        </SettingLinkButton>
        <SettingLinkButton icon={<FaPaintbrush />} to={"theme"}>
          Theme
        </SettingLinkButton>
      </Stack>
    </Box>
  );
}

export default Settings;
