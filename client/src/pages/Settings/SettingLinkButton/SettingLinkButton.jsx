// Components.
import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// SubComponent ( Settings ).
function SettingLinkButton({ children, to, icon }) {
  return (
    <NavLink to={`/settings/${to}`}>
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

export default SettingLinkButton;
