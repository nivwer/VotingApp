// Hooks.
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useViewUserMutation } from "../../api/authApiSlice";
import { useUserPollsMutation } from "../../api/pollApiSlice";

// Page.
function Profile() {
  const { username } = useParams();
  const session = useSelector((state) => state.session);
  // const [user, setUser] = useState(null);
  //const [viewUser, { data: dataUser, error }] = useViewUserMutation();
  const [polls, setPolls] = useState(null);
  const [userPolls, { data: dataPolls, error }] = useUserPollsMutation();

  useEffect(() => {
    if (session.token) {
      userPolls({
        headers: {
          Authorization: `Token ${session.token}`,
        },
        username: username,
      });
    } else {
      userPolls({
        username: username,
      });
    }
  }, [username]);

  useEffect(() => {
    if (dataPolls) {
      setPolls(dataPolls.polls);
    }
  }, [dataPolls]);

  return (
    <>
      <div>Profile</div>
      {dataPolls && (<div>Is owner {dataPolls.is_owner.toString()}</div>)}
      <div>
        {polls ? (
          polls.map((poll, index) => (
            <pre key={index}>{JSON.stringify(poll, null, 4)}</pre>
          ))
        ) : (
          <p>No polls available.</p>
        )}
      </div>
    </>
  );
}

export default Profile;
