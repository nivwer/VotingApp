// Components.
import { Button, HStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Icons.
import { FaHashtag } from "react-icons/fa6";
// Utils.
import categoryIcons from "../../../utils/icons/categoryIcons";

// SubComponent ( SideBar ).
function SidebarCategoryButton({ category }) {
  return (
    <NavLink to={`/categories/${category.value}`}>
      <Button variant={"ghost"} justifyContent={"start"} w={"100%"} size={"md"}>
        <HStack spacing={4}>
          <Text>{categoryIcons[category.value] || <FaHashtag />}</Text>
          <Text>{category.text}</Text>
        </HStack>
      </Button>
    </NavLink>
  );
}

export default SidebarCategoryButton;
