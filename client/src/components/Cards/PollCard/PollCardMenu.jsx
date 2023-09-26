// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import PollModal from "../../Modals/PollModal/PollModal";
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
// Icons.
import { FaEllipsis } from "react-icons/fa6";

// Component.
function PollCardMenu({ poll, deletePoll, isLoading }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // Delete poll.
  const handleDeletePoll = async (poll_id) => {
    try {
      const res = await deletePoll({
        id: poll_id,
        headers: {
          Authorization: `Token ${session.token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const itemStyle = {
    w: "100%",
    h: "100%",
    px: 3,
    py: 2,
    borderRadius: 0,
    variant: "ghost",
    justifyContent: "start",
    color: isDark ? "whiteAlpha.900" : "blackAlpha.900",
    bg: isDark ? "black" : "white",
    opacity: isDark ? 0.9 : 0.7,
  };

  return (
    <>
      {session.token && (
        <Menu>
          <MenuButton
            isDisabled={isLoading}
            as={IconButton}
            aria-label={"Options"}
            icon={<FaEllipsis />}
            borderRadius={"full"}
            variant={"ghost"}
          />
          {poll.is_owner ? (
            <MenuList bg={isDark ? "black" : "white"} zIndex={1100}>
              <MenuItem
                as={PollModal}
                poll={poll}
                buttonStyles={itemStyle}
                isDisabled={isLoading}
              />
              <MenuItem
                as={Button}
                onClick={() => handleDeletePoll(poll._id)}
                {...itemStyle}
                isDisabled={isLoading}
              >
                Delete
              </MenuItem>
            </MenuList>
          ) : (
            <MenuList>
              <MenuItem>Hola</MenuItem>
            </MenuList>
          )}
        </Menu>
      )}
    </>
  );
}

export default PollCardMenu;
