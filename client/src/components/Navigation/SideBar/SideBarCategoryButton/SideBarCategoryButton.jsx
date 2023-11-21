// Components.
import { Button, HStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Utils.
import categoryIcons from "../../../../utils/categoryIcons";

// SubComponent ( SideBar ).
function SideBarCategoryButton({ category }) {
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

export default SideBarCategoryButton;
