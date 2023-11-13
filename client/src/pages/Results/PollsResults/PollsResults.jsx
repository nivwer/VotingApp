// Hooks.
import { useEffect, useState } from "react";
import { useSearchPollsQuery } from "../../../api/pollApiSlice";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { InView, useInView } from "react-intersection-observer";
// Components.
import CustomSpinner from "../../../components/Spinners/CustomSpinner/CustomSpinner";
import { Box, Center, Stack, Text } from "@chakra-ui/react";
// Icons.
import { FaRegFaceFrown, FaRegFaceMehBlank } from "react-icons/fa6";
import { useThemeInfo } from "../../../hooks/Theme";
import PollCard from "../../../components/Cards/PollCard/PollCard";

// SubComponent ( Results ).
function PollsResults() {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [initialRender, setInitialRender] = useState(false);

  // Params.
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";
  const [dataQuery, setDataQuery] = useState(false);

  // Pages data.
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [message, setMessage] = useState(false);

  const defaultPaginatorValues = {
    total_items: 0,
    total_pages: 0,
    has_previous: false,
    has_next: false,
  };
  const [paginator, setPaginator] = useState(defaultPaginatorValues);

  // Refresh items.
  const [refreshItems, setRefreshItems] = useState(false);

  // Active pages.
  const {
    data: lastPage,
    isLoading: isLastPageLoading,
    isFetching: isLastPageFetching,
    status: statusLastPage,
  } = useSearchPollsQuery(
    { ...dataQuery, page: page - 1 },
    { skip: dataQuery && paginator.has_previous ? false : true }
  );

  const {
    data: currentPage,
    isLoading: isCurrentPageloading,
    isFetching: isCurrentPageFetching,
    status: statusCurrentPage,
  } = useSearchPollsQuery(
    { ...dataQuery, page: page },
    { skip: dataQuery ? false : true }
  );

  const {
    data: nextPage,
    isLoading: isNextPageLoading,
    isFetching: isNextPageFetching,
    status: statusNextPage,
  } = useSearchPollsQuery(
    { ...dataQuery, page: page + 1 },
    { skip: dataQuery && paginator.has_next ? false : true }
  );

  // Reset values.
  useEffect(() => {
    setPage(1);
    setPages([]);
    setMessage(false);
    setPaginator(defaultPaginatorValues);
    setInitialRender(false);
  }, [query, type]);

  // Update data to fetchs.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataQuery({ ...headers, query: query, page_size: 2 });
  }, [query, isAuthenticated]);

  // useEffect(() => {
  //   if (inView) {
  //     // Cambiar la página solo si el usuario está desplazándose hacia arriba
  //     if (inView >= 0 && inView <= 1) {
  //       setPage((prevPage) => prevPage - 1);
  //     } else {
  //       setPage((prevPage) => prevPage + 1);
  //     }
  //   }
  // }, [inView]);

  useEffect(() => {
    if (currentPage && currentPage.paginator != paginator) {
      setPaginator(currentPage.paginator);
    }
  }, [currentPage]);

  useEffect(() => {
    if (
      dataQuery &&
      !isLastPageLoading &&
      !isCurrentPageloading &&
      !isNextPageLoading &&
      !isLastPageFetching &&
      !isCurrentPageFetching &&
      !isNextPageFetching
    ) {
      setRefreshItems(true);
    }
  }, [page, statusLastPage, statusCurrentPage, statusNextPage]);

  // Add the pages in the pages state.
  useEffect(() => {
    if (refreshItems) {
      if (
        (lastPage || !currentPage.paginator.has_previous) &&
        currentPage &&
        (nextPage || !currentPage.paginator.has_next)
      ) {
        setPages((prevPages) => {
          // If Current page has previous page.
          if (
            currentPage.paginator.has_previous &&
            lastPage.paginator.page === page - 1
          ) {
            prevPages[page - 2] = lastPage.items;
          }

          // Current page.
          if (currentPage.paginator.page === page) {
            prevPages[page - 1] = currentPage.items;
          }

          // If Current page has next page.
          if (
            currentPage.paginator.has_next &&
            nextPage.paginator.page === page + 1
          ) {
            prevPages[page] = nextPage.items;
          }

          return prevPages;
        });
      }
      setRefreshItems(false);
    }
  }, [refreshItems]);

  useEffect(() => {
    console.log(paginator);
  }, [paginator]);

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <Box
      id="container"
      w={"100%"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
    >
      {pages &&
        pages.map((page, indexPage) => (
          <InView
            rootMargin={"-50% 0px -50% 0px"}
            key={indexPage}
            onChange={(inView, entry) => {
              if (inView && indexPage + 1 !== page) {
                if (initialRender) {
                  setPaginator({
                    ...paginator,
                    has_next: false,
                    has_previous: false,
                  });
                } else {
                  setInitialRender(true);
                }
                setPage(indexPage + 1);
              }
            }}
          >
            {({ inView, ref, entry }) => (
              <Box w={"100%"} ref={ref}>
                {page.map((poll, index) => (
                  <PollCard key={index} poll={poll} />
                ))}
              </Box>
            )}
          </InView>
        ))}

      {/* <InView onChange={(inView, entry) => console.log("Inview: 1")}>
        {({ inView, ref, entry }) => (
          <Box h={"1000px"}>
            <div ref={ref}>
              <h2>{`Header 1 inside viewport ${inView}.`}</h2>
            </div>
          </Box>
        )}
      </InView>

      <InView onChange={(inView, entry) => console.log("Inview: 2")}>
        {({ inView, ref, entry }) => (
          <Box h={"1000px"}>
            <div ref={ref}>
              <h2>{`Header 2 inside viewport ${inView}.`}</h2>
            </div>
          </Box>
        )}
      </InView> */}
    </Box>
  );
}

export default PollsResults;
