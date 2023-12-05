import { useThemeInfo } from "../../hooks/Theme";
import { Box, Stack } from "@chakra-ui/react";
import SettingLinkButton from "./SettingLinkButton/SettingLinkButton";
import { FaUserGear, FaUserPen, FaPaintbrush } from "react-icons/fa6";

function Settings() {
  const { isDark } = useThemeInfo();
  return (
    <Box w={"100%"} pt={5} opacity={isDark ? 0.9 : 0.6}>
      <Stack spacing={0}>
        <SettingLinkButton children={"Account"} icon={<FaUserGear />} to={"account"} />
        <SettingLinkButton children={"Profile"} icon={<FaUserPen />} to={"profile"} />
        <SettingLinkButton children={"Theme"} icon={<FaPaintbrush />} to={"theme"} />
      </Stack>
    </Box>
  );
}

export default Settings;
