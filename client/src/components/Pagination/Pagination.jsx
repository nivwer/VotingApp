// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../hooks/Theme";
// Components.
import { Box, Center, Stack, Text } from "@chakra-ui/react";
// Icons.
import {
  FaRegFaceFrown,
  FaRegFaceMehBlank,
  FaCircleExclamation,
} from "react-icons/fa6";
// Others.
import { InView } from "react-intersection-observer";
import CustomSpinner from "../Spinners/CustomSpinner/CustomSpinner";

// Component.
function Pagination({ Card, usePageQuery, dataQuery, reset }) {
  const { isDark } = useThemeInfo();
  const [initialRender, setInitialRender] = useState(false);
  const { resetValues } = reset;
  // Pages data.
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  // Message.
  const [message, setMesagge] = useState({ message: "", icon: null });
  // Paginator data.
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  // Refresh items.
  const [refreshItems, setRefreshItems] = useState(false);

  // Active pages.
  const {
    data: lastPage,
    isLoading: isLastPageLoading,
    isFetching: isLastPageFetching,
    status: statusLastPage,
  } = usePageQuery(
    { ...dataQuery, page: page - 1 },
    { skip: dataQuery && hasPrevious && page > 1 ? false : true }
  );

  const {
    data: currentPage,
    error,
    isLoading: isCurrentPageloading,
    isFetching: isCurrentPageFetching,
    status: statusCurrentPage,
  } = usePageQuery(
    { ...dataQuery, page: page },
    { skip: dataQuery ? false : true }
  );

  const {
    data: nextPage,
    isLoading: isNextPageLoading,
    isFetching: isNextPageFetching,
    status: statusNextPage,
  } = usePageQuery(
    { ...dataQuery, page: page + 1 },
    { skip: dataQuery && hasNext && page < totalPages ? false : true }
  );

  // Reset values.
  useEffect(() => {
    if (resetValues) {
      setPages([]);
      setInitialRender(false);
      setTotalItems(0);
      setTotalPages(1);
      setHasPrevious(false);
      setHasNext(false);
      setMesagge({ message: "", icon: null });
      setPage(1);
    }
  }, [resetValues]);

  // Update paginator values.
  useEffect(() => {
    if (!resetValues) {
      if (currentPage) {
        currentPage.paginator.total_items != totalItems &&
          setTotalItems(currentPage.paginator.total_items);

        currentPage.paginator.total_pages != totalPages &&
          setTotalPages(currentPage.paginator.total_pages);

        currentPage.paginator.has_previous != hasPrevious &&
          setHasPrevious(currentPage.paginator.has_previous);

        currentPage.paginator.has_next != hasNext &&
          setHasNext(currentPage.paginator.has_next);
      }
    }
  }, [currentPage]);

  // Activate the refresh pages in the pages state.
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
  }, [page, statusLastPage, statusCurrentPage, statusNextPage, dataQuery]);

  // Add the pages in the pages state.
  useEffect(() => {
    if (refreshItems) {
      if (currentPage) {
        if (
          (lastPage || !currentPage.paginator.has_previous) &&
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
            if (currentPage.items && currentPage.paginator.page === page) {
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

        if (!currentPage.has_next && currentPage.message) {
          setMesagge({
            message: currentPage.message,
            icon: <FaRegFaceMehBlank />,
          });
        }
      }

      if (error) {
        {
          setMesagge({
            message: error.data.message,
            icon:
              error.status === 404 ? (
                <FaRegFaceFrown />
              ) : (
                <FaCircleExclamation />
              ),
          });
        }
      }

      setRefreshItems(false);
    }
  }, [refreshItems]);

  return (
    <Box
      id="container"
      w={"100%"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
    >
      {pages &&
        totalItems > 0 &&
        pages.map((page, indexPage) => (
          <InView
            rootMargin={"-50% 0px -50% 0px"}
            key={indexPage}
            onChange={(inView, entry) => {
              if (inView && indexPage + 1 !== page) {
                if (initialRender) {
                  setHasPrevious(false);
                  setHasNext(false);
                } else {
                  setInitialRender(true);
                }
                setPage(indexPage + 1);
              }
            }}
          >
            {({ inView, ref, entry }) => (
              <Box w={"100%"} ref={ref}>
                {page &&
                  page.length > 0 &&
                  page.map((item, index) => <Card key={index} item={item} />)}
              </Box>
            )}
          </InView>
        ))}

      <Box h={"150px"} w={"100%"}>
        {!message.message && <CustomSpinner />}

        {(currentPage || error) && message.message && (
          <Center opacity={isDark ? 0.7 : 0.5} w={"100%"} h={"100%"}>
            <Stack>
              <Text fontWeight={"semibold"}>{message.message}</Text>
              <Center fontSize={"3xl"}>
                <Box>{message.icon}</Box>
              </Center>
            </Stack>
          </Center>
        )}
      </Box>
    </Box>
  );
}

export default Pagination;
