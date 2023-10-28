// Hooks.
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThemeInfo } from "../../../../../hooks/Theme";
import {
  useAddUserVoteMutation,
  useDeleteUserVoteMutation,
  useUpdateUserVoteMutation,
} from "../../../../../api/pollApiSlice";
// Components.
import { Button, HStack, Text } from "@chakra-ui/react";

// SubComponent ( PollCardBody ).
function PollCardOptionButton({ poll, option, voteState, disabledState }) {
  const navigate = useNavigate();
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { vote, setVote } = voteState;
  const { isDisabled, setIsDisabled } = disabledState;

  // Add user vote.
  const [addUserVote, { isLoading: isAddVoteLoading }] =
    useAddUserVoteMutation();

  // Update user vote.
  const [updateUserVote, { isLoading: isUpdateVoteLoading }] =
    useUpdateUserVoteMutation();

  // Delete user vote.
  const [deleteUserVote, { isLoading: isDeleteVoteLoading }] =
    useDeleteUserVoteMutation();

  const isLoading =
    isAddVoteLoading || isUpdateVoteLoading || isDeleteVoteLoading;

  const handleUserVote = async (value) => {
    let res = "";
    const data = {
      id: poll._id,
      headers: { Authorization: `Token ${token}` },
      body: { vote: value },
    };
    const oldVote = vote;

    if (!isAuthenticated) {
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
      onClick={() => handleUserVote(option.value)}
      isDisabled={isLoading ? false : isDisabled}
      isLoading={isLoading}
      loadingText={<Text w={"90%"}>{option.value}</Text>}
      variant={vote === option.value ? "solid" : "outline"}
      colorScheme={vote === option.value ? ThemeColor : "default"}
      borderRadius={"3xl"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.400"}
      opacity={0.8}
      justifyContent="start"
      textAlign={"start"}
      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
      px={"5"}
      py={"2.5"}
      h={"100%"}
    >
      <HStack justify={"space-between"} w={"100%"}>
        <Text textAlign={"start"} w={"86%"}>
          {option.option_text}
        </Text>
        <Text fontWeight={"bold"} w={"auto"}>
          {option.votes === 0
            ? "0%"
            : `${((option.votes * 100) / poll.votes_counter).toFixed(0)}%`}
        </Text>
      </HStack>
    </Button>
  );
}

export default PollCardOptionButton;
