import { useEffect, useState } from "react";
import { useAddCommentMutation, useReadCommentsQuery } from "../../../api/pollsAPISlice";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import CommentCard from "../../../components/Cards/CommentCard/CommentCard";
import Pagination from "../../../components/Pagination/Pagination";
import CommentInput from "../../../components/Form/CommentInput/CommentInput";

function PollComments({ id }) {
  const csrftoken = Cookies.get("csrftoken");
  const { isAuthenticated } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
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
