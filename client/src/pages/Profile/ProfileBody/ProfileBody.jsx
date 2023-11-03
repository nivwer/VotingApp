// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
// Components.
import { Box, Flex, Grid } from "@chakra-ui/react";
// SubComponents.
import ProfileTabButton from "./ProfileTabButton/ProfileTabButton";
import ProfileUserPolls from "./ProfileUserPolls/ProfileUserPolls";
import ProfileVotedPolls from "./ProfileVotedPolls/ProfileVotedPolls";
import ProfileSharedPolls from "./ProfileSharedPolls/ProfileSharedPolls";
import ProfileBookmarkedPolls from "./ProfileBookmarkedPolls/ProfileBookmarkedPolls";

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
        bg={isDark ? "black" : "white"}
        zIndex={1000}
        pos={"sticky"}
        top={"64px"}
      >
        <Grid
          templateColumns={
            user.username == username ? "repeat(4, 1fr)" : "repeat(3, 1fr)"
          }
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
          borderBottom={"1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
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
