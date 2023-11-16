// Hooks.
import { useState } from "react";
// Components.
import { Button, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
// SubComponents.
import PollCardInputOption from "./PollCardInputOption/PollCardInputOption";
import PollCardOptionButton from "./PollCardOptionButton/PollCardOptionButton";
// Icons.
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

// SubComponent ( PollCard ).
function PollCardBody({ poll, userActions, isLoading, state }) {
  const { has_voted } = userActions;
  const [vote, setVote] = useState(has_voted ? has_voted.vote : "");
  const { showInputOption, setShowInputOption } = state;
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Flex justifyContent={"center"}>
      <Stack spacing={6} w={"90%"}>
        <Stack textAlign={"center"}>
          {/* Title. */}
          <Heading size={"md"} opacity={0.9}>
            {poll.title}
          </Heading>
          {/* Description. */}
          <Text fontSize={"md"} fontWeight={"medium"} opacity={0.8}>
            {poll.description}
          </Text>
        </Stack>

        {/* Poll options. */}
        <Stack px={4}>
          {poll.options
            .slice(0, poll.options.length)
            .sort((a, b) => b.votes - a.votes)
            .slice(0, showAllOptions ? poll.options.length : 4)
            .map((option, index) => (
              <PollCardOptionButton
                key={index}
                poll={poll}
                userActions={userActions}
                option={option}
                voteState={{ vote: vote, setVote: setVote }}
                disabledState={{
                  isDisabled: isLoading || isDisabled,
                  setIsDisabled: setIsDisabled,
                }}
              />
            ))}
          {showInputOption && (
            <PollCardInputOption
              id={poll.id}
              setShowInputOption={setShowInputOption}
            />
          )}
        </Stack>
        {/* Show all options button. */}
        {poll.options && poll.options.length > 4 && (
          <Flex opacity={0.8} justify={"center"}>
            <Button
              onClick={() => setShowAllOptions(!showAllOptions)}
              size={"sm"}
              variant={"ghost"}
              borderRadius={"full"}
              pl={6}
              rightIcon={
                <Icon
                  boxSize={6}
                  as={showAllOptions ? ChevronUpIcon : ChevronDownIcon}
                />
              }
            >
              {showAllOptions ? "Show less" : "Show more"}
            </Button>
          </Flex>
        )}
      </Stack>
    </Flex>
  );
}

export default PollCardBody;
