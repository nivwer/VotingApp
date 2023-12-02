// Components.
import { Card, CardBody, CardHeader } from "@chakra-ui/react";
// SubComponents.
import UserCardHeader from "./UserCardHeader/UserCardHeader";
import { useThemeInfo } from "../../../hooks/Theme";
import UserCardBody from "./UserCardBody/UserCardBody";

// Component.
function UserCard({ item: { user }, variant = "filled", hasBio = true }) {
  const { isDark } = useThemeInfo();
  return (
    <Card
      bg={
        variant == "filled"
          ? isDark
            ? "gothicPurpleAlpha.100"
            : "gothicPurpleAlpha.200"
          : variant == "unstyled" && "transparent"
      }
      borderRadius={{ base: 0, sm: "3xl" }}
      w="99%"
      direction={"row"}
      px={2}
      mb={variant == "filled" ? 3 : variant == "unstyled" && 0}
      mx={"auto"}
      boxShadow={variant == "filled" ? "base" : variant == "unstyled" && "none"}
    >
      {/* Card Header. */}
      <CardHeader
        spacing={"4"}
        pt={variant == "filled" ? 2 : variant == "unstyled" && 0}
        px={3}
      >
        <UserCardHeader user={user} />
      </CardHeader>

      {/* Card Body. */}
      <CardBody py={variant == "filled" ? 5 : variant == "unstyled" && 3} px={0} pr={3}>
        <UserCardBody user={user} hasBio={hasBio} />
      </CardBody>
    </Card>
  );
}

export default UserCard;
