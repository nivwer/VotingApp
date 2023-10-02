// Hooks.
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PollCardGroup from "../../../components/Groups/PollCardGroup/PollCardGroup";
import { useGetPollsCategoryQuery } from "../../../api/pollApiSlice";
// Components.


// Page.
function CategoryPolls() {
  const session = useSelector((state) => state.session);
  const { category } = useParams();
  const [data, setData] = useState(false);

  const {
    data: dataPollsCategory,
    isLoading,
    isFetching,
  } = useGetPollsCategoryQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: { Authorization: `Token ${session.token}` },
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
  }, [category, session.token]);

  return (
    <PollCardGroup
      data={dataPollsCategory}
      isLoading={isLoading || isFetching}
    />
  );
}

export default CategoryPolls;
