// Components.
import { HStack, Text } from "@chakra-ui/react";

// SubComponent ( ProfileHeader ).
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
        >
          {children}
        </Text>
      </HStack>
    </HStack>
  );
}

export default ProfileTag;
