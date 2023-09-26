// Hooks.
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useGetPollsCategoryQuery } from "../../api/pollApiSlice";
// Components.
import PollCardGroup from "../../components/Groups/PollCardGroup/PollCardGroup";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// Page.
function PollResults() {
  // Get parameters state from URL.
  const [searchParams, setSearchParams] = useSearchParams();

  const session = useSelector((state) => state.session);
  const category = searchParams.get("category") || ""
  const [data, setData] = useState(false);

  const { data: dataPollsCategory } = useGetPollsCategoryQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: { Authorization: `Token ${session.token}` },
        category: category,
      });
    } else {
      setData({ category: category });
    }
  }, [category, session.token]);

  return <PollCardGroup data={dataPollsCategory} />;
}

export default PollResults;
