// Hooks.
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useThemeInfo } from "../../../hooks/Theme";
import {
  useAddUserVoteMutation,
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
  // Session.
  const session = useSelector((state) => state.session);

  const [addUserVote, { isLoading: isLoadingAddVote }] =
    useAddUserVoteMutation();

  const [updateUserVote, { isLoading: isLoadingUpdateVote }] =
    useUpdateUserVoteMutation();

  const isLoading = isLoadingAddVote || isLoadingUpdateVote;

  const handleUserVote = async (value) => {
    if (!session.token) {
      navigate("/signin");
    } else if (value != vote) {
      const oldVote = vote;
      setVote(value);
      let res = "";
      const data = {
        poll_id: poll._id,
        headers: { Authorization: `Token ${session.token}` },
        body: { vote: value },
      };
      try {
        if (vote === "") {
          res = await addUserVote(data);
        } else {
          res = await updateUserVote(data);
        }
        if (res.error) {
          setVote(oldVote);
        }
      } catch (error) {
        setVote(oldVote);
        console.log(error);
      }
    } else {
      console.log("delete vote");
    }
  };

  useEffect(() => {
    if (isLoading) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [isLoading]);

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
