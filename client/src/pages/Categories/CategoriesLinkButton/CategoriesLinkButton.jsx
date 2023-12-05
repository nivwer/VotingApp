import { NavLink } from "react-router-dom";
import { HStack, Icon, Text } from "@chakra-ui/react";
import { FaHashtag } from "react-icons/fa6";
import categoryIcons from "../../../utils/icons/categoryIcons";
import CustomButton from "../../../components/Buttons/CustomButton/CustomButton";

function CategoriesLinkButton({ category: { value, text } }) {
  return (
    <NavLink to={`/categories/${value}`}>
      <CustomButton size="lg" variant="ghost" w="100%" justifyContent="start" borderRadius={0}>
        <HStack px={"2"} spacing={"4"} fontSize={"lg"} fontWeight={"medium"}>
          <Icon children={categoryIcons[value] || <FaHashtag />} fontSize={"2xl"} />
          <Text children={text} />
        </HStack>
      </CustomButton>
    </NavLink>
  );
}

export default CategoriesLinkButton;
