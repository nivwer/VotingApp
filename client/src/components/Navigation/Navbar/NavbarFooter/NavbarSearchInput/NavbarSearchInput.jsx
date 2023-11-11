// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// Components.
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
// Icons.
import { SearchIcon } from "@chakra-ui/icons";
import { FaUserGroup, FaHashtag } from "react-icons/fa6";
import NavbarMenuItem from "./NavbarMenuItem/NavbarMenuItem";

// SubComponent ( NavbarFooter ).
function NavbarSearchInput() {
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
        <HStack spacing={0}>
          <InputGroup size={"sm"}>
            <InputLeftElement
              w={"45px"}
              children={
                <IconButton
                  size={"sm"}
                  p={"auto"}
                  variant={"unstyled"}
                  borderLeftRadius={"full"}
                  w={"45px"}
                  type="submit"
                >
                  <SearchIcon
                    ml={2}
                    opacity={isDark ? 0.5 : 1}
                    _hover={{
                      color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`,
                      opacity: 1,
                    }}
                    color={isDark ? "whiteAlpha.900" : "blackAlpha.500"}
                    boxSize={4}
                  />
                </IconButton>
              }
            />
            <Input
              {...register("query", { required: true })}
              defaultValue={query ? query : ""}
              pl={"50px"}
              variant={"filled"}
              size={"sm"}
              fontWeight={"medium"}
              borderRadius={0}
              borderLeftRadius={"full"}
              placeholder="Search"
              focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
            />
          </InputGroup>
          <Menu>
            {searchType && (
              <MenuButton
                opacity={isDark ? 0.5 : 1}
                as={Button}
                size={"sm"}
                color={isDark ? "whiteAlpha.900" : "blackAlpha.500"}
                variant={"solid"}
                borderRightRadius={"full"}
                w={"100px"}
                pr={7}
                leftIcon={
                  <>
                    {(searchType == "type" || searchType == "polls") && (
                      <FaHashtag />
                    )}
                    {searchType == "users" && <FaUserGroup />}
                  </>
                }
              >
                <Text mt={"2px"} fontWeight={"semibold"}>
                  {searchType == "type" && "Type"}
                  {searchType == "users" && "Users"}
                  {searchType == "polls" && "Polls"}
                </Text>
              </MenuButton>
            )}
            <MenuList>
              <NavbarMenuItem
                icon={<FaHashtag />}
                value={"type"}
                setSearchType={setSearchType}
              >
                Type
              </NavbarMenuItem>
              <NavbarMenuItem
                icon={<FaUserGroup />}
                value={"users"}
                setSearchType={setSearchType}
              >
                Users
              </NavbarMenuItem>
              <NavbarMenuItem
                icon={<FaHashtag />}
                value={"polls"}
                setSearchType={setSearchType}
              >
                Polls
              </NavbarMenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </FormControl>
    </form>
  );
}

export default NavbarSearchInput;
