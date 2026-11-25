import "./Header.css";
import { RiMenu3Line } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { HiAcademicCap } from "react-icons/hi2";

export default function Header({isActive, SetIsActive}) {


  function clickHandle() {
    SetIsActive(!isActive);
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
          <span className="text-[#00BCFF]"><span className="text-white">Edu</span>Flow</span>
        </Link>
      </div>
      <nav className="right  flex-1 justify-end hidden md:flex">
        <ul className="flex items-center gap-5 text-[16px] tracking-tighter ">
          <li className=" relative">
            <IoIosSearch color="gray" className=" absolute top-1 left-23 mt-px" />
            <input
              type="text"
              disabled
              placeholder="Ctrl K"
              className="header-input bg-[#10141E] rounded-2xl ps-3 w-30 border border-[#18223e]"
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
              className="hover:text-pink-500 text-pink-400 whitespace-nowrap shrink-0"
              to={"/login"}
            >
              Déconnecter 
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
