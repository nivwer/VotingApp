import { HStack, Icon, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import CustomButton from "../../../components/Buttons/CustomButton/CustomButton";

function SettingLinkButton({ children, to, icon }) {
  return (
    <NavLink to={`/settings/${to}`}>
      <CustomButton size="lg" variant="ghost" w="100%" justifyContent="start" borderRadius={0}>
        <HStack px={"2"} spacing={"4"} fontSize={"lg"} fontWeight={"medium"}>
          <Icon children={icon && icon} fontSize={"2xl"} />
          <Text children={children} />
        </HStack>
      </CustomButton>
    </NavLink>
  );
}

export default SettingLinkButton;
