// Hooks.
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetUserPollsQuery } from "../../../../../api/pollApiSlice";
// Components.
import Pagination from "../../../../../components/Pagination/Pagination";
import PollCard from "../../../../../components/Cards/PollCard/PollCard";

// SubComponent ( ProfileBody ).
function ProfileUserPolls({ id }) {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  // Update data to fetchs.
  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated
        ? { headers: { Authorization: `Token ${token}` } }
        : {};

      setDataQuery({ ...headers, id: id, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);

  // Reset the values.
  useEffect(() => {
    setResetValues(true);
  }, [id, isAuthenticated]);

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
