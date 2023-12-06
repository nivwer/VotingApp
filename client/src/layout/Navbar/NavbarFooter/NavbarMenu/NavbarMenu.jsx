import { useThemeInfo } from "../../../../hooks/Theme";
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

function NavbarMenu({ children, profile, user, ...props }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu initialFocusRef placement="bottom-end">
      <MenuButton as={IconButton} aria-label={"Options"} variant={"unstyled"} {...props}>
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
        w={"100%"}
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
              <Text children={profile.profile_name} h={5} mb={"1px"} fontWeight={"bold"} />
              <Text children={`@${user.username}`} opacity={"0.5"} fontWeight={"medium"} />
            </Stack>
          </HStack>
        </Box>
        <Divider my={2} bg={"gothicPurpleAlpha.50"} />
        <Box children={children} />
      </MenuList>
    </Menu>
  );
}

export default NavbarMenu;
