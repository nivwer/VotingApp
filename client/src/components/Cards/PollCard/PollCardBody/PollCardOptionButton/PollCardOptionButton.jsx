import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThemeInfo } from "../../../../../hooks/Theme";
import {
  useAddUserVoteMutation,
  useDeleteUserVoteMutation,
  useUpdateUserVoteMutation,
} from "../../../../../api/pollsAPISlice";
import { Button, HStack, Text } from "@chakra-ui/react";
import CustomButton from "../../../../Buttons/CustomButton/CustomButton";

function PollCardOptionButton({ poll, userActions, option, voteState, disabledState }) {
  const navigate = useNavigate();
  const { ThemeColor } = useThemeInfo();
  const { isAuthenticated, csrftoken } = useSelector((state) => state.session);
  const { has_voted } = userActions;
  const { vote, setVote } = voteState;
  const { isDisabled, setIsDisabled } = disabledState;
  const [dataMutation, setDataMutation] = useState(false);
  const [addUserVote, { isLoading: isAddVoteLoading }] = useAddUserVoteMutation();
  const [updateUserVote, { isLoading: isUpdateVoteLoading }] = useUpdateUserVoteMutation();
  const [deleteUserVote, { isLoading: isDeleteVoteLoading }] = useDeleteUserVoteMutation();
  const isLoading = isAddVoteLoading || isUpdateVoteLoading || isDeleteVoteLoading;

  const handleUserVote = async (value) => {
    if (!isAuthenticated) return navigate("/signin");
    const body = { body: { vote: value } };
    const currentVote = vote;
    setVote(value != currentVote ? value : "");
    try {
      const res =
        value != currentVote
          ? currentVote === ""
            ? await addUserVote({ ...dataMutation, ...body })
            : await updateUserVote({ ...dataMutation, ...body })
          : await deleteUserVote(dataMutation);
      if (res.error) setVote(currentVote);
    } catch (error) {
      setVote(currentVote);
      console.log(error);
    }
  };

  useEffect(() => setIsDisabled(isLoading ? true : false), [isLoading]);
  useEffect(() => setVote(has_voted ? has_voted.vote : ""), [poll]);

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
    setDataMutation({ ...headers, id: poll.id });
  }, [poll, isAuthenticated]);

  const ButtonComponent = vote === option.option_text ? Button : CustomButton;

  return (
    <ButtonComponent
      onClick={() => handleUserVote(option.option_text)}
      isDisabled={isLoading || isDisabled}
      isLoading={isLoading}
      loadingText={<Text w={"90%"}>{option.option_text}</Text>}
      variant={vote === option.option_text ? "solid" : "outline"}
      borderRadius={"3xl"}
      colorScheme={vote === option.option_text ? ThemeColor : "gothicPurpleAlpha"}
      opacity={vote === option.option_text ? 0.9 : 1}
      justifyContent="start"
      textAlign={"start"}
      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
      px={5}
      py={"2.5"}
      h={"100%"}
    >
      <HStack justify={"space-between"} w={"100%"}>
        <Text children={option.option_text} textAlign={"start"} w={"86%"} />
        <Text fontWeight={"bold"} w={"auto"}>
          {option.votes === 0 ? "0%" : `${((option.votes * 100) / poll.votes_counter).toFixed(0)}%`}
        </Text>
      </HStack>
    </ButtonComponent>
  );
}

export default PollCardOptionButton;
