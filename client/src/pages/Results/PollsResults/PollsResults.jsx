// Hooks.
import { useEffect, useState } from "react";
import { useSearchPollsQuery } from "../../../api/pollApiSlice";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Components.
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

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState([]);

  const [message, setMessage] = useState(false);

  const [dataQuery, setDataQuery] = useState(false);

  // const {
  //   data: dataPolls,
  //   isLoading,
  //   isFetching,
  // } = useSearchPollsQuery(data, {
  //   skip: data ? false : true,
  // });

  // NEW infinite scroll

  const { data: lastPage } = useSearchPollsQuery(
    { ...dataQuery, page: page - 1 },
    { skip: dataQuery && page > 1 ? false : true }
  );
  const { data: currentPage } = useSearchPollsQuery(
    { ...dataQuery, page: page },
    { skip: dataQuery ? false : true }
  );
  const { data: nextPage } = useSearchPollsQuery(
    { ...dataQuery, page: page + 1 },
    { skip: dataQuery ? false : true }
  );

  // NEW infinite scroll

  // Reset values.
  useEffect(() => {
    setPage(1);
    setPages([]);
    setMessage(false);
  }, [query, type]);

  // NEW infinite scroll

  // Update data to fetchs.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataQuery({ ...headers, query: query });
  }, [query, isAuthenticated]);

  // NEW infinite scroll

  // Scroll event.
  // const handleScroll = () => {
  //   if (
  //     window.innerHeight + window.scrollY >= document.body.scrollHeight - 30 &&
  //     !isFetching &&
  //     dataPolls &&
  //     dataPolls.paginator.has_next
  //   ) {
  //     setPage(page + 1);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [dataPolls, isFetching]);

  // Add the pages in the pages state.
  useEffect(() => {
    if ((lastPage || page <= 1) && currentPage && nextPage) {
      setPages((prevPages) => {
        if (page > 1) {
          prevPages[page - 2] = lastPage.items;
        }
        prevPages[page - 1] = currentPage.items;
        prevPages[page] = nextPage.items;

        return prevPages;
      });
    }
  }, [page, lastPage, currentPage, nextPage]);

  // Load more items.
  // useEffect(() => {
  //   if (
  //     document.getElementById("container").clientHeight < window.innerHeight &&
  //     !isFetching &&
  //     !isLoading &&
  //     dataPolls &&
  //     dataPolls.paginator.has_next
  //   ) {
  //     setPage(page + 1);
  //   }
  // }, [polls]);

  return (
    <Box
      id="container"
      w={"100%"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
    >
      {pages &&
        pages.map((page) =>
          page.map((poll, index) => <PollCard key={`${page}-${index}`} poll={poll} />)
        )}

      {/* {pages &&
        pages[1] &&
        pages[1].map((poll, index) => <PollCard key={index} poll={poll} />)} */}

      {/* <Box h={"100px"} w={"100%"}>
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
      </Box> */}
    </Box>
  );
}

export default PollsResults;
