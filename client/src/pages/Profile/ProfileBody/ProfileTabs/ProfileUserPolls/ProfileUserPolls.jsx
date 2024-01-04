import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetUserPollsQuery } from "../../../../../api/pollsAPISlice";
import Pagination from "../../../../../components/Pagination/Pagination";
import PollCard from "../../../../../components/Cards/PollCard/PollCard";
import Cookies from "js-cookie";

function ProfileUserPolls({ id }) {
  const csrftoken = Cookies.get("csrftoken");
  const { isAuthenticated } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
      setDataQuery({ ...headers, id: id, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);
  useEffect(() => setResetValues(true), [id, isAuthenticated]);

  return (
    <Pagination
      Card={PollCard}
      usePageQuery={useGetUserPollsQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default ProfileUserPolls;
