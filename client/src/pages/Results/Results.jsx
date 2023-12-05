import { useSearchParams } from "react-router-dom";
import UsersResults from "./UsersResults/UsersResults";
import PollsResults from "./PollsResults/PollsResults";
import SearchInput from "../../components/Form/SearchInput/SearchInput";

function Results() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  return (
    <>
      <SearchInput />
      {type == "users" && <UsersResults />}
      {type == "polls" && <PollsResults />}
    </>
  );
}

export default Results;
