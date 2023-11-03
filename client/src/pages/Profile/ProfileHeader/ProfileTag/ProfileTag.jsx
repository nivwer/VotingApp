// Components.
import { HStack, Text } from "@chakra-ui/react";

// SubComponent ( ProfileHeader ).
function ProfileTag({ children, icon = null }) {
  return (
    <HStack spacing={5}>
      <HStack spacing={1} fontSize={"md"} opacity={0.6}>
        {icon}
        <Text
          fontWeight={"medium"}
          display={"flex"}
          h={"100%"}
          mt={"4px"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {children}
        </Text>
      </HStack>
    </HStack>
  );
}

export default ProfileTag;
