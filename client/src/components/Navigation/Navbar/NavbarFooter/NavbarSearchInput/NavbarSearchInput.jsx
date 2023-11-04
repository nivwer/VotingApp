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
  const [searchType, setSearchType] = useState("poll");

  // React hook form.
  const { register, handleSubmit } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    // if (searchType == "user") {
    //   navigate(`/${data.search}`);
    // }
    // if (searchType == "poll") {
    //     navigate(`/${data.search}`);
    // }
  });

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <InputGroup size={"sm"}>
          <InputLeftElement
            w={"45px"}
            children={
              <IconButton
                size={"sm"}
                variant={"ghost"}
                borderLeftRadius={"full"}
                w={"45px"}
                type="submit"
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
            pl={"50px"}
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
                  size={"sm"}
                  variant={"ghost"}
                  borderRightRadius={"full"}
                  w={"auto"}
                  pr={5}
                  leftIcon={
                    <SearchIcon
                      opacity={0.5}
                      color={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
                    />
                  }
                >
                  <Text mt={"2px"}>{searchType}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSearchType("user")}>
                    User
                  </MenuItem>
                  <MenuItem onClick={() => setSearchType("poll")}>
                    Poll
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
