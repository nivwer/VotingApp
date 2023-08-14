// Hooks.
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useViewUserMutation } from "../../api/authApiSlice";

// Page.
function ViewPolls() {
  const data = useSelector((state) => state.session);
  const [user, setUser] = useState(null);
  const [viewUser, { data: dataUser, error }] = useViewUserMutation();

  useEffect(() => {
    if (data.token) {
      viewUser({ token: data.token });
    }
  }, []);

  useEffect(()=>{
    if (dataUser) {
      setUser(dataUser)
    }
  }, [dataUser])

  return (
    <>
      <div>ViewPolls</div>
      <pre>{JSON.stringify(user, null, 4)}</pre>
    </>
  );
}

export default ViewPolls;
