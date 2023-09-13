// Hooks.
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../hooks/Theme";
import {
  useAddUserVoteMutation,
  useUpdateUserVoteMutation,
} from "../../../api/pollApiSlice";
// Components.
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Component.
function CardOptionButton({ poll, value, children, vote, setVote, isLoading }) {
  const navigate = useNavigate();
  const { ThemeColor, isDark } = useThemeInfo();
  // Session.
  const session = useSelector((state) => state.session);

  const [addUserVote, { isLoading: isLoadingAddVote }] =
    useAddUserVoteMutation();

  const [updateUserVote, { isLoading: isLoadingUpdateVote }] =
    useUpdateUserVoteMutation();

  const handleUserVote = async (value) => {
    if (!session.token) {
      navigate("/signin");
    } else {
      const oldVote = vote;
      setVote(value);
      let res = "";
      try {
        if (vote === "") {
          res = await addUserVote({
            poll_id: poll._id,
            headers: { Authorization: `Token ${session.token}` },
            body: { vote: value },
          });
        } else {
          res = await updateUserVote({
            poll_id: poll._id,
            headers: { Authorization: `Token ${session.token}` },
            body: { vote: value },
          });
        }
        if (res.error) {
          setVote(oldVote);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Button
      onClick={() => handleUserVote(value)}
      isDisabled={isLoading}
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

export default CardOptionButton;
