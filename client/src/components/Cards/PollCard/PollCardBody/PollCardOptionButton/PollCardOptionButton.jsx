// Hooks.
import { useEffect, useState } from "react";
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
function PollCardOptionButton({
  poll,
  userActions,
  option,
  voteState,
  disabledState,
}) {
  const navigate = useNavigate();
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { has_voted } = userActions;
  const { vote, setVote } = voteState;
  const { isDisabled, setIsDisabled } = disabledState;
  const [dataMutation, setDataMutation] = useState(false);

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
    const body = { body: { vote: value } };
    const currentVote = vote;

    if (isAuthenticated) {
      setVote(value != currentVote ? value : "");
      try {
        const res =
          value != currentVote
            ? currentVote === ""
              ? await addUserVote({ ...dataMutation, ...body })
              : await updateUserVote({ ...dataMutation, ...body })
            : await deleteUserVote(dataMutation);
        res.error && setVote(currentVote);
      } catch (error) {
        setVote(currentVote);
        console.log(error);
      }
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    setIsDisabled(isLoading ? true : false);
  }, [isLoading]);

  useEffect(() => {
    setVote(has_voted ? has_voted.vote : "");
  }, [poll]);

  // Update data to mutations.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataMutation({ ...headers, id: poll.id });
  }, [poll, isAuthenticated]);

  return (
    <Button
      onClick={() => handleUserVote(option.option_text)}
      isDisabled={isLoading ? false : isDisabled}
      isLoading={isLoading}
      loadingText={<Text w={"90%"}>{option.option_text}</Text>}
      variant={vote === option.option_text ? "solid" : "outline"}
      colorScheme={vote === option.option_text ? ThemeColor : "default"}
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
