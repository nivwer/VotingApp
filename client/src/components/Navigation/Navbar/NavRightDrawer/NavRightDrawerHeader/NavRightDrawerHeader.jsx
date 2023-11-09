// Hooks.
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../../../hooks/Theme";
// Components.
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";

// SubComponent ( NavRightDrawer ).
function NavRightDrawerHeader() {
  const { isDark } = useThemeInfo();
  const { user, profile } = useSelector((state) => state.session);
  return (
    <Flex>
      {/* User Avatar. */}
      <Avatar
        bg={"gray.400"}
        size="md"
        h={"45px"}
        w={"45px"}
        src={profile.profile_picture}
      />
      <Box color={isDark ? "whiteAlpha.900" : "blackAlpha.900"} ml={3}>
        {/* Profile name. */}
        <Heading h={5} opacity={isDark ? 0.9 : 0.8} pt={1} fontSize="md">
          {profile.profile_name}
        </Heading>
        {/* Username. */}
        <Text h={5} opacity={0.5} fontWeight="medium" fontSize="sm">
          @{user.username}
        </Text>
      </Box>
    </Flex>
  );
}

export default NavRightDrawerHeader;
