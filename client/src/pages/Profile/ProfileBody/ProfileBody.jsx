import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

import {
  useGetUserPollsQuery,
  useGetUserVotedPollsQuery,
  useGetUserSharedPollsQuery,
  useGetUserBookmarkedPollsQuery,
} from "../../../api/pollsAPISlice";
import TabButtonsGroup from "../../../components/TabButtonsGroup/TabButtonsGroup";
import TabButtonItem from "../../../components/TabButtonsGroup/TabButtonItem/TabButtonItem";
import PollList from "../../../components/PollList/PollList";

function ProfileBody({ profile, username, isLoading }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, csrftoken } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState({});
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "";
  const [tab, setTab] = useState(tabParam);

  useEffect(() => (tabParam ? setTab(tabParam) : setTab("polls")), [tabParam]);

  useEffect(() => {
    navigate(tab !== "polls" ? `/${username}?tab=${tab}` : `/${username}`);
  }, [tab]);

  useEffect(() => {
    if (profile) {
      const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
      setDataQuery({ ...headers, id: profile.id });
    }
  }, [profile, isAuthenticated]);

  return (
    <>
      {/* Profile Tabs. */}
      <Box zIndex={1200} pos={"sticky"} top={{ base: "60px", md: "80px" }}>
        <TabButtonsGroup
          columns={user && user.username == username ? 4 : 3}
          mt={{ base: 6, lg: 0 }}
        >
          <TabButtonItem children={"Polls"} tab={tab} value={"polls"} setValue={setTab} />
          <TabButtonItem children={"Votes"} tab={tab} value={"votes"} setValue={setTab} />
          <TabButtonItem children={"Shares"} tab={tab} value={"shares"} setValue={setTab} />
          {user && user.username == username && (
            <TabButtonItem children={"Bookmarks"} tab={tab} value={"bookmarks"} setValue={setTab} />
          )}
        </TabButtonsGroup>
      </Box>

      {!isLoading && (
        <Flex>
          {tab === "polls" && <PollList useQuery={useGetUserPollsQuery} data={dataQuery} />}
          {tab === "votes" && <PollList useQuery={useGetUserVotedPollsQuery} data={dataQuery} />}
          {tab === "shares" && <PollList useQuery={useGetUserSharedPollsQuery} data={dataQuery} />}
          {tab === "bookmarks" && (
            <PollList useQuery={useGetUserBookmarkedPollsQuery} data={dataQuery} />
          )}
        </Flex>
      )}
    </>
  );
}

export default ProfileBody;
