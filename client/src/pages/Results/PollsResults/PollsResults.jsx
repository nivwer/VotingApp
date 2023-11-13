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
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [message, setMessage] = useState(false);
  const [dataQuery, setDataQuery] = useState(false);

  // const [ref, inView] = useInView({
  //   rootMargin: "0px 0px -50% 0px",
  // });

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

  // Reset values.
  useEffect(() => {
    setPage(1);
    setPages([]);
    setMessage(false);
  }, [query, type]);

  // Update data to fetchs.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataQuery({ ...headers, query: query });
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
      {/* {pages &&
        pages.map((page) => (
          <Box key={page} ref={ref}>
            {page.map((poll, index) => (
              <PollCard key={index} poll={poll} />
            ))}
          </Box>
        ))} */}

      {/* {pages &&
        pages.map((page, index) => (
          <InView
            key={index}
            onChange={(inView, entry) => console.log(`Inview: ${index} `)}
          >
            {({ inView, ref, entry }) => (
              <Box h={"1000px"}>
                <Box w={0} h={0} >
                  <div ref={ref}></div>
                </Box>
                <div>
                  <h2>{`Header 1 inside viewport ${inView}.`}</h2>
                </div>
              </Box>
            )}
          </InView>
        ))} */}

      {pages &&
        pages.map((page, indexPage) => (
          <InView
            rootMargin={"-50% 0px -50% 0px"}
            key={indexPage}
            onChange={(inView, entry) => {
              if (inView && indexPage + 1 !== page) {
                setPage(indexPage + 1);
              }
            }}
          >
            {({ inView, ref, entry }) => (
               <div ref={ref}>
                {page.map((poll, index) => (
                  <PollCard key={index} poll={poll} />
                ))}
                </div>
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
