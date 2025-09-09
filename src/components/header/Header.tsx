import React from "react";
import "./Header.css";

interface HeaderProps {
  onAddBook: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBook, onSearch }) => {
  return (
    <header className="header">
      <div className="logo">📚 BookHub</div>
      <div className="search-container">
        <input type="text" placeholder="Search by title or author..." 
        onChange={(e) => onSearch(e.target.value)}/>
      </div>
      <button className="add-book-btn" onClick={onAddBook}>
        + Add Book
      </button>
    </header>
  );
};

export default Header;
