import "./Header.css";
import { RiMenu3Line } from "react-icons/ri";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { HiAcademicCap } from "react-icons/hi2";

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
          className="menu-button cursor-pointer flex md:hidden "
        >
          <RiMenu3Line />
        </button>

        <Link
          className="font-light flex items-center gap-2 tracking-tighter"
          to={"/"}
        >
          <HiAcademicCap className="mb-1" />
          EduFlow
        </Link>
      </div>
      <nav className="right  flex-1 justify-end hidden md:flex">
        <ul className="flex items-center gap-5 text-[16px] tracking-tighter ">
          <li className=" relative">
            <IoIosSearch className=" absolute top-1 left-23" />
            <input
              type="text"
              disabled
              className="bg-[#10141E] rounded-2xl ps-3 w-30"
            />
          </li>
          <li>
            <NavLink
              className={"hover:text-gray-100/90 whitespace-nowrap shrink-0"}
              to={"/"}
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-gray-100/90 whitespace-nowrap shrink-0"
              to={"/dashboard"}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-gray-100/90 whitespace-nowrap shrink-0"
              to={"/students"}
            >
              Étudiants
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-gray-100/90 whitespace-nowrap shrink-0"
              to={"/students/add"}
            >
              Ajouter étudiant
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:text-gray-100/90 whitespace-nowrap shrink-0"
              to={"/login"}
            >
              Connexion
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
