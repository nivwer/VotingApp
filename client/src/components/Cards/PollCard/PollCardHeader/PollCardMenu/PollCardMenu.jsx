import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import PollModal from "../../../../Modals/PollModal/PollModal";
import CardMenu from "../../../../Menus/CardMenu/CardMenu";
import CardMenuItem from "../../../../Menus/CardMenu/CardMenuItem/CardMenuItem";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useThemeInfo } from "../../../../../hooks/Theme";

function PollCardMenu({ poll, deletePoll, isLoading }) {
  const { isDark } = useThemeInfo();
  const navigate = useNavigate();
  const { isAuthenticated, user, csrftoken } = useSelector((state) => state.session);
  const [dataMutation, setDataMutation] = useState(false);
  const { id } = useParams();
  const disclosure = useDisclosure();

  // Delete poll.
  const handleDeletePoll = async (poll_id, username) => {
    try {
      const res = await deletePoll({ ...dataMutation, id: poll_id });
      if (res.data && id) navigate(`/${username}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
    setDataMutation({ ...headers });
  }, [poll, isAuthenticated]);

  return (
    <>
      {isAuthenticated && user.id == poll.user_id && (
        <CardMenu isLoading={isLoading} color={isDark ? "whiteAlpha.600" : "blackAlpha.600"}>
          <CardMenuItem onClick={disclosure.onOpen} icon={<FaPenToSquare />} isLoading={isLoading}>
            Edit
          </CardMenuItem>
          <CardMenuItem
            onClick={() => handleDeletePoll(poll.id, poll.user_profile.username)}
            icon={<FaTrash />}
            isLoading={isLoading}
          >
            Remove
          </CardMenuItem>
        </CardMenu>
      )}

      {poll && <PollModal poll={poll} disclosure={disclosure} />}
    </>
  );
}

export default PollCardMenu;
