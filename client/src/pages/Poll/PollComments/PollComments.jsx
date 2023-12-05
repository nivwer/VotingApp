import { useEffect, useState } from "react";
import { useAddCommentMutation, useReadCommentsQuery } from "../../../api/pollApiSlice";
import { useSelector } from "react-redux";
import CommentCard from "../../../components/Cards/CommentCard/CommentCard";
import Pagination from "../../../components/Pagination/Pagination";
import CommentInput from "../../../components/Form/CommentInput/CommentInput";  

function PollComments({ id }) {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
      setDataQuery({ ...headers, id: id, page_size: 5 });
      setResetValues(false);
    }
  }, [resetValues]);
  useEffect(() => setResetValues(true), [id, isAuthenticated]);

  return (
    <>
      {isAuthenticated && <CommentInput id={id} useAddCommentMutation={useAddCommentMutation} />}
      <Pagination
        Card={CommentCard}
        usePageQuery={useReadCommentsQuery}
        dataQuery={dataQuery}
        reset={{ resetValues: resetValues, setResetValues: setResetValues }}
      />
    </>
  );
}

export default PollComments;
