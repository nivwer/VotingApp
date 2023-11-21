// Components.
import { Button, HStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Icons.
import { FaArtstation, FaBook, FaCamera, FaClock, FaCode, FaCoins, FaCross, FaDumbbell, FaFilm, FaGlobe, FaGraduationCap, FaHandshakeSimple, FaHashtag, FaHeart, FaLandmark, FaLock, FaMicrochip, FaMusic, FaNewspaper, FaPalette, FaPaw, FaPlane, FaPlantWilt, FaScroll, FaSeedling, FaShield, FaShirt, FaTicket, FaUtensils, FaVolleyball } from "react-icons/fa6";

// SubComponent ( SideBar ).
function SideBarCategoryButton({ category }) {
  const categoryIcons = {
    technology: <FaMicrochip />,
    music: <FaMusic />,
    "art and culture": <FaPalette />,
    programming: <FaCode />,
    "animals and pets": <FaPaw />,
    education: <FaGraduationCap />,
    hobbies: <FaClock />,
    "social networks": <FaGlobe />,
    news: <FaNewspaper />,
    "food and nutrition": <FaUtensils />,
    "personal finance": <FaCoins />,
    "fashion and beauty": <FaShirt />,
    "politics and government": <FaLandmark />,
    lifestyle: <FaDumbbell />,
    sports: <FaVolleyball />,
    "health and wellness": <FaHeart/>,
    environment: <FaSeedling />,
    "travel and tourism": <FaPlane />,
    cybersecurity: <FaShield />,
    relationships: <FaHandshakeSimple />,
    movies: <FaTicket />,
    history: <FaScroll />,
    literature: <FaBook />,
    "home and gardening": <FaPlantWilt />,
    photography: <FaCamera />,
  };

  return (
    <NavLink to={`/categories/${category.value}`}>
      <Button variant={"ghost"} justifyContent={"start"} w={"100%"} size={"md"}>
        <HStack spacing={4}>
          <Text>{categoryIcons[category.value] || <FaHashtag />}</Text>
          <Text>{category.text}</Text>
        </HStack>
      </Button>
    </NavLink>
  );
}

export default SideBarCategoryButton;
