import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useThemeInfo } from "../../../../hooks/Theme";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

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
        word.toLowerCase() === "and" ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <Breadcrumb fontSize={"md"} color={isDark ? "whiteAlpha.700" : "blackAlpha.700"}>
      {path && path[0] && (
        <BreadcrumbItem isCurrentPage={path[1] ? false : true}>
          <BreadcrumbLink
            onClick={() => navigate(`/${path[0]}`)}
            fontWeight={path[1] ? "medium" : "bold"}
            children={username ? `@${username}` : formatPathSegment(path[0])}
          />
        </BreadcrumbItem>
      )}
      {path && path[1] && !username && (
        <BreadcrumbItem isCurrentPage={path[2] ? false : true}>
          <BreadcrumbLink
            onClick={() => navigate(`/${path[0]}/${path[1]}`)}
            fontWeight={path[2] ? "medium" : "bold"}
            children={formatPathSegment(path[1])}
          />
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}

export default NavbarBreadcrumb;
