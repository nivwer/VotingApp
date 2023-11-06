// Components.
import { Card, CardHeader } from "@chakra-ui/react";
// SubComponents.
import UserCardHeader from "./UserCardHeader/UserCardHeader";
import { useThemeInfo } from "../../../hooks/Theme";

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
    >
      <CardHeader>
        <UserCardHeader user={user} />
      </CardHeader>
    </Card>
  );
}

export default UserCard;
