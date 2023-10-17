// Hooks.
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useReadPollQuery } from "../../api/pollApiSlice";
// Components.
import PollCard from "../../components/Cards/PollCard/PollCard";

// Page.
function Poll() {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { id } = useParams();
  const [data, setData] = useState(false);

  const { data: poll } = useReadPollQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (isAuthenticated) {
      setData({
        headers: { Authorization: `Token ${token}` },
        id: id,
      });
    } else {
      setData({ id: id });
    }
  }, [id, isAuthenticated]);

  return <>{poll && <PollCard poll={poll} />} </>;
}

export default Poll;
