import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useBookmarkPollMutation,
  useSharePollMutation,
  useUnBookmarkPollMutation,
  useUnSharePollMutation,
} from "../../../../api/pollApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { Box, HStack } from "@chakra-ui/react";
import PollCardButton from "./PollCardButton.jsx/PollCardButton";
import {
  FaPlus,
  FaRegComment,
  FaMinus,
  FaRetweet,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa6";

function PollCardFooter({ poll, userActions, isLoading, state }) {
  const { showInputOption, setShowInputOption } = state;
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [dataMutation, setDataMutation] = useState(false);
  const [hasShared, setHasShared] = useState(userActions.has_shared ?? false);
  const [hasBookmarked, setHasBookmarked] = useState(userActions.has_bookmarked ?? false);
  // Share poll mananger.
  const [sharePoll, { isLoading: isShareLoading }] = useSharePollMutation();
  const [unsharePoll, { isLoading: isUnshareLoading }] = useUnSharePollMutation();
  // Bookmark poll mananger.
  const [bookmarkPoll, { isLoading: isBookmarkLoading }] = useBookmarkPollMutation();
  const [unbookmarkPoll, { isLoading: isUnbookmarkLoading }] = useUnBookmarkPollMutation();

  // Share.
  const handleShare = async () => {
    if (!isAuthenticated) return navigate("/signin");
    if (userActions.has_shared == hasShared) {
      try {
        setHasShared(!hasShared);
        const res = !hasShared ? await sharePoll(dataMutation) : await unsharePoll(dataMutation);
        if (res.error) setHasShared(!hasShared);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Bookmark.
  const handleBookmark = async () => {
    if (!isAuthenticated) navigate("/signin");
    if (userActions.has_bookmarked == hasBookmarked) {
      try {
        setHasBookmarked(!hasBookmarked);
        const res = !hasBookmarked
          ? await bookmarkPoll(dataMutation)
          : await unbookmarkPoll(dataMutation);
        if (res.error) setHasBookmarked(!hasBookmarked);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
    setDataMutation({ ...headers, id: poll.id });
  }, [poll, isAuthenticated]);

  useEffect(() => {
    setHasShared(userActions.has_shared);
    setHasBookmarked(userActions.has_bookmarked);
  }, [userActions]);

  return (
    <HStack w={"100%"} justify={"space-between"}>
      <HStack mx={{ base: 0, sm: 5 }} spacing={4}>
        {/* Comment. */}
        <Link to={`/${poll.user_profile.username}/${poll.id}`}>
          <PollCardButton icon={<FaRegComment />} isDisabled={isLoading}>
            {poll.comments_counter}
          </PollCardButton>
        </Link>
        {/* Share. */}
        <PollCardButton
          onClick={() => handleShare()}
          active={hasShared ? true : false}
          icon={<FaRetweet />}
          isLoading={isShareLoading || isUnshareLoading}
          isDisabled={isLoading}
          children={poll.shares_counter}
        />
        {/* Bookmark. */}
        <PollCardButton
          onClick={() => handleBookmark()}
          active={hasBookmarked ? true : false}
          icon={hasBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          isLoading={isBookmarkLoading || isUnbookmarkLoading}
          isDisabled={isLoading}
          children={poll.bookmarks_counter}
        />
      </HStack>
      <Box mx={5}>
        {/* Show Input Option. */}
        <PollCardButton
          icon={!showInputOption ? <FaPlus /> : <FaMinus />}
          isDisabled={isLoading}
          onClick={() => setShowInputOption(!showInputOption)}
        />
      </Box>
    </HStack>
  );
}

export default PollCardFooter;
