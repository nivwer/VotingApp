// Hooks.
import { useSelector } from "react-redux";
import {
  useBookmarkPollMutation,
  useSharePollMutation,
  useUnBookmarkPollMutation,
  useUnSharePollMutation,
} from "../../../../api/pollApiSlice";
// Componentes.
import { Link, useNavigate } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";
// SubComponents.
import PollCardButton from "./PollCardButton.jsx/PollCardButton";
// Icons.
import {
  FaPlus,
  FaRegComment,
  FaMinus,
  FaRetweet,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa6";

// SubComponent ( PollCard ).
function PollCardFooter({ poll, isLoading, state }) {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { showInputOption, setShowInputOption } = state;

  // Share poll mananger.
  const [sharePoll, { isLoading: isShareLoading }] = useSharePollMutation();
  const [unsharePoll, { isLoading: isUnshareLoading }] =
    useUnSharePollMutation();

  // Bookmark poll mananger.
  const [bookmarkPoll, { isLoading: isBookmarkLoading }] =
    useBookmarkPollMutation();
  const [unbookmarkPoll, { isLoading: isUnbookmarkLoading }] =
    useUnBookmarkPollMutation();

  // Share.
  const handleShare = async () => {
    if (isAuthenticated) {
      try {
        const data = {
          headers: { Authorization: `Token ${token}` },
          id: poll._id,
        };
        let res = "";
        if (!poll.user_actions.has_shared) {
          res = await sharePoll(data);
        } else {
          res = await unsharePoll(data);
        }

        // If server error.
        if (res.error) {
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/signin");
    }
  };

  // Bookmark.
  const handleBookmark = async () => {
    if (isAuthenticated) {
      try {
        const data = {
          headers: { Authorization: `Token ${token}` },
          id: poll._id,
        };
        let res = "";
        if (!poll.user_actions.has_bookmarked) {
          res = await bookmarkPoll(data);
        } else {
          res = await unbookmarkPoll(data);
        }

        // If server error.
        if (res.error) {
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/signin");
    }
  };

  return (
    <HStack w={"100%"} justify={"space-between"}>
      <HStack mx={5} spacing={4}>
        {/* Comment. */}
        <Link to={`/${poll.profile.username}/${poll._id}`}>
          <PollCardButton icon={<FaRegComment />} isDisabled={isLoading}>
            {poll.comments_counter}
          </PollCardButton>
        </Link>
        {/* Share. */}
        <PollCardButton
          onClick={() => handleShare()}
          active={poll.user_actions.has_shared ? true : false}
          icon={<FaRetweet />}
          isLoading={isShareLoading || isUnshareLoading}
          isDisabled={isLoading}
        >
          {poll.shares_counter}
        </PollCardButton>

        {/* Bookmark. */}
        <PollCardButton
          onClick={() => handleBookmark()}
          active={poll.user_actions.has_bookmarked ? true : false}
          icon={
            poll.user_actions.has_bookmarked ? <FaBookmark /> : <FaRegBookmark />
          }
          isLoading={isBookmarkLoading || isUnbookmarkLoading}
          isDisabled={isLoading}
        >
          {poll.bookmarks_counter}
        </PollCardButton>
      </HStack>
      <Box mx={5}>
        {/* Show Input Option. */}
        <PollCardButton
          icon={!showInputOption ? <FaPlus /> : <FaMinus />}
          isDisabled={isLoading}
          onClick={() => setShowInputOption(!showInputOption)}
        ></PollCardButton>
      </Box>
    </HStack>
  );
}

export default PollCardFooter;
