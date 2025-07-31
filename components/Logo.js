import Link from "next/link";
import React from "react";
import { CircleDollarSign } from "lucide-react";

const Logo = () => {
  return (
    <>
      <Link href="/">
        <div className="flex items-center justify-center gap-2">
          <CircleDollarSign className="stroke h-8 w-8 stroke-purple-500 stroke-[2]" />
          <p className="bg-gradient-to-r from-purple-500 to-[#8c40ff] bg-clip-text font-bold text-3xl leading-tight tracking-tighter text-transparent">Buckit.</p>
        </div>
      </Link>
    </>
  );
};

export default Logo;
