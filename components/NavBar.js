"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import MyUserButton from "./MyUserButton";

const NavBar = () => {
  return (
    <div>
      <DesktopNavbar />
      <MobileNavbar />
    </div>
  );
};

const items = [
  {
    label: "Dashboard",
    link: "/",
  },
  {
    label: "Transaction",
    link: "/transaction",
  },
  {
    label: "Manage",
    link: "/manage",
  },
];

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="block border-separate bg-background md:hidden">
        <nav className="flex items-center justify-between px-5">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-5" side="left">
              <Logo />
              <div className="flex flex-col gap-1 pt-4">
                {items.map((item) => (
                  <NavBarItem
                    key={item.label}
                    label={item.label}
                    link={item.link}
                    onClick={() => {
                      setIsOpen((prev) => !prev);
                    }}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcherButton />
            <MyUserButton />
          </div>
        </nav>
      </div>
    </>
  );
};

const DesktopNavbar = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className="hidden border-separate border-b bg-background md:block">
        <nav className=" flex items-center justify-between px-8">
          <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
            <Logo />
            <div className="flex h-full">
              {items.map((item) => (
                <NavBarItem
                  key={item.label}
                  label={item.label}
                  link={item.link}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcherButton />
            <MyUserButton />
          </div>
        </nav>
      </div>
    </>
  );
};

const NavBarItem = ({ label, link, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <>
      <div className="relative flex items-center">
        <Link
          href={link}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
            isActive && "text-foreground"
          )}
          onClick={() => {
            if (onClick) onClick();
          }}
        >
          {label}
        </Link>
        {isActive && (
          <div className="absolute -bottom-[2px] left-3 hidden h-[2px] w-[80%] rounded-xl bg-purple-500 md:block"></div>
        )}
      </div>
    </>
  );
};

export default NavBar;
