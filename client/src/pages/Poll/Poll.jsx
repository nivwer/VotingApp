// Hooks.
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useReadPollQuery } from "../../api/pollApiSlice";
// Components.
import PollCard from "../../components/Cards/PollCard/PollCard";

// Page.
function Poll() {
  const session = useSelector((state) => state.session);
  const { id } = useParams();
  const [data, setData] = useState(false);
  
  const { data: poll } = useReadPollQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: { Authorization: `Token ${session.token}` },
        id: id,
      });
    } else {
      setData({ id: id });
    }
  }, [id, session.token]);


  return <>{poll && <PollCard poll={poll}/>} </>;
}

export default Poll;
