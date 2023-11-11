// Hooks.
import { useEffect, useState } from "react";
import { useSearchPollsQuery } from "../../../api/pollApiSlice";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Components.
import UserCard from "../../../components/Cards/UserCard/UserCard";
import CustomSpinner from "../../../components/Spinners/CustomSpinner/CustomSpinner";
import { Box, Center, Stack, Text } from "@chakra-ui/react";
// Icons.
import { FaRegFaceFrown, FaRegFaceMehBlank } from "react-icons/fa6";
import { useThemeInfo } from "../../../hooks/Theme";
import PollCard from "../../../components/Cards/PollCard/PollCard";

// SubComponent ( Results ).
function PollsResults() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";

  const [data, setData] = useState(false);
  const [page, setPage] = useState(1);
  const [polls, setPolls] = useState([]);
  const [message, setMessage] = useState(false);

  const {
    data: dataPolls,
    isLoading,
    isFetching,
  } = useSearchPollsQuery(data, {
    skip: data ? false : true,
  });

  // Reset values.
  useEffect(() => {
    setPage(1);
    setPolls([]);
    setMessage(false);
  }, [query, type]);

  // Update data to fetchs.
  useEffect(() => {
    if (isAuthenticated) {
      setData({
        headers: { Authorization: `Token ${token}` },
        query: query,
        page: page,
      });
    } else {
      setData({ query: query, page: page });
    }
  }, [query, page, isAuthenticated]);

  // Scroll event.
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 30 &&
      !isFetching &&
      dataPolls &&
      dataPolls.paginator.has_next
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dataPolls, isFetching]);

  // Add the users in the polls state.
  useEffect(() => {
    if (dataPolls) {
      dataPolls.polls && setPolls([...polls, ...dataPolls.polls]);
      dataPolls.message && setMessage(true);
      !dataPolls.paginator.has_next && setMessage(true);
    }
  }, [dataPolls]);

  // Load more items.
  useEffect(() => {
    if (
      document.getElementById("container").clientHeight < window.innerHeight &&
      !isFetching &&
      !isLoading &&
      dataPolls &&
      dataPolls.paginator.has_next
    ) {
      setPage(page + 1);
    }
  }, [polls]);

  return (
    <Box
      id="container"
      w={"100%"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
    >
      {polls &&
        polls.map((poll, index) => <PollCard key={index} poll={poll} />)}

      <Box h={"100px"} w={"100%"}>
        {!polls || !message ? (
          <CustomSpinner
            opacity={
              window.innerHeight + window.scrollY <=
                document.body.scrollHeight - 30 ||
              isLoading ||
              isFetching ||
              !polls
                ? 0.7
                : 0
            }
          />
        ) : (
          <Center opacity={isDark ? 0.7 : 0.5} w={"100%"} h={"100%"}>
            <Stack>
              <Text fontWeight={"semibold"}>
                {dataPolls && dataPolls.message
                  ? dataPolls.message
                  : "No more results"}
              </Text>
              <Center fontSize={"3xl"}>
                <Box>
                  {dataPolls && dataPolls.message ? (
                    <FaRegFaceFrown />
                  ) : (
                    <FaRegFaceMehBlank />
                  )}
                </Box>
              </Center>
            </Stack>
          </Center>
        )}
      </Box>
    </Box>
  );
}

export default PollsResults;
