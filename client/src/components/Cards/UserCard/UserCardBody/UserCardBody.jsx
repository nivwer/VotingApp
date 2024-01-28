import { NavLink } from "react-router-dom";
import { Button, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { useThemeInfo } from "../../../../hooks/Theme";

function UserCardBody({ user, hasBio }) {
  const { isDark } = useThemeInfo();
  return (
    <>
      <HStack justify={"space-between"}>
        <Stack fontSize={"md"} spacing={0}>
          <NavLink to={`/${user.username}`}>
            <Text children={user.name} h={5} fontWeight={"extrabold"} opacity={0.9} />
          </NavLink>
          <NavLink to={`/${user.username}`}>
            <Text children={`@${user.username}`} h={5} fontWeight={"medium"} opacity={0.5} />
          </NavLink>
        </Stack>
        <NavLink to={`/${user.username}`}>
          <Button variant={"link"} size={"sm"} borderRadius={"full"}>
            <Text
              children={"Profile"}
              mx={3}
              fontWeight={"extrabold"}
              opacity={0.9}
              color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
            />
          </Button>
        </NavLink>
      </HStack>
      {user.bio && hasBio && (
        <Flex px={0} mt={2} fontSize={"md"} opacity={0.8}>
          <Text children={user.bio} w={"auto"} fontWeight={"medium"} wordBreak={"break-word"} />
        </Flex>
      )}
    </>
  );
}

export default UserCardBody;
