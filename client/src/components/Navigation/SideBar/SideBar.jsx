// Components.
import { Box, Button, Stack } from "@chakra-ui/react";
import PollModal from "../../Modals/PollModal/PollModal";
import { NavLink } from "react-router-dom";

// Component.
function SideBar({ section }) {
  return (
    <Box pos={"fixed"} bg={"blue"} w={"295px"} h={"calc(100vh - 64px)"}>
      <Stack>
        {/* New Poll button. */}
        <PollModal />

        {/* User polls voted. */}
        <Stack>
          <NavLink>
            <Button>Button1</Button>
          </NavLink>
          <NavLink>
            <Button>Button1</Button>
          </NavLink>
          <NavLink>
            <Button>Button1</Button>
          </NavLink>
          <NavLink>
            <Button>Button1</Button>
          </NavLink>
        </Stack>

        {/* Categories */}
        <Stack>
          <NavLink>
            <Button>Button1</Button>
          </NavLink>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SideBar;
