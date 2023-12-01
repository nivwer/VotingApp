// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
// Components.
import { Center } from "@chakra-ui/react";
import SearchInput from "../../components/Inputs/SearchInput/SearchInput";

// Page.
function Search() {
  const { isDark } = useThemeInfo();
  return (
    <Center
      minH={"70px"}
      borderBottom={"3px solid"}
      borderColor={isDark ? "gothicPurpleAlpha.200" : "gothicPurpleAlpha.200"}
      borderRadius={"3px"}
      pos={"sticky"}
      top={"80px"}
      mb={4}
    >
      <SearchInput />
    </Center>
  );
}

export default Search;
