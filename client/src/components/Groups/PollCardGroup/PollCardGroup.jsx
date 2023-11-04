// Components.
import { Box } from "@chakra-ui/react";
import CustomSpinner from "../../Spinners/CustomSpinner/CustomSpinner";
import PollCard from "../../Cards/PollCard/PollCard";

// Component.
function PollCardGroup({ data, isLoading }) {
  return (
    <Box w={"100%"} display={"flex"} flexDir={"column"} alignItems={"center"}>
      {data && data.polls && !isLoading
        ? data.polls.map((poll, index) => <PollCard key={index} poll={poll} />)
        : data && !isLoading && <div>{data.message}</div>}
      {(isLoading || !data) && <CustomSpinner />}
    </Box>
  );
}

export default PollCardGroup;
