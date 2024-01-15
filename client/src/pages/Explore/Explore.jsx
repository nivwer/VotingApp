import PollsExplore from "./PollsExplore/PollsExplore";
import UsersExplore from "./UsersExplore/UsersExplore";

function Explore({ type }) {
  return (
    <>
      {type == "users" && <UsersExplore />}
      {type == "polls" && <PollsExplore />}
    </>
  );
}

export default Explore;
