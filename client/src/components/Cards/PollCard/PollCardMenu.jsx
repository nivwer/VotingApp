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
// Styles.
import { getPollCardStyles } from "./PollCardStyles";

// Component.
function PollCardMenu({ poll, deletePoll, isLoading }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const styles = getPollCardStyles(ThemeColor, isDark);
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

  return (
    <>
      {session.token && (
        <Menu>
          <MenuButton
            isDisabled={isLoading}
            as={IconButton}
            aria-label={"Options"}
            icon={<FaEllipsis />}
            {...styles.header.menu.button}
          />
          {poll.is_owner ? (
            <MenuList {...styles.header.menu.list}>
              <MenuItem
                isDisabled={isLoading}
                as={PollModal}
                buttonStyles={styles.header.menu.item}
                poll={poll}
              >
                Edit
              </MenuItem>
              <MenuItem
                isDisabled={isLoading}
                as={Button}
                {...styles.header.menu.item}
                onClick={() => handleDeletePoll(poll._id)}
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
