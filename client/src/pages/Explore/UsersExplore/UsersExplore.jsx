import { useEffect, useState } from "react";
import { useExploreUsersQuery } from "../../../api/accountsAPISlice";
import { useSelector } from "react-redux";
import UserCard from "../../../components/Cards/UserCard/UserCard";
import Pagination from "../../../components/Pagination/Pagination";
import Cookies from "js-cookie";

function UsersExplore() {
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
      Card={UserCard}
      usePageQuery={useExploreUsersQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default UsersExplore;
