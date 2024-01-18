import { HStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaHashtag } from "react-icons/fa6";

import categoryIcons from "../../../../utils/icons/categoryIcons";
import CustomButton from "../../../../components/Buttons/CustomButton/CustomButton";

function SidebarCategoryButton({ category }) {
  return (
    <NavLink to={`/categories/${category.value}`}>
      <CustomButton variant={"ghost"} justifyContent={"start"} w={"100%"} size={"md"}>
        <HStack spacing={4}>
          <Text children={categoryIcons[category.value] || <FaHashtag />} />
          <Text children={category.text} />
        </HStack>
      </CustomButton>
    </NavLink>
  );
}

export default SidebarCategoryButton;
