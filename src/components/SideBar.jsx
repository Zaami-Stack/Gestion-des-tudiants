import { NavLink } from "react-router-dom";
import { HiAcademicCap } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
export default function SideBar({isActive, SetIsActive}) {
  function clickHandle() {
    SetIsActive(!isActive);
  }
  return (
    <nav
      className="fixed md:hidden flex top-0 bottom-0 left-0
       bg-[#030712] w-full flex-col gap-8 text-white ps-6 font-light tracking-tighter text-xl"
    >
      <div className="flex  items-center mt-5 me-5 mb-10 ">
        <div className=" flex flex-1">
          <p className="flex items-center gap-1">
            <HiAcademicCap />
            <span>Edu<span>Flow</span></span>
          </p>
        </div>
        <div className="flex-1 flex justify-end ">
          <button className=" cursor-pointer" onClick={clickHandle}>
            <IoClose />
          </button>
        </div>
      </div>
      <NavLink className="" to="/">Accueil</NavLink>
      <NavLink className="" to="/dashboard">Dashboard</NavLink>
      <NavLink className="" to="/students">Étudiants</NavLink>
      <NavLink to="/students/add">Ajouter étudiant</NavLink>
      <NavLink to="/login">Deconnecter</NavLink>
    </nav>
  );
}
