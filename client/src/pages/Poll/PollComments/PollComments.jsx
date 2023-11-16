// Hooks.
import { useEffect, useState } from "react";
import { useReadCommentsQuery } from "../../../api/pollApiSlice";
import { useSelector } from "react-redux";
// Components.
import CommentInput from "../../../components/Cards/CommentCard/CommentInput";
import CommentCard from "../../../components/Cards/CommentCard/CommentCard";
import CustomSpinner from "../../../components/Spinners/CustomSpinner/CustomSpinner";

// Components.
function PollComments({ id }) {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);

  // Query to the backend to get the comments.
  const { data: dataComments , error, isLoading } = useReadCommentsQuery(dataQuery, {
    skip: dataQuery ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataQuery({ ...headers, id: id });
  }, [id, isAuthenticated]);

  return (
    <>
      {isAuthenticated && <CommentInput id={id} />}

      {dataComments && dataComments.comments && !isLoading
        ? dataComments.comments.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))
        : dataComments && !isLoading && <div>{dataComments.message}</div>}
      {(isLoading || !dataComments) && <CustomSpinner />}
    </>
  );
}

export default PollComments;
