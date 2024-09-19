"use client";

import React from "react";
import Link from "next/link";
import { FaHome, FaPlus, FaList, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter(); 
  
 
  const handleLogout = () => {
    // Remove o id_usuario do cache
    
    localStorage.removeItem("userId"); 
    router.push("/login");



  };

  return (
    <header className="bg-zinc-900 py-4 shadow-lg">
      <nav className="flex justify-center">
        <ul className="flex gap-8 items-center text-gray-300 hover:text-yellow-400">
          <li className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300">
            <Link href="/postagemInicial" className="flex items-center gap-2">
              <FaHome className="text-blue-400" />
              Home
            </Link>
          </li>
          <li className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300">
            <Link href="/postagem" className="flex items-center gap-2">
              <FaPlus className="text-green-400" />
              Criar Postagem
            </Link>
          </li>
          <li className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300">
            <Link href="/postagensUsuario" className="flex items-center gap-2">
              <FaList className="text-red-400" />
              Minhas Postagens
            </Link>
          </li>
          <li
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300 cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-red-400" />
            Logout
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
