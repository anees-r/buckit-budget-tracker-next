import Logo from "@/components/Logo";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center">
      <Logo/>
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default layout;
