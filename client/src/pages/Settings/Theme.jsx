// Hooks.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Components.
import ThemeSelector from "../../components/Theme/ThemeSelector";

function Theme() {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  const HandleOnChange = (e) => {
    setData(e.target.value);
  };

  const HandleOnClick = (e) => {
    e.preventDefault();
    navigate(`/user/${data}`);
  };
  return (
    <>
      <input type="text" onChange={HandleOnChange} />
      <button onClick={HandleOnClick}>Submit</button>
      <div>Theme</div>
      <ThemeSelector />
    </>
  );
}

export default Theme;
