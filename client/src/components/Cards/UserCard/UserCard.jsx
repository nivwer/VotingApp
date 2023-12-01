// Components.
import { Card, CardBody, CardHeader } from "@chakra-ui/react";
// SubComponents.
import UserCardHeader from "./UserCardHeader/UserCardHeader";
import { useThemeInfo } from "../../../hooks/Theme";
import UserCardBody from "./UserCardBody/UserCardBody";

// Component.
function UserCard({ item: { user } }) {
  const { isDark } = useThemeInfo();
  return (
    <Card
      bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
      borderRadius="3xl"
      w="99%"
      direction={"row"}
      px={2}
      mb={3}
      mx={"auto"}
    >
      {/* Card Header. */}
      <CardHeader spacing={"4"} pt={2} px={3}>
        <UserCardHeader user={user} />
      </CardHeader>

      {/* Card Body. */}
      <CardBody py={5} px={0} pr={3}>
        <UserCardBody user={user} />
      </CardBody>
    </Card>
  );
}

export default UserCard;
