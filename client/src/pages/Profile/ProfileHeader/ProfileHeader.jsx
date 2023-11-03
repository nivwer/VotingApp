// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// SubComponents.
import ProfileLink from "./ProfileLink/ProfileLink";
import ProfileTag from "./ProfileTag/ProfileTag";
// Icons.
import { FaRegCalendar, FaLocationDot, FaLink } from "react-icons/fa6";
// Others.
import { format } from "date-fns";

// SubComponent ( Profile ).
function ProfileHeader({ profile }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, user } = useSelector((state) => state.session);

  // Joined date.
  const dateJoined = format(
    new Date(profile && profile.date_joined),
    "MMMM yyyy"
  );

  return (
    <>
      <Flex spacing="2" flex="1" dir="column" wrap="wrap" align="start">
        <Flex justify="space-between" w="100%" p={5} px={3}>
          {/* Avatar. */}
          <Avatar bg={"gray.400"} size="2xl" src={profile.profile_picture} />
          {/* Button to edit the profile. */}
          {isAuthenticated && user.username === profile.username && (
            <NavLink to={`/settings/profile`}>
              <Button variant={"outline"} size={"sm"} borderRadius={"full"}>
                Edit profile
              </Button>
            </NavLink>
          )}
        </Flex>

        <Stack spacing={4}>
          <Box>
            <HStack spacing={2}>
              {/* Profile name. */}
              <Heading opacity={isDark ? 1 : 0.9} size="md">
                {profile.profile_name}
              </Heading>
              {/* Pronouns. */}
              <Text opacity={0.5} fontWeight="medium">
                {profile.pronouns}
              </Text>
            </HStack>
            {/* Username. */}
            <Text opacity={0.5} fontWeight="medium">
              @{profile.username}
            </Text>
          </Box>
          <Stack spacing={2}>
            {/* Biography. */}
            {profile.bio && (
              <Text opacity={0.9} fontWeight="medium">
                {profile.bio}
              </Text>
            )}

            {/* Links. */}
            <Stack
              color={isDark ? `${ThemeColor}.100` : `${ThemeColor}.600`}
              opacity={ThemeColor === "default" ? 0.6 : 0.8}
              spacing={0}
              fontSize={"md"}
            >
              {/* Website Link. */}
              {profile.website_link && (
                <HStack spacing={1} fontWeight={"semibold"}>
                  <Box
                    color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
                    opacity={ThemeColor === "default" ? 1 : 0.8}
                  >
                    <FaLink />
                  </Box>
                  <ProfileLink link={profile.website_link} />
                </HStack>
              )}
              {/* Social Links. */}
              {(profile.social_link_one ||
                profile.social_link_two ||
                profile.social_link_three) && (
                <HStack spacing={2}>
                  <ProfileLink link={profile.social_link_one} />
                  <ProfileLink link={profile.social_link_two} />
                  <ProfileLink link={profile.social_link_three} />
                </HStack>
              )}
            </Stack>

            {/* Tags. */}
            <HStack spacing={5}>
              {/* Joined date. */}
              <ProfileTag icon={<FaRegCalendar />}>
                Joined {dateJoined}
              </ProfileTag>
              {/* Location. */}
              {profile.country && (
                <ProfileTag icon={<FaLocationDot />}>
                  {profile.country}
                  {profile.city && ` (${profile.city})`}
                </ProfileTag>
              )}
            </HStack>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}

export default ProfileHeader;
