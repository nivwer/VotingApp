import { NavLink } from "react-router-dom";
import { HStack, Text } from "@chakra-ui/react";

import CustomButton from "../../../../components/Buttons/CustomButton/CustomButton";

function SidebarSettingButton({ children, icon, to }) {
  return (
    <NavLink to={`/settings/${to}`}>
      <CustomButton variant={"ghost"} justifyContent={"start"} w={"100%"} size={"md"}>
        <HStack spacing={4}>
          <Text children={icon} />
          <Text children={children} />
        </HStack>
      </CustomButton>
    </NavLink>
  );
}

export default SidebarSettingButton;
