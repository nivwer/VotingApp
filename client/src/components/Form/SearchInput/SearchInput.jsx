import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { FormControl, IconButton, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import { useThemeInfo } from "../../../hooks/Theme";
import { SearchIcon } from "@chakra-ui/icons";

function SearchInput({ searchType, setSearchType }) {
  const navigate = useNavigate();
  const { isDark, ThemeColor } = useThemeInfo();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";

  // Submit.
  const onSubmit = handleSubmit(async (data) =>
    navigate(`/results?type=${searchType}&query=${data.query}`)
  );

  const searchQuery = watch("query");

  useEffect(() => {
    if (searchQuery == "")
      navigate(searchType === "polls" ? `/search` : `/search?type=${searchType}`);
  }, [searchQuery]);

  useEffect(() => {
    if (searchType && searchQuery) onSubmit();
  }, [searchType]);

  useEffect(() => (type ? setSearchType(type) : setSearchType("polls")), [type]);
  useEffect(() => (query ? setValue("query", query) : setValue("query", "")), [query]);

  return (
    <FormControl p={2} bg={isDark ? "black" : "white"} w={"100%"}>
      <form onSubmit={onSubmit}>
        <InputGroup size={"md"}>
          <InputLeftElement>
            <IconButton type="submit" p={"auto"} variant={"unstyled"}>
              <SearchIcon
                ml={"5px"}
                color={isDark ? "whiteAlpha.700" : "blackAlpha.600"}
                boxSize={4}
                _hover={{ color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500` }}
              />
            </IconButton>
          </InputLeftElement>
          <Input
            {...register("query", { required: true })}
            defaultValue={query ? query : ""}
            placeholder="Search"
            variant={"filled"}
            pl={50}
            fontWeight={"medium"}
            borderRadius={"3xl"}
            border={isDark ? "1px solid" : "2px solid"}
            borderColor={"transparent"}
            color={isDark ? "whiteAlpha.800" : "blackAlpha.800"}
            bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
            _hover={{ bg: isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200" }}
            _focus={{ bg: isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200" }}
            focusBorderColor={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
            _placeholder={{
              color: isDark ? "gothicPurple.100" : "gothicPurple.900",
              opacity: isDark ? 0.2 : 0.3,
            }}
          />
        </InputGroup>
      </form>
    </FormControl>
  );
}

export default SearchInput;
