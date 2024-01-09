import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "../../../api/accountsAPISlice";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserCard from "../../../components/Cards/UserCard/UserCard";
import Pagination from "../../../components/Pagination/Pagination";
import Cookies from "js-cookie";

function UsersResults() {
  const csrftoken = Cookies.get("csrftoken");
  const { isAuthenticated } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
      setDataQuery({ ...headers, query: query, page_size: 6 });
      setResetValues(false);
    }
  }, [resetValues]);
  useEffect(() => setResetValues(true), [query, type, isAuthenticated]);

  return (
    <Pagination
      Card={UserCard}
      usePageQuery={useSearchUsersQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default UsersResults;
