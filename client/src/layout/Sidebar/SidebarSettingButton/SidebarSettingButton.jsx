import { NavLink } from "react-router-dom";
import CustomButton from "../../../components/Buttons/CustomButton/CustomButton";
import { HStack, Text } from "@chakra-ui/react";

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
