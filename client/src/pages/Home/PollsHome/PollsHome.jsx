import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAllPollsQuery } from "../../../api/pollsAPISlice";
import Pagination from "../../../components/Pagination/Pagination";
import PollCard from "../../../components/Cards/PollCard/PollCard";

function PollsHome() {
  const { isAuthenticated, csrftoken } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
      setDataQuery({ ...headers, page_size: 3 });
      setResetValues(false);
    }
  }, [resetValues]);
  useEffect(() => setResetValues(true), [isAuthenticated]);

  return (
    <Pagination
      Card={PollCard}
      usePageQuery={useAllPollsQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default PollsHome;
