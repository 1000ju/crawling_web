import "./Header.css";
import thumbnail from "./../assets/react.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();

  return (
    <div className="Header">
      <img onClick={() => nav("/")} src={thumbnail} />
      <div className="crawling" onClick={() => nav("/crawling")}>
        Crawling
      </div>
      <div className="null" onClick={() => nav("/price")}>
        NULL
      </div>
      <div className="null" onClick={() => nav("/revenue")}>
        NULL
      </div>
    </div>
  );
};

export default Header;
