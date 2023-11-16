// Hooks.
import { useEffect, useState } from "react";
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
function PollCardFooter({ poll, userActions, isLoading, state }) {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { has_shared, has_bookmarked } = userActions
  const { showInputOption, setShowInputOption } = state;
  // Mutation.
  const [dataMutation, setDataMutation] = useState(false);

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
        const res = !has_shared
          ? await sharePoll(dataMutation)
          : await unsharePoll(dataMutation);
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
        const res = !has_bookmarked
          ? await bookmarkPoll(dataMutation)
          : await unbookmarkPoll(dataMutation);
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/signin");
    }
  };

  // Update data to mutations.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataMutation({ ...headers, id: poll.id });
  }, [isAuthenticated]);

  return (
    <HStack w={"100%"} justify={"space-between"}>
      <HStack mx={5} spacing={4}>
        {/* Comment. */}
        <Link to={`/${poll.user_profile.username}/${poll.id}`}>
          <PollCardButton icon={<FaRegComment />} isDisabled={isLoading}>
            {poll.comments_counter}
          </PollCardButton>
        </Link>
        {/* Share. */}
        <PollCardButton
          onClick={() => handleShare()}
          active={has_shared ? true : false}
          icon={<FaRetweet />}
          isLoading={isShareLoading || isUnshareLoading}
          isDisabled={isLoading}
        >
          {poll.shares_counter}
        </PollCardButton>

        {/* Bookmark. */}
        <PollCardButton
          onClick={() => handleBookmark()}
          active={has_bookmarked ? true : false || false}
          icon={has_bookmarked ? <FaBookmark /> : <FaRegBookmark />}
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
