import React, { useState, useEffect } from "react";
import "./BookFormModal.css";

interface BookFormModalProps {
  mode: "add" | "edit";
  bookData?: any;
  onClose: () => void;
  onSave: (book: any) => void;
}

const BookFormModal: React.FC<BookFormModalProps> = ({
  mode,
  bookData,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    id: Date.now(),
    title: "",
    author: "",
    genre: "Fiction",
    year: new Date().getFullYear(),
    status: "Available",
    isbn: "",
    description: "",
  });
const [titleError, setTitleError] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [yearError, setYearError] = useState("");
  
  useEffect(() => {
    if (mode === "edit" && bookData) {
      setForm(bookData);
    }
  }, [mode, bookData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "title") setTitleError("");
    if (name === "author") setAuthorError("");
    if (name === "year") setYearError("");
  };

   const validateForm = () => {
    let isValid = true;

    if (!form.title.trim()) {
      setTitleError("Title field is required.");
      isValid = false;
    }
    if (!form.author.trim()) {
      setAuthorError("Author field is required.");
      isValid = false;
    }

    if (!form.year || form.year < 1000 || form.year > new Date().getFullYear()) {
      setYearError("Enter a valid year.");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === "add" ? "Add New Book" : "Edit Book"}</h2>
        
        <div className="subHeading">Title</div>
        <input
          type="text"
          name="title"
          placeholder="Enter book title"
          value={form.title}
          onChange={handleChange}
          required
        />
        {titleError && <p className="error">{titleError}</p>}

        <div className="subHeading">Author name</div>
        <input
          type="text"
          name="author"
          placeholder="Enter author name"
          value={form.author}
          onChange={handleChange}
          required
        />
        {authorError && <p className="error">{authorError}</p>}

        <div className="subHeading">Genre</div>
          <select name="genre" value={form.genre} onChange={handleChange}>
            <option>Fiction</option>
            <option>Science Fiction</option>
            <option>Romance</option>
            <option>History</option>
            <option>Self-Help</option>
            <option>Travel</option>
          </select>

          <div className="subHeading">Status</div>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Available</option>
            <option>Issued</option>
          </select>

        <div className="subHeading">year</div>
        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
        />
         {yearError && <p className="error">{yearError}</p>}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={handleSubmit}>
            {mode === "add" ? "Add Book" : "Update Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
