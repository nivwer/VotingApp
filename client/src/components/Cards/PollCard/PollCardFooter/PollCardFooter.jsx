// Hooks.
// Componentes.
import { Link } from "react-router-dom";
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
  const { showInputOption, setShowInputOption } = state;
  return (
    <HStack w={"100%"} justify={"space-between"}>
      <HStack mx={5} spacing={4}>
        <Link to={`/${poll.profile.username}/${poll._id}`}>
          <PollCardButton icon={<FaRegComment />} isLoading={isLoading}>
            {poll.comment_counter}
          </PollCardButton>
        </Link>
        <PollCardButton icon={<FaRetweet />} isLoading={isLoading}>
          {poll.share_counter}
        </PollCardButton>
        <PollCardButton icon={<FaBookmark />} isLoading={isLoading}>
          <Link to={`/${poll.profile.username}/${poll._id}`}>Views</Link>
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
