// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const [searchType, setSearchType] = useState("type");

  // React hook form.
  const { register, handleSubmit } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    const type = searchType == "type" ? "polls" : searchType;
    navigate(`/results?type=${type}&query=${data.search}`);
  });

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
            {...register("search", { required: true })}
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
                  <MenuItem onClick={() => setSearchType("type")}>
                    Type
                  </MenuItem>
                  <MenuItem onClick={() => setSearchType("users")}>
                    Users
                  </MenuItem>
                  <MenuItem onClick={() => setSearchType("polls")}>
                    Polls
                  </MenuItem>
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
