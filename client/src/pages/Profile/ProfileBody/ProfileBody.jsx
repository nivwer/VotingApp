// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
// Components.
import { Box, Flex, Grid, HStack } from "@chakra-ui/react";
// SubComponents.
import ProfileTabButton from "./ProfileTabButton/ProfileTabButton";
import ProfileUserPolls from "./ProfileTabs/ProfileUserPolls/ProfileUserPolls";
import ProfileVotedPolls from "./ProfileTabs/ProfileVotedPolls/ProfileVotedPolls";
import ProfileSharedPolls from "./ProfileTabs/ProfileSharedPolls/ProfileSharedPolls";
import ProfileBookmarkedPolls from "./ProfileTabs/ProfileBookmarkedPolls/ProfileBookmarkedPolls";

// SubComponent ( Profile ).
function ProfileBody({ profile, username, isLoading }) {
  const { isDark } = useThemeInfo();
  const { user } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "";

  return (
    <>
      {/* Profile Tabs. */}
      <Box
        zIndex={1200}
        pos={"sticky"}
        top={"64px"}
        w={"100%"}
        bg={isDark ? "black" : "white"}
        borderBottom={"3px solid"}
        borderRadius={"3px"}
        borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
        pt={6}
        mb={4}
      >
        <Grid
          templateColumns={
            user.username == username ? "repeat(4, 1fr)" : "repeat(3, 1fr)"
          }
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
        >
          <ProfileTabButton tab={tab} username={username}>
            Polls
          </ProfileTabButton>
          <ProfileTabButton tab={tab} value={"votes"} username={username}>
            Votes
          </ProfileTabButton>
          <ProfileTabButton tab={tab} value={"shares"} username={username}>
            Shares
          </ProfileTabButton>
          {user.username == username && (
            <ProfileTabButton tab={tab} value={"bookmarks"} username={username}>
              Bookmarks
            </ProfileTabButton>
          )}
        </Grid>
      </Box>
      {/* Profile Polls View. */}
      {!isLoading && (
        <Flex>
          {!tab && <ProfileUserPolls id={profile && profile.id} />}
          {tab === "votes" && <ProfileVotedPolls id={profile && profile.id} />}
          {tab === "shares" && (
            <ProfileSharedPolls id={profile && profile.id} />
          )}
          {tab === "bookmarks" && (
            <ProfileBookmarkedPolls id={profile && profile.id} />
          )}
        </Flex>
      )}
    </>
  );
}

export default ProfileBody;
