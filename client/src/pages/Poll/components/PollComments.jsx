// Hooks.
import { useEffect, useState } from "react";
import { useReadCommentsQuery } from "../../../api/pollApiSlice";
import { useSelector } from "react-redux";
// Components.
import PollCommentInput from "./PollCommentInput";
import CustomSpinner from "../../../components/Spinners/CustomSpinner";
import PollCommentCard from "./PollCommentCard";

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
      {isAuthenticated && <PollCommentInput id={id} />}

      {dataComments && dataComments.comments && !isLoading
        ? dataComments.comments.map((comment, index) => (
            <PollCommentCard key={index} comment={comment} />
          ))
        : dataComments && !isLoading && <div>{dataComments.message}</div>}
      {(isLoading || !dataComments) && <CustomSpinner />}
    </>
  );
}

export default PollComments;
