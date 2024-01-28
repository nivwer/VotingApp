import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import { Avatar, Box, Button, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import ProfileLink from "./ProfileLink/ProfileLink";
import ProfileTag from "./ProfileTag/ProfileTag";
import { FaRegCalendar, FaLocationDot, FaLink } from "react-icons/fa6";
import { format } from "date-fns";

function ProfileHeader({ profile }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, user } = useSelector((state) => state.session);
  const dateJoined = format(new Date(profile && profile.date_joined), "MMMM yyyy");

  return (
    <Flex spacing="2" flex="1" dir="column" wrap="wrap" align="start">
      <Flex justify="space-between" w="100%" pb={5} px={2}>
        <Box mt={2}>
          <Avatar
            bg={profile.profile_picture ? "transparent" : "gray.400"}
            src={profile.profile_picture}
            size="2xl"
          />
        </Box>
        <Box>
          {isAuthenticated && user.username === profile.username && (
            <NavLink to={`/settings/profile`}>
              <Button variant={"link"} size={"sm"} borderRadius={"full"}>
                <Text
                  children={"Edit profile"}
                  mt="1px"
                  fontWeight="extrabold"
                  opacity={0.9}
                  color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
                />
              </Button>
            </NavLink>
          )}
        </Box>
      </Flex>

      <Stack w={"100%"} spacing={3}>
        <Stack spacing={0} fontSize={"md"} fontWeight={"medium"}>
          <HStack spacing={2} my={"2px"}>
            <Text children={profile.name} h={6} opacity={0.9} fontSize="lg" fontWeight="black" />
            <Text children={profile.pronouns} h={5} opacity={0.5} />
          </HStack>
          <Text children={`@${profile.username}`} opacity={0.5} />
        </Stack>
        <Stack spacing={3}>
          <Stack spacing={0}>
            {profile.bio && <Text children={profile.bio} opacity={0.8} fontWeight="medium" />}

            {/* Tags. */}
            <HStack spacing={0} wrap={"wrap"}>
              <ProfileTag children={`Joined ${dateJoined}`} icon={<FaRegCalendar />} />
              {profile.country && (
                <ProfileTag icon={<FaLocationDot />}>
                  {profile.country}
                  {profile.city && ` (${profile.city})`}
                </ProfileTag>
              )}
            </HStack>
          </Stack>

          {/* Links. */}
          <Stack
            color={isDark ? `${ThemeColor}.100` : `${ThemeColor}.600`}
            opacity={0.8}
            spacing={0}
            fontSize={"md"}
          >
            {/* Website Link. */}
            {profile.website_link && (
              <HStack spacing={1} fontWeight={"semibold"}>
                <Box color={isDark ? "whiteAlpha.900" : "blackAlpha.900"} opacity={0.8}>
                  <FaLink />
                </Box>
                <ProfileLink link={profile.website_link} website={true} />
              </HStack>
            )}
            {/* Social Links. */}
            {(profile.social_link_one || profile.social_link_two || profile.social_link_three) && (
              <Box>
                <HStack spacing={0} align={"center"} wrap={"wrap"}>
                  <ProfileLink link={profile.social_link_one} />
                  <ProfileLink link={profile.social_link_two} />
                  <ProfileLink link={profile.social_link_three} />
                </HStack>
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default ProfileHeader;
