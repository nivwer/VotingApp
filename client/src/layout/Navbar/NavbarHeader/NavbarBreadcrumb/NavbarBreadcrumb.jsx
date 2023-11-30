// Hooks.
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

// SubComponent ( Navbar ).
function NavbarBreadcrumb() {
  const navigate = useNavigate();
  const { isDark } = useThemeInfo();

  const location = useLocation();
  const currentPath = location.pathname;
  const path = currentPath.split("/").filter((segment) => segment !== "");
  const { username } = useParams();

  const formatPathSegment = (segment) => {
    return decodeURIComponent(segment)
      .split(" ")
      .map((word) =>
        word.toLowerCase() === "and"
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <Breadcrumb
      fontSize={"md"}
      color={isDark ? "whiteAlpha.700" : "blackAlpha.700"}
    >
      {path && path[0] && (
        <BreadcrumbItem isCurrentPage={path[1] ? false : true}>
          <BreadcrumbLink
            onClick={() => navigate(`/${path[0]}`)}
            fontWeight={path[1] ? "medium" : "bold"}
          >
            {username ? `@${username}` : formatPathSegment(path[0])}
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}

      {path && path[1] && !username && (
        <BreadcrumbItem isCurrentPage={path[2] ? false : true}>
          <BreadcrumbLink
            onClick={() => navigate(`/${path[0]}/${path[1]}`)}
            fontWeight={path[2] ? "medium" : "bold"}
          >
            {formatPathSegment(path[1])}
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}

export default NavbarBreadcrumb;
