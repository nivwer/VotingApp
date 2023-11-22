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
      bg={isDark ? "black" : "white"}
      w="100%"
      borderRadius="0"
      direction={"row"}
      borderBottom={"1px solid"}
      borderColor={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
      px={2}
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
