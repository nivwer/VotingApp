// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useState } from "react";
import { useDeletePollMutation } from "../../../api/pollApiSlice";
// Components.
import CustomProgress from "../../Progress/CustomProgress/CustomProgress";
import { Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";
// SubComponents.
import PollCardHeader from "./PollCardHeader/PollCardHeader";
import PollCardBody from "./PollCardBody/PollCardBody";
import PollCardFooter from "./PollCardFooter/PollCardFooter";

// Component.
function PollCard({ poll }) {
  const { isDark } = useThemeInfo();

  // Request to delete polls.
  const [deletePoll, { isLoading }] = useDeletePollMutation();

  // Show input option.
  const [showInputOption, setShowInputOption] = useState(false);

  return (
    <>
      {poll && (
        <Card
          bg={isDark ? "black" : "white"}
          w="100%"
          borderRadius="0"
          borderBottom={"1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
          opacity={isLoading ? 0.6 : 1}
          boxShadow={"none"}
        >
          {isLoading && <CustomProgress />}

          {/* Card Header. */}
          <CardHeader pt={0}>
            <PollCardHeader
              poll={poll}
              isLoading={isLoading}
              deletePoll={deletePoll}
            />
          </CardHeader>

          {/* Card Body. */}
          <CardBody pt={2}>
            <PollCardBody
              poll={poll}
              isLoading={isLoading}
              state={{
                showInputOption: showInputOption,
                setShowInputOption: setShowInputOption,
              }}
            />
          </CardBody>

          {/* Card Footer. */}
          <CardFooter py={3}>
            <PollCardFooter
              poll={poll}
              isLoading={isLoading}
              state={{
                showInputOption: showInputOption,
                setShowInputOption: setShowInputOption,
              }}
            />
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PollCard;
