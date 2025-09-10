import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        Created By  <strong className="name">Naveen M</strong>
      </div>

      <div className="footer-center">
         <span>📚 BookHub &copy; {new Date().getFullYear()} | All Rights Reserved</span>
      </div>

      <div className="footer-right">
        <a
          href="https://github.com/naveenm612/book-management-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>{" "}
        •{" "}
        <a
          href="https://books-management-app.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deployed on Vercel
        </a>
      </div>
    </footer>
  );
};

export default Footer;
