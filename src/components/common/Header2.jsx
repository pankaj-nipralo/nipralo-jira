"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <header className="flex justify-between items-center px-10 py-7">
      <Link href="/">
        <Image
          src={"/images/nipralo_logo.png"}
          width={300}
          height={200}
          alt="Nipralo Logo"
        />
      </Link>

      {isLogin ? (
        <>
          <div className="Login">
            <Button onClick={() => setIsLogin(!isLogin)}>Logout</Button>
          </div>
        </>
      ) : (
        // <div className="Login">
        //   <Button onClick={() => setIsLogin(!isLogin)}>Login</Button>
        // </div> 
        <></>
      )}
    </header>
  );
};

export default Header;
