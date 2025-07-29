"use client"
import React from "react";
import { MoonLoader } from "react-spinners";

const LoaderRotate = ({ size, color }) => {
  return (
    <div>
      <MoonLoader size={size} color={color} />
    </div>
  );
};

export default LoaderRotate;
