// Hooks.
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
// Components.
import PollModal from "../../../../Modals/PollModal/PollModal";
import CardMenu from "../../../../Menus/CardMenu/CardMenu";
import CardMenuItem from "../../../../Menus/CardMenu/CardMenuItem/CardMenuItem";
// Icons.
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

// SubComponent ( PollCardHeader ).
function PollCardMenu({ poll, deletePoll, isLoading }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector(
    (state) => state.session
  );
  const [dataMutation, setDataMutation] = useState(false);
  const { id } = useParams();

  // PollModal.
  const disclosure = useDisclosure();

  // Delete poll.
  const handleDeletePoll = async (poll_id) => {
    try {
      const res = await deletePoll({ ...dataMutation, id: poll_id });
      res.data && id && navigate(`/${poll.profile.username}`);
    } catch (error) {
      console.log(error);
    }
  };

  // Update data to mutations.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataMutation({ ...headers });
  }, [poll, isAuthenticated]);

  return (
    <>
      {isAuthenticated && user.id == poll.user_id && (
        <CardMenu isLoading={isLoading}>
          <CardMenuItem
            onClick={disclosure.onOpen}
            isLoading={isLoading}
            icon={<FaPenToSquare />}
          >
            Edit
          </CardMenuItem>
          <CardMenuItem
            onClick={() => handleDeletePoll(poll.id)}
            isLoading={isLoading}
            icon={<FaTrash />}
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
