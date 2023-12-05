import { HStack, Text } from "@chakra-ui/react";

function ProfileTag({ children, icon = null }) {
  return (
    <HStack spacing={5}>
      <HStack spacing={1} fontSize={"md"} opacity={0.5}>
        {icon}
        <Text
          fontWeight={"medium"}
          display={"flex"}
          h={5}
          mt={"4px"}
          mr={4}
          justifyContent={"center"}
          alignItems={"center"}
          wordBreak={"inherit"}
          children={children}
        />
      </HStack>
    </HStack>
  );
}

export default ProfileTag;
