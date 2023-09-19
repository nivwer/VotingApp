// Components.
import { Box } from "@chakra-ui/react";
import CustomSpinner from "../../Spinners/CustomSpinner";
import PollCard from "../../Cards/PollCard/PollCard";


// Component.
function PollCardGroup({ data }) {
  return (
    <Box w={"100%"} display={"flex"} flexDir={"column"} alignItems={"center"}>
      {!data ? (
        <CustomSpinner />
      ) : data.polls ? (
        data.polls.map((poll, index) => <PollCard key={index} poll={poll} />)
      ) : (
        <div>{data.message}</div>
      )}
    </Box>
  );
}

export default PollCardGroup;
