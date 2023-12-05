import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../../hooks/Theme";
import {
  Center,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import SearchMenu from "./SearchMenu/SearchMenu";
import SearchMenuItem from "./SearchMenuItem/SearchMenuItem";
import { SearchIcon } from "@chakra-ui/icons";
import { FaHashtag, FaUserGroup } from "react-icons/fa6";

function SearchInput() {
  const navigate = useNavigate();
  const { isDark, ThemeColor } = useThemeInfo();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";
  const [searchType, setSearchType] = useState(type ? type : "type");
  const { register, handleSubmit, setValue, watch } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) =>
    navigate(`/results?type=${searchType == "type" ? "polls" : searchType}&query=${data.query}`)
  );

  useEffect(() => {
    const searchQuery = watch("query");
    if (searchType && searchQuery) onSubmit();
  }, [searchType]);

  useEffect(() => (type ? setSearchType(type) : setSearchType("type")), [type]);
  useEffect(() => (query ? setValue("query", query) : setValue("query", "")), [query]);

  return (
    <Center
      zIndex={"1200"}
      minH={"70px"}
      borderBottom={"3px solid"}
      borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
      borderRadius={{ base: 0, sm: "3px" }}
      top={{ base: "60px", md: "80px" }}
      pos={"sticky"}
      mb={4}
      bg={isDark ? "black" : "white"}
    >
      <FormControl w={"100%"}>
        <form onSubmit={onSubmit}>
          <HStack spacing={0} boxShadow={"base"} borderRadius={{ base: 0, sm: "3xl" }}>
            <InputGroup size={"md"}>
              <InputLeftElement>
                <IconButton type="submit" p={"auto"} variant={"unstyled"}>
                  <SearchIcon
                    ml={"5px"}
                    _hover={{ color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500` }}
                    color={isDark ? "whiteAlpha.700" : "blackAlpha.600"}
                    boxSize={4}
                  />
                </IconButton>
              </InputLeftElement>
              <Input
                {...register("query", { required: true })}
                defaultValue={query ? query : ""}
                placeholder="Search"
                pl={"50px"}
                variant={"filled"}
                fontWeight={"medium"}
                borderRadius={"0"}
                borderLeftRadius={{ base: 0, sm: "3xl" }}
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

            <SearchMenu searchType={searchType}>
              <SearchMenuItem icon={<FaHashtag />} value={"type"} setSearchType={setSearchType}>
                Type
              </SearchMenuItem>
              <SearchMenuItem icon={<FaUserGroup />} value={"users"} setSearchType={setSearchType}>
                Users
              </SearchMenuItem>
              <SearchMenuItem icon={<FaHashtag />} value={"polls"} setSearchType={setSearchType}>
                Polls
              </SearchMenuItem>
            </SearchMenu>
          </HStack>
        </form>
      </FormControl>
    </Center>
  );
}

export default SearchInput;
