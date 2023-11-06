// Hooks.
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
// SubComponents.
import UsersResults from "./UsersResults/UsersResults";
import PollsResults from "./PollsResults/PollsResults";

// Page.
function Results() {
  const { user } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  return (
    <>
      {type == "users" && <UsersResults />}
      {type == "polls" && <PollsResults />}
    </>
  );
}

export default Results;
