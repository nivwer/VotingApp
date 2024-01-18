import AsideExploreUsers from "./AsideExploreUsers/AsideExploreUsers";

function Aside({ section }) {
  return <>{["main", "user"].includes(section) && <AsideExploreUsers />}</>;
}

export default Aside;
