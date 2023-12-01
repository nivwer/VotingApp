// Hooks.
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
// SubComponents.
import UsersResults from "./UsersResults/UsersResults";
import PollsResults from "./PollsResults/PollsResults";
import { Center } from "@chakra-ui/react";
import SearchInput from "../../components/Inputs/SearchInput/SearchInput";
import { useThemeInfo } from "../../hooks/Theme";

// Page.
function Results() {
  const { isDark } = useThemeInfo();
  const { user } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  return (
    <>
      <Center
        zIndex={"1600"}
        minH={"70px"}
        borderBottom={"3px solid"}
        borderColor={isDark ? "gothicPurpleAlpha.200" : "gothicPurpleAlpha.200"}
        borderRadius={"3px"}
        top={"80px"}
        pos={"sticky"}
        mb={4}
        bg={isDark ? "black" : "white"}
      >
        <SearchInput />
      </Center>
      {type == "users" && <UsersResults />}
      {type == "polls" && <PollsResults />}
    </>
  );
}

export default Results;
