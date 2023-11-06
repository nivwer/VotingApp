// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// Components.
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
// Icons.
import { SearchIcon } from "@chakra-ui/icons";

// SubComponent ( NavbarFooter ).
function NavbarSearchInput() {
  const navigate = useNavigate();
  const { isDark } = useThemeInfo();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";

  const [searchType, setSearchType] = useState(type ? type : "type");

  // React hook form.
  const { register, handleSubmit, setValue } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    const type = searchType == "type" ? "polls" : searchType;
    navigate(`/results?type=${type}&query=${data.query}`);
  });

  const handleType = (type) => {
    setSearchType(type);
    onSubmit();
  };

  // useEffect(() => {
  //   type ? setSearchType(type) : setSearchType("type");
  // }, [type]);

  // useEffect(() => {
  //   query ? setValue("query", query) : setValue("query", "");
  // }, [query]);

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <InputGroup size={"sm"}>
          <InputLeftElement
            w={"45px"}
            ml={1}
            children={
              <IconButton
                size={"xs"}
                variant={"ghost"}
                borderLeftRadius={"full"}
                w={"45px"}
                type="submit"
                // colorScheme={"blue"}
              >
                <SearchIcon
                  ml={2}
                  opacity={0.5}
                  color={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
                  boxSize={4}
                />
              </IconButton>
            }
          />
          <Input
            {...register("query", { required: true })}
            defaultValue={query ? query : ""}
            pl={"55px"}
            variant={"filled"}
            size={"sm"}
            fontWeight={"medium"}
            borderRadius={"full"}
            placeholder="Search"
            focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
          />
          <InputRightElement
            w={"auto"}
            children={
              <Menu>
                <MenuButton
                  as={Button}
                  size={"xs"}
                  variant={"ghost"}
                  //   colorScheme={"blue"}
                  borderRightRadius={"full"}
                  w={"auto"}
                  pr={5}
                  mr={1}
                  leftIcon={
                    <SearchIcon
                      opacity={0.5}
                      color={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
                    />
                  }
                >
                  <Text>{searchType}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleType("type")}>Type</MenuItem>
                  <MenuItem onClick={() => handleType("users")}>Users</MenuItem>
                  <MenuItem onClick={() => handleType("polls")}>Polls</MenuItem>
                </MenuList>
              </Menu>
            }
          />
        </InputGroup>
      </FormControl>
    </form>
  );
}

export default NavbarSearchInput;
