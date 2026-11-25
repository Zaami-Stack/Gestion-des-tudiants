import { useState } from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

export default function HomePage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <Header isActive={isActive} SetIsActive={setIsActive} />
      {isActive && <SideBar isActive={isActive} SetIsActive={setIsActive} />}
    </>
  );
}
