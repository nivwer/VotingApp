// Components.
import { Box } from "@chakra-ui/react";
import CustomSpinner from "../../Spinners/CustomSpinner";
import PollCard from "../../Cards/PollCard/PollCard";

// Component.
function PollCardGroup({ data, isLoading }) {
  return (
    <Box w={"100%"} display={"flex"} flexDir={"column"} alignItems={"center"}>
      {data && data.polls
        ? data.polls.map((poll, index) => <PollCard key={index} poll={poll} />)
        : data && <div>{data.message}</div>}
      {(isLoading || !data) && <CustomSpinner />}
    </Box>
  );
}

export default PollCardGroup;
