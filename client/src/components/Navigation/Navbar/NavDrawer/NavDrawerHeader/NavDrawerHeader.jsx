// Hooks.
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../../../hooks/Theme";
// Components.
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";

// SubComponent ( NavDrawer ).
function NavDrawerHeader() {
  const { isDark } = useThemeInfo();
  const { user, profile } = useSelector((state) => state.session);
  return (
    <Flex>
      {/* User Avatar. */}
      <Avatar bg={"gray.400"} size="md" src={profile.profile_picture} />
      <Box color={isDark ? "whiteAlpha.900" : "blackAlpha.900"} ml="4">
        {/* Profile name. */}
        <Heading opacity={isDark ? 0.9 : 0.8} pt={"5px"} fontSize="md">
          {profile.profile_name}
        </Heading>
        {/* Username. */}
        <Text opacity={0.5} fontWeight="medium" fontSize="sm">
          @{user.username}
        </Text>
      </Box>
    </Flex>
  );
}

export default NavDrawerHeader;
