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
function PollCard({ item }) {
  const { poll, authenticated_user_actions: userActions } = item;
  const { isDark } = useThemeInfo();
  const [showInputOption, setShowInputOption] = useState(false);

  // Request to delete polls.
  const [deletePoll, { isLoading }] = useDeletePollMutation();

  return (
    <>
      {poll && (
        <Card
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          w="100%"
          borderRadius="3xl"
          opacity={isLoading ? 0.6 : 1}
          mb={4}
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
          <CardBody py={2}>
            <PollCardBody
              poll={poll}
              userActions={userActions}
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
              userActions={userActions}
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
