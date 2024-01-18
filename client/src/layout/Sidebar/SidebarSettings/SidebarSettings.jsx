import { NavLink } from "react-router-dom";
import { Flex, Heading, Stack } from "@chakra-ui/react";
import { FaPaintbrush, FaUserGear, FaUserPen } from "react-icons/fa6";

import SidebarSettingButton from "./SidebarSettingButton/SidebarSettingButton";
import { useThemeInfo } from "../../../hooks/Theme";

function SidebarSettings() {
  const { isDark } = useThemeInfo();
  return (
    <>
      <Flex zIndex={"100"} opacity={0.9} justify={"center"} w={"100%"} px={3} py={1}>
        <Heading w={"87%"} fontSize={"lg"}>
          <NavLink children={"Settings"} to={"/settings"} />
        </Heading>
      </Flex>
      <Flex mt={"2px"} opacity={isDark ? 0.8 : 0.6} justify={"center"}>
        <Stack w={"87%"} spacing={0} fontWeight={"black"}>
          <SidebarSettingButton children={"Account"} icon={<FaUserGear />} to={"account"} />
          <SidebarSettingButton children={"Profile"} icon={<FaUserPen />} to={"profile"} />
          <SidebarSettingButton children={"Theme"} icon={<FaPaintbrush />} to={"theme"} />
        </Stack>
      </Flex>
    </>
  );
}

export default SidebarSettings;
