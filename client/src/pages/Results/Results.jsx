// Hooks.
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
// SubComponents.
import UsersResults from "./UsersResults/UsersResults";
import PollsResults from "./PollsResults/PollsResults";
import { Center } from "@chakra-ui/react";
import { useThemeInfo } from "../../hooks/Theme";
import SearchInput from "../../components/Form/SearchInput/SearchInput";

// Page.
function Results() {
  const { isDark } = useThemeInfo();
  const { user } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";

  return (
    <>
      <Center
        zIndex={"1200"}
        minH={"70px"}
        borderBottom={"3px solid"}
        borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
        borderRadius={{base: 0, sm: "3px"}}
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
