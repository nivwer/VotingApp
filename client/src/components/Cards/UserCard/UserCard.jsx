// Components.
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
} from "@chakra-ui/react";
// SubComponents.
import UserCardHeader from "./UserCardHeader/UserCardHeader";
import { useThemeInfo } from "../../../hooks/Theme";
import UserCardBody from "./UserCardBody/UserCardBody";

// Component.
function UserCard({ user }) {
  const { isDark } = useThemeInfo();
  return (
    <Card
      bg={isDark ? "black" : "white"}
      w="100%"
      borderRadius="0"
      direction={"row"}
      borderBottom={"1px solid"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
      px={2}
    >
      {/* Card Header. */}
      <CardHeader spacing={"4"} pt={2} px={3}>
        <UserCardHeader user={user} />
      </CardHeader>

      {/* Card Body. */}
      <CardBody py={5} px={0} pr={3}>
        {/* <CommentCardBody comment={comment} isLoading={isLoading} /> */}
        <UserCardBody user={user} />
      </CardBody>

      {/* Card Footer. */}
      {/* <CardFooter py={3}>
        <Button>Profile</Button>
      </CardFooter> */}
    </Card>
  );
}

export default UserCard;
