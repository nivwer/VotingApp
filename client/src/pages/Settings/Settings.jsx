// Components.
import { Button, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// Page.
function Settings() {
  return (
    <Stack>
      <NavLink to={"/settings/account"}>
        <Button>Account</Button>
      </NavLink>
      <NavLink to={"/settings/profile"}>
        <Button>Profile</Button>
      </NavLink>
      <NavLink to={"/settings/theme"}>
        <Button>Theme</Button>
      </NavLink>
    </Stack>
  );
}

export default Settings;
