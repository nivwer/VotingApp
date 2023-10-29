// Hooks.
import { useSelector } from "react-redux";
import {
  useSharePollMutation,
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
  FaComment,
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

  return (
    <HStack w={"100%"} justify={"space-between"}>
      <HStack mx={5} spacing={4}>
        <Link to={`/${poll.profile.username}/${poll._id}`}>
          <PollCardButton icon={<FaRegComment />} isLoading={isLoading}>
            {poll.comment_counter}
          </PollCardButton>
        </Link>
        <PollCardButton
          color={poll.user_actions.has_shared ? "blue" : "green"}
          onClick={() => handleShare()}
          icon={<FaRetweet />}
          isLoading={isLoading}
        >
          {poll.share_counter}
        </PollCardButton>
        <PollCardButton icon={<FaBookmark />} isLoading={isLoading}>
          {poll.bookmark_counter}
        </PollCardButton>
      </HStack>
      <Box mx={5}>
        <PollCardButton
          icon={!showInputOption ? <FaPlus /> : <FaMinus />}
          isLoading={isLoading}
          onClick={() => setShowInputOption(!showInputOption)}
        ></PollCardButton>
      </Box>
    </HStack>
  );
}

export default PollCardFooter;
