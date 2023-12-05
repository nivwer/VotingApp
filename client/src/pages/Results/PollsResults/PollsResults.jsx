import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchPollsQuery } from "../../../api/pollApiSlice";
import { useSelector } from "react-redux";
import PollCard from "../../../components/Cards/PollCard/PollCard";
import Pagination from "../../../components/Pagination/Pagination";

function PollsResults() {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
      setDataQuery({ ...headers, query: query, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);
  useEffect(() => setResetValues(true), [query, type, isAuthenticated]);

  return (
    <Pagination
      Card={PollCard}
      usePageQuery={useSearchPollsQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default PollsResults;
