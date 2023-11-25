// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Link } from "@chakra-ui/react";
// Utils.
import socialMediaIcons from "../../../../utils/socialMediaIcons";

// SubComponent ( ProfileHeader ).
function ProfileLink({ link, website = false }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const domain = link.replace(/(https:\/\/)|(www\.)/g, "").split("/")[0];

  const Icon = socialMediaIcons.hasOwnProperty(domain)
    ? socialMediaIcons[domain]
    : false;

  return (
    <>
      {Icon && !website ? (
        <Link
          opacity={0.9}
          p={1}
          fontSize={"xl"}
          my={1}
          mr={2}
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
          _hover={{
            color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`,
            opacity: 1,
          }}
        >
          <Icon />
        </Link>
      ) : (
        <Link mr={3}
        >
          {domain}
        </Link>
      )}
    </>
  );
}

export default ProfileLink;
