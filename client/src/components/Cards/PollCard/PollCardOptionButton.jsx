// Hooks.
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThemeInfo } from "../../../hooks/Theme";
import {
  useAddUserVoteMutation,
  useDeleteUserVoteMutation,
  useUpdateUserVoteMutation,
} from "../../../api/pollApiSlice";
// Components.
import { Button } from "@chakra-ui/react";

// Component.
function PollCardOptionButton({
  poll,
  value,
  children,
  vote,
  setVote,
  isDisabled,
  setIsDisabled,
}) {
  const navigate = useNavigate();
  const { isDark, ThemeColor } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // Add user vote.
  const [addUserVote, { isLoading: isAddVoteLoading }] =
    useAddUserVoteMutation();

  // Update user vote.
  const [updateUserVote, { isLoading: isUpdateVoteLoading }] =
    useUpdateUserVoteMutation();

  // Delete user vote.
  const [deleteUserVote, { isLoading: isDeleteVoteLoading }] =
    useDeleteUserVoteMutation();

  const isLoading = isAddVoteLoading || isUpdateVoteLoading;

  const handleUserVote = async (value) => {
    let res = "";
    const data = {
      poll_id: poll._id,
      headers: { Authorization: `Token ${session.token}` },
      body: { vote: value },
    };
    const oldVote = vote;

    if (!session.token) {
      navigate("/signin");
    } else if (value != vote) {
      setVote(value);
      try {
        if (vote === "") {
          res = await addUserVote(data);
        } else {
          res = await updateUserVote(data);
        }

        res.error && setVote(oldVote);
      } catch (error) {
        setVote(oldVote);
        console.log(error);
      }
    } else {
      setVote("");
      try {
        if (vote != "") {
          res = await deleteUserVote(data);
        }
        res.error && setVote(oldVote);
      } catch (error) {
        setVote(oldVote);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    isLoading ? setIsDisabled(true) : setIsDisabled(false);
  }, [isLoading]);

  useEffect(() => {
    setVote(poll.user_vote);
  }, [poll]);

  return (
    <Button
      onClick={() => handleUserVote(value)}
      isDisabled={isLoading ? false : isDisabled}
      isLoading={isLoading}
      loadingText={value}
      variant={vote === value ? "solid" : "outline"}
      colorScheme={vote === value ? ThemeColor : "default"}
      borderRadius={"full"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.400"}
      opacity={0.8}
      justifyContent="start"
      wordBreak={"break-all"}
      pl={"5"}
    >
      {children}
    </Button>
  );
}

export default PollCardOptionButton;
