import "./Header.css";
import { RiMenu3Line } from "react-icons/ri";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  function clickHandle() {
    setIsOpen(!isOpen);
  }
  return (
    <header
      className="flex fixed top-0 left-0 px-5 
        right-0 bg-[#030712] h-15 border-b border-white/10 "
    >
      <div
        className="left flex-1 flex items-center
       text-white font-semibold text-[19px] gap-3"
      >
        <button
          onClick={clickHandle}
          className="menu-button cursor-pointer sm:hidden "
        >
          <RiMenu3Line />
        </button>

        <Link className="font-light flex items-center gap-2" to={"/"}>
          F6600P
        </Link>
      </div>
      <nav className="right w-120 hidden md:flex">
        <ul className="flex items-center gap-5 text-[15px]">
          <li>
            <Link to={"/"}>Accueil</Link>
          </li>
          <li>
            <Link to={"/dashboard"}>Dashboard</Link>
          </li>
          <li>
            <Link to={"/students"}>Étudiants</Link>
          </li>
          <li>
            <Link to={"/students/add"}>Ajouter étudiant</Link>
          </li>
          <li>
            <Link to={"/login"}>Connexion</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
