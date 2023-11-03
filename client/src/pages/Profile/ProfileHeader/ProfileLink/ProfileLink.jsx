// Components.

import { Link } from "@chakra-ui/react";

// SubComponent ( ProfileHeader ).
function ProfileLink({ link }) {
  return <Link>{link.replace(/(https:\/\/)|(www\.)/g, "").split("/")[0]}</Link>;
}

export default ProfileLink;
