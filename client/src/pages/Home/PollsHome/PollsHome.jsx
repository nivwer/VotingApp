import { useEffect, useState } from "react";
import { useAllPollsQuery } from "../../../api/pollsAPISlice";
import { useSelector } from "react-redux";
import Pagination from "../../../components/Pagination/Pagination";
import Cookies from "js-cookie";
import PollCard from "../../../components/Cards/PollCard/PollCard";

function PollsHome() {
  const csrftoken = Cookies.get("csrftoken");
  const { isAuthenticated } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
      setDataQuery({ ...headers, page_size: 6 });
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