import NavBar from "@/components/NavBar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="relative flex flex-col h-screen w-full">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default layout;
