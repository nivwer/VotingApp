// Hooks.
import { useEffect, useState } from "react";
import { useReadCommentsQuery } from "../../../api/pollApiSlice";
import { useSelector } from "react-redux";
// Components.
import PollCommentInput from "./PollCommentInput";
import { Box, Stack } from "@chakra-ui/react";

// Components.
function PollComments({ id }) {
  const [data, setData] = useState(false);
  const { isAuthenticated, token } = useSelector((state) => state.session);

  // Query to the backend to get the comments.
  const { data: dataComments, isLoading } = useReadCommentsQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (isAuthenticated) {
      setData({
        headers: { Authorization: `Token ${token}` },
        id: id,
      });
    } else {
      setData({ id: id });
    }
  }, [id, isAuthenticated]);

  return (
    <>
      <Stack>
        <PollCommentInput id={id} />

        {dataComments && dataComments.comments ? (
          dataComments.comments.map((comment, index) => (
            <Box key={index}>{comment.comment}</Box>
          ))
        ) : (
          <div>not comments</div>
        )}
      </Stack>
    </>
  );
}

export default PollComments;
