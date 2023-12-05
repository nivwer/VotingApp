import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useReadPollQuery } from "../../api/pollApiSlice";
import PollCard from "../../components/Cards/PollCard/PollCard";
import CustomSpinner from "../../components/Spinners/CustomSpinner/CustomSpinner";
import { Box, Center, Stack, Text } from "@chakra-ui/react";
import PollComments from "./PollComments/PollComments";
import { FaRegFaceFrown, FaLock, FaCircleExclamation } from "react-icons/fa6";
import { useThemeInfo } from "../../hooks/Theme";

function Poll() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { id } = useParams();
  const [dataQuery, setDataQuery] = useState(false);
  const { data, error, isLoading } = useReadPollQuery(dataQuery, {
    skip: dataQuery ? false : true,
  });

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
    setDataQuery({ ...headers, id: id });
  }, [id, isAuthenticated]);

  return (
    <>
      {data && !isLoading && data.poll.id === id ? (
        <>
          <PollCard item={data} />
          <PollComments id={id} />
        </>
      ) : (
        <Box h={"150px"} w={"100%"}>
          {!error && <CustomSpinner />}
          {error && (
            <Center opacity={isDark ? 0.7 : 0.5} w={"100%"} h={"100%"}>
              <Stack>
                <Text children={error.data.message} fontWeight={"semibold"} />
                <Center fontSize={"3xl"}>
                  <Box>
                    {error.status === 403 && <FaLock />}
                    {error.status === 404 && <FaRegFaceFrown />}
                    {(error.status === 400 || error.status === 500) && <FaCircleExclamation />}
                  </Box>
                </Center>
              </Stack>
            </Center>
          )}
        </Box>
      )}
    </>
  );
}

export default Poll;
