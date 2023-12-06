import CustomButton from "../../../../../components/Buttons/CustomButton/CustomButton";
import { HStack, Text } from "@chakra-ui/react";

function NavRightDrawerButton({ children, icon = null, onClick }) {
  return (
    <CustomButton
      onClick={onClick}
      variant={"ghost"}
      w="100%"
      justifyContent="start"
      borderRadius={0}
    >
      <HStack spacing={2} opacity={0.9}>
        {icon}
        <Text
          fontWeight={"bold"}
          display={"flex"}
          h={"100%"}
          mt={"2px"}
          justifyContent={"center"}
          alignItems={"center"}
          children={children}
        />
      </HStack>
    </CustomButton>
  );
}

export default NavRightDrawerButton;
