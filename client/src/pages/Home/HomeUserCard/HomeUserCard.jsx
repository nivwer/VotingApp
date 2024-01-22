import { useSelector } from "react-redux";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { useThemeInfo } from "../../../hooks/Theme";
import CustomButton from "../../../components/Buttons/CustomButton/CustomButton";
import { FaPlus } from "react-icons/fa6";
import PollModal from "../../../components/Modals/PollModal/PollModal";

function HomeUserCard() {
  const { user, profile } = useSelector((state) => state.session);
  const { isDark, ThemeColor } = useThemeInfo();
  const pollModalDisclosure = useDisclosure();

  return (
    <Card
      bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
      w="99%"
      direction={"row"}
      borderRadius={{ base: 0, sm: "3xl" }}
      mb={4}
      mx={"auto"}
      px={2}
      boxShadow={"base"}
    >
      <CardHeader spacing={"4"} pt={2} px={3}>
        <HStack flex={1} mt={3}>
          <NavLink to={`/${user.username}`}>
            <IconButton variant={"unstyled"}>
              <Avatar
                bg={profile.profile_picture ? "transparent" : "gray.400"}
                size={"md"}
                h={"42px"}
                w={"42px"}
                src={profile.profile_picture}
              />
            </IconButton>
          </NavLink>
        </HStack>
      </CardHeader>

      <CardBody py={5} px={3}>
        <HStack justify={"end"}>
          <CustomButton
            onClick={pollModalDisclosure.onOpen}
            variant={"ghost"}
            icon={<FaPlus />}
            color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
            px={5}
          >
            <HStack>
              <Text
                color={isDark ? `whiteAlpha.800` : `blackAlpha.800`}
                pt={"2px"}
                fontWeight={"bold"}
                children={"New Poll"}
              />
              <FaPlus />
            </HStack>
          </CustomButton>
        </HStack>
        <PollModal disclosure={pollModalDisclosure} />
      </CardBody>
    </Card>
  );
}

export default HomeUserCard;
