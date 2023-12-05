import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetUserBookmarkedPollsQuery } from "../../../../../api/pollApiSlice";
import Pagination from "../../../../../components/Pagination/Pagination";
import PollCard from "../../../../../components/Cards/PollCard/PollCard";

function ProfileBookmarkedPolls({ id }) {
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
      usePageQuery={useGetUserBookmarkedPollsQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default ProfileBookmarkedPolls;
