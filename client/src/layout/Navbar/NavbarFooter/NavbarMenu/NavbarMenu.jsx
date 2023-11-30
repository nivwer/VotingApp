// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import {
  Avatar,
  Box,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";

// Component.
function NavbarMenu({ children, profile, user }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu initialFocusRef>
      <MenuButton
        as={IconButton}
        aria-label={"Options"}
        borderRadius={"full"}
        variant={"unstyled"}
      >
        <Avatar
          bg={profile.profile_picture ? "transparent" : "gray.400"}
          size="md"
          h={"40px"}
          w={"40px"}
          src={profile.profile_picture}
        />
      </MenuButton>
      <MenuList
        bg={isDark ? "black" : "white"}
        zIndex={1600}
        borderRadius={"2xl"}
        border={"1px solid"}
        borderColor={"gothicPurpleAlpha.300"}
        py={4}
        boxShadow={"2xl"}
      >
        <Box px={5} py={2}>
          <HStack spacing={3}>
            <Avatar
              bg={profile.profile_picture ? "transparent" : "gray.400"}
              size="md"
              h={"44px"}
              w={"44px"}
              src={profile.profile_picture}
            />
            <Stack spacing={0}>
              <Text h={5} mb={"1px"} fontWeight={"bold"}>
                {profile.profile_name}
              </Text>
              <Text opacity={"0.5"} fontWeight={"medium"}>
                @{user.username}
              </Text>
            </Stack>
          </HStack>
        </Box>
        <Divider my={2} bg={"gothicPurpleAlpha.50"} />
        <Box>{children}</Box>
      </MenuList>
    </Menu>
  );
}

export default NavbarMenu;
