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
      borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
      borderRadius={{base: 0, sm: "3px"}}
      pos={"sticky"}
      top={"80px"}
      mb={4}
      bg={isDark ? "black" : "white"}
    >
      <SearchInput />
    </Center>
  );
}

export default Search;
