import { useSearchParams } from "react-router-dom";
import UsersExplore from "./UsersExplore/UsersExplore";

function Explore() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  return <>{type == "users" && <UsersExplore />}</>;
}

export default Explore;
