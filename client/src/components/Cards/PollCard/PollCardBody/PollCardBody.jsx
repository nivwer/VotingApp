import { useState } from "react";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import PollCardInputOption from "./PollCardInputOption/PollCardInputOption";
import PollCardOptionButton from "./PollCardOptionButton/PollCardOptionButton";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import CustomButton from "../../../Buttons/CustomButton/CustomButton";

function PollCardBody({ poll, userActions, isLoading, state }) {
  const { has_voted } = userActions;
  const [vote, setVote] = useState(has_voted ? has_voted.vote : "");
  const { showInputOption, setShowInputOption } = state;
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Flex justifyContent={"center"}>
      <Stack spacing={3} w={{ base: "100%", sm: "90%" }}>
        <Stack textAlign={"center"}>
          <Text children={poll.title} size={"md"} opacity={0.8} fontWeight={"black"} />
          <Text children={poll.description} fontSize={"md"} fontWeight={"medium"} opacity={0.8} />
        </Stack>

        <Stack px={{ base: 1, sm: 4 }}>
          {poll.options
            .slice(0, poll.options.length)
            .sort((a, b) => b.votes - a.votes)
            .slice(0, showAllOptions ? poll.options.length : 3)
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
            <PollCardInputOption id={poll.id} setShowInputOption={setShowInputOption} />
          )}
        </Stack>

        {poll.options && poll.options.length > 3 && (
          <Flex opacity={0.6} justify={"center"}>
            <CustomButton
              onClick={() => setShowAllOptions(!showAllOptions)}
              size={"sm"}
              variant={"ghost"}
              pl={6}
              rightIcon={<Icon boxSize={6} as={showAllOptions ? ChevronUpIcon : ChevronDownIcon} />}
              children={showAllOptions ? "Show less" : "Show more"}
            />
          </Flex>
        )}
      </Stack>
    </Flex>
  );
}

export default PollCardBody;
