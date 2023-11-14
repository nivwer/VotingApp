// Hooks.
import { useEffect, useState } from "react";
// Components.
import { Box, Center, Stack, Text } from "@chakra-ui/react";
// Icons.
import { FaRegFaceFrown, FaRegFaceMehBlank } from "react-icons/fa6";
// Others.
import { InView } from "react-intersection-observer";

// Component.
function Pagination({ Card, usePageQuery, dataQuery, reset }) {
  // Initial Render.
  const [initialRender, setInitialRender] = useState(false);
  // Reset values.
  const { resetValues, setResetValues } = reset;

  // Pages data.
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  // Message.
  const [message, setMessage] = useState(false);

  // Paginator data.
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);

//   const defaultPaginatorValues = {
//     total_items: 0,
//     total_pages: 0,
//     has_previous: false,
//     has_next: false,
//   };
//   const [paginator, setPaginator] = useState(defaultPaginatorValues);

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
    { skip: dataQuery && hasPrevious ? false : true }
  );

  const {
    data: currentPage,
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
    { skip: dataQuery && hasNext ? false : true }
  );

  // Reset values.
  useEffect(() => {
    setPage(1);
    setPages([]);

    setMessage(false);
    // setPaginator(defaultPaginatorValues);
    setTotalItems(0)
    setTotalPages(0)
    setHasPrevious(false)
    setHasNext(false)

    setInitialRender(false);
    setResetValues(false);
  }, [resetValues]);

  useEffect(() => {
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
                  setHasPrevious(false)
                  setHasNext(false)
                } else {
                  setInitialRender(true);
                }
                setPage(indexPage + 1);
              }
            }}
          >
            {({ inView, ref, entry }) => (
              <Box w={"100%"} ref={ref}>
                {page.map((item, index) => (
                  <Card key={index} item={item} />
                ))}
              </Box>
            )}
          </InView>
        ))}
    </Box>
  );
}

export default Pagination;
