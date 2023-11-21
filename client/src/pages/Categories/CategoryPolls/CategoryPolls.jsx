// Hooks.
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetPollsCategoryQuery } from "../../../api/pollApiSlice";
// Components.
import Pagination from "../../../components/Pagination/Pagination";
import PollCard from "../../../components/Cards/PollCard/PollCard";

// Page.
function CategoryPolls() {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { category } = useParams();
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  // Update data to fetchs.
  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated
        ? { headers: { Authorization: `Token ${token}` } }
        : {};

      setDataQuery({ ...headers, category: category, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);

  // Reset the values.
  useEffect(() => {
    setResetValues(true);
  }, [category, isAuthenticated]);

  return (
    <Pagination
      Card={PollCard}
      usePageQuery={useGetPollsCategoryQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default CategoryPolls;
