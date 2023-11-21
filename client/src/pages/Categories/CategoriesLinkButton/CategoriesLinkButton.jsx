// Components.
import { NavLink } from "react-router-dom";
import { Button, HStack, Icon, Text } from "@chakra-ui/react";
// Icons.
import { FaHashtag } from "react-icons/fa6";
// Utils.
import categoryIcons from "../../../utils/categoryIcons";

// SubComponent ( Categories ).
function CategoriesLinkButton({ category: { value, text } }) {
  return (
    <NavLink to={`/categories/${value}`}>
      <Button
        size={"lg"}
        variant={"ghost"}
        w={"100%"}
        justifyContent={"start"}
        borderRadius={0}
      >
        <HStack px={"2"} spacing={"4"} fontSize={"lg"} fontWeight={"medium"}>
          <Icon fontSize={"2xl"}>{categoryIcons[value] || <FaHashtag />}</Icon>
          <Text>{text}</Text>
        </HStack>
      </Button>
    </NavLink>
  );
}

export default CategoriesLinkButton;
