// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
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
function CommentCardMenu({ id, user_id, poll_id, deleteComment, isLoading }) {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token, user } = useSelector(
    (state) => state.session
  );

  // Delete poll.
  const handleDeleteComment = async (poll_id, id) => {
    try {
      const res = await deleteComment({
        id: poll_id,
        comment_id: id,
        headers: { Authorization: `Token ${token}` },
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
      {isAuthenticated && user.id == user_id && (
        <Menu>
          <MenuButton
            isDisabled={isLoading}
            as={IconButton}
            aria-label={"Options"}
            icon={<FaEllipsis />}
            borderRadius={"full"}
            variant={"ghost"}
            opacity={0.6}
          />

          <MenuList bg={isDark ? "black" : "white"} zIndex={1100}>
            <MenuItem
              as={Button}
              onClick={() => handleDeleteComment(poll_id, id)}
              {...itemStyle}
              isDisabled={isLoading}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}

export default CommentCardMenu;
