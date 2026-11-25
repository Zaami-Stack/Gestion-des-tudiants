import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useState } from "react";


export function HomePage() {
    const [isActive, SetIsActive] = useState(false);
  return (
    <>
      <title>Accueil</title>
      <Header SetIsActive={SetIsActive} isActive={isActive} />
      { isActive && <SideBar SetIsActive={SetIsActive} isActive={isActive} /> }
      
    </>
  );
}
