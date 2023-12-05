import { useThemeInfo } from "../../../../hooks/Theme";
import { Link } from "@chakra-ui/react";
import socialMediaIcons from "../../../../utils/icons/socialMediaIcons";

function ProfileLink({ link, website = false }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const domain = link.replace(/(https:\/\/)|(www\.)/g, "").split("/")[0];
  const Icon = socialMediaIcons.hasOwnProperty(domain) ? socialMediaIcons[domain] : false;

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
          _hover={{ color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`, opacity: 1 }}
          children={<Icon />}
        />
      ) : (
        <Link children={domain} mr={3} />
      )}
    </>
  );
}

export default ProfileLink;
