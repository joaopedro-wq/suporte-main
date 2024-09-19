import React from "react";


const Footer: React.FC = () => {
  return (
    <>
      <div style={{ height: "5%" }}></div> {/* Espaço para a margem superior */}
      <footer className="fixed bottom-0 left-0 w-full bg-zinc-900 text-white py-6">
        <div className="footer-container text-center">
          <p className="text-sm">
            &copy; 2024 Suporte. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
