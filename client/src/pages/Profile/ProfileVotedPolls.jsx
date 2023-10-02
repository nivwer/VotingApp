// Hooks.
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserVotedPollsQuery } from "../../api/pollApiSlice";
// Components.
import PollCardGroup from "../../components/Groups/PollCardGroup/PollCardGroup";

// Page.
function ProfileVotedPolls() {
  const session = useSelector((state) => state.session);
  const { username } = useParams();
  const [data, setData] = useState(false);

  // User Polls.
  const { data: dataPolls } = useGetUserVotedPollsQuery(data, {
    skip: data ? false : true,
  });
  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: { Authorization: `Token ${session.token}` },
        username: username,
        // There is no support for pagination on the frontend.
        // It has not been possible to incorporate a pagination system and an infinite scroll due to lack of time and the complexity that comes with doing so.
        // page: page,
      });
    } else {
      setData({
        username: username,
        // There is no support for pagination on the frontend.
        // page: page,
      });
    }
  }, [username, session.token]);

  return <PollCardGroup data={dataPolls} isLoading={isLoading} />;
}

export default ProfileVotedPolls;
