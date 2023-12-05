import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetUserPollsQuery } from "../../../../../api/pollApiSlice";
import Pagination from "../../../../../components/Pagination/Pagination";
import PollCard from "../../../../../components/Cards/PollCard/PollCard";

function ProfileUserPolls({ id }) {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
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
