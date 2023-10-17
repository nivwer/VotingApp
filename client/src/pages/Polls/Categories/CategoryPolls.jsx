// Hooks.
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetPollsCategoryQuery } from "../../../api/pollApiSlice";
// Components.
import PollCardGroup from "../../../components/Groups/PollCardGroup/PollCardGroup";

// Page.
function CategoryPolls() {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { category } = useParams();
  const [data, setData] = useState(false);

  const { data: dataPollsCategory, isLoading } = useGetPollsCategoryQuery(
    data,
    {
      skip: data ? false : true,
    }
  );

  // Update data to fetchs.
  useEffect(() => {
    window.scrollTo(0, 0);

    if (isAuthenticated) {
      setData({
        headers: { Authorization: `Token ${token}` },
        category: category,
        // There is no support for pagination on the frontend.
        // It has not been possible to incorporate a pagination system and an infinite scroll due to lack of time and the complexity that comes with doing so.
        // page: page,
      });
    } else {
      setData({
        category: category,
        // There is no support for pagination on the frontend.
        // page: page,
      });
    }
  }, [category, isAuthenticated]);

  return <PollCardGroup data={dataPollsCategory} isLoading={isLoading} />;
}

export default CategoryPolls;
