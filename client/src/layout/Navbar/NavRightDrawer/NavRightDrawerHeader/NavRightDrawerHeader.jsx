// Hooks.
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Avatar, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

// SubComponent ( NavRightDrawer ).
function NavRightDrawerHeader() {
  const { isDark } = useThemeInfo();
  const { user, profile } = useSelector((state) => state.session);
  return (
    <Flex pl={1}>
      {/* User Avatar. */}
      <Avatar
        bg={"gray.400"}
        size="md"
        h={"42px"}
        w={"42px"}
        src={profile.profile_picture}
      />
      <Box color={isDark ? "whiteAlpha.900" : "blackAlpha.900"} ml={3}>
        {/* Profile name. */}
        <Text
          h={5}
          opacity={isDark ? 0.9 : 0.8}
          pt={"3px"}
          fontSize="sm"
          fontWeight={"black"}
        >
          {profile.profile_name}
        </Text>
        {/* Username. */}
        <Text h={5} pt={"1px"} opacity={0.5} fontWeight="medium" fontSize="sm">
          @{user.username}
        </Text>
      </Box>
    </Flex>
  );
}

export default NavRightDrawerHeader;
