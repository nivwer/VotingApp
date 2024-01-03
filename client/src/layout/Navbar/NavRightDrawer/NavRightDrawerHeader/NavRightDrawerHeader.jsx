import { useSelector } from "react-redux";
import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";

function NavRightDrawerHeader() {
  const { user, profile } = useSelector((state) => state.session);
  return (
    <HStack spacing={3} ml={5} mt={1}>
      <Avatar
        bg={profile.profile_picture ? "transparent" : "gray.400"}
        size="md"
        h={"44px"}
        w={"44px"}
        src={profile.profile_picture}
      />
      <Stack spacing={0} fontSize={"md"} mt={"2px"}>
        <Text children={profile.name} h={5} mb={"1px"} fontWeight={"bold"} />
        <Text children={`@${user.username}`} opacity={"0.5"} fontWeight={"medium"} />
      </Stack>
    </HStack>
  );
}

export default NavRightDrawerHeader;
