// Hooks.
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useThemeInfo } from "../../../hooks/Theme";
import { useEffect, useState } from "react";
// Components.
import {
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
// SubComponents.
import SearchMenu from "./SearchMenu/SearchMenu";
import SearchMenuItem from "./SearchMenuItem/SearchMenuItem";
// Icons.
import { SearchIcon } from "@chakra-ui/icons";
import { FaHashtag, FaUserGroup } from "react-icons/fa6";

// Component.
function SearchInput() {
  const navigate = useNavigate();
  const { isDark, ThemeColor } = useThemeInfo();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";

  const [searchType, setSearchType] = useState(type ? type : "type");

  // React hook form.
  const { register, handleSubmit, setValue, watch } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    const type = searchType == "type" ? "polls" : searchType;
    navigate(`/results?type=${type}&query=${data.query}`);
  });

  useEffect(() => {
    const searchQuery = watch("query");
    searchType && searchQuery && onSubmit();
  }, [searchType]);

  useEffect(() => {
    type ? setSearchType(type) : setSearchType("type");
  }, [type]);

  useEffect(() => {
    query ? setValue("query", query) : setValue("query", "");
  }, [query]);

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <HStack spacing={0} boxShadow={"base"} borderRadius={"3xl"}>
          <InputGroup
            size={"md"}
            //  maxW={"220px"}
          >
            <InputLeftElement
              // w={"45px"}
              children={
                <IconButton
                  size={"md"}
                  p={"auto"}
                  variant={"unstyled"}
                  borderLeftRadius={"full"}
                  // w={"45px"}
                  type="submit"
                >
                  <SearchIcon
                    ml={"5px"}
                    _hover={{
                      color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`,
                    }}
                    color={isDark ? "whiteAlpha.700" : "blackAlpha.600"}
                    boxSize={4}
                  />
                </IconButton>
              }
            />
            <Input
              {...register("query", { required: true })}
              defaultValue={query ? query : ""}
              placeholder="Search"
              pl={"50px"}
              variant={"filled"}
              size={"md"}
              fontWeight={"medium"}
              borderRadius={"0"}
              borderLeftRadius={"3xl"}
              border={isDark ? "1px solid" : "2px solid"}
              borderColor={"transparent"}
              color={isDark ? "whiteAlpha.800" : "blackAlpha.800"}
              bg={isDark ? "gothicPurpleAlpha.200" : "gothicPurpleAlpha.200"}
              _hover={{
                bg: isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.300",
              }}
              _focus={{
                bg: isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.300",
              }}
              focusBorderColor={
                isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`
              }
            />
          </InputGroup>

          <SearchMenu searchType={searchType}>
            <SearchMenuItem
              icon={<FaHashtag />}
              value={"type"}
              setSearchType={setSearchType}
            >
              Type
            </SearchMenuItem>
            <SearchMenuItem
              icon={<FaUserGroup />}
              value={"users"}
              setSearchType={setSearchType}
            >
              Users
            </SearchMenuItem>
            <SearchMenuItem
              icon={<FaHashtag />}
              value={"polls"}
              setSearchType={setSearchType}
            >
              Polls
            </SearchMenuItem>
          </SearchMenu>
        </HStack>
      </FormControl>
    </form>
  );
}

export default SearchInput;
