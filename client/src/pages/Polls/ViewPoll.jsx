// Hooks.
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { useReadPollMutation } from "../../api/pollApiSlice";

// Page.
function ViewPoll() {
  const session = useSelector((state) => state.session);
  // Get the poll id in the url.
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [getPoll, { data: dataPoll, error }] = useReadPollMutation();

  // Get the poll data.
  useEffect(() => {
    if (session.token) {
      getPoll({ 
        id: id, 
        token: session.token
       });
    }
  }, []);

  // Update poll status when the poll data is obtained.
  useEffect(() => {
    if (dataPoll) {
      setPoll(dataPoll);
    }
  }, [dataPoll]);

  return (
    <>
      <div>Profile</div>
      <pre>{JSON.stringify(poll, null, 4)}</pre>
    </>
  );
}

export default ViewPoll;
