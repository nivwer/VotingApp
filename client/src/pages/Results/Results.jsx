import { useSearchParams } from "react-router-dom";

import Search from "../Search/Search";
import UsersResults from "./UsersResults/UsersResults";
import PollsResults from "./PollsResults/PollsResults";

function Results() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  return (
    <Search>
      {type == "users" && <UsersResults />}
      {type == "polls" && <PollsResults />}
    </Search>
  );
}

export default Results;
