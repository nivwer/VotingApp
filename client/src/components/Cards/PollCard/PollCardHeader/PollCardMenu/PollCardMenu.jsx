// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// Components.
import PollModal from "../../../../Modals/PollModal/PollModal";
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

// SubComponent ( PollCardHeader ).
function PollCardMenu({ poll, deletePoll, isLoading }) {
  const navigate = useNavigate();
  const { isDark } = useThemeInfo();
  const { isAuthenticated, user, token } = useSelector(
    (state) => state.session
  );
  const { id } = useParams();

  // Delete poll.
  const handleDeletePoll = async (poll_id) => {
    try {
      const res = await deletePoll({
        id: poll_id,
        headers: { Authorization: `Token ${token}` },
      });

      if (res.data && id) {
        navigate(`/${poll.profile.username}`);
      }
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
      {isAuthenticated && (
        <Menu>
          <MenuButton
            isDisabled={isLoading}
            as={IconButton}
            aria-label={"Options"}
            icon={<FaEllipsis />}
            borderRadius={"full"}
            variant={"ghost"}
            opacity={0.6}
            position={"absolute"}
            right={5}
          />
          {user.id == poll.user_id ? (
            <MenuList bg={isDark ? "black" : "white"} zIndex={1100}>
              <MenuItem
                as={PollModal}
                poll={poll}
                buttonStyles={itemStyle}
                isDisabled={isLoading}
              />
              <MenuItem
                as={Button}
                onClick={() => handleDeletePoll(poll.id)}
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
