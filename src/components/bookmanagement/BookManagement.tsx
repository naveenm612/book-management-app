import React, { useState, useEffect } from "react";
import { Edit, Grid, List, Trash } from "lucide-react";
import Header from "../header/Header";
import BookFormModal from "../book-form-modal/BookFormModal";
import ConfirmDialog from "../confrim-dialog/ConfirmDialog";
import Toast from "../toast/Toast";
import Tooltip from "@mui/material/Tooltip";
import "./BookManagement.css";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  status: "Available" | "Issued";
  isbn?: string;
  description?: string;
}

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [view, setView] = useState<"table" | "grid">("table");
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Book | null>(null);
  const [toast, setToast] = useState("");

  // Filters
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load books from localStorage on mount
  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
  }, []);

  // Save books to localStorage whenever it changes
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem("books", JSON.stringify(books));
    } else {
      localStorage.removeItem("books"); // remove when empty
    }
  }, [books]);

  const handleAddBook = () => {
    setEditBook(null);
    setShowModal(true);
  };

  const handleSaveBook = (book: Book) => {
    if (editBook) {
      // update existing
      const updatedBooks = books.map((b) => (b.id === book.id ? book : b));
      setBooks(updatedBooks);
      setToast("Book updated successfully!");
    } else {
      // add new with unique ID - show latest first
      const newBook = { ...book, id: Date.now() };
      setBooks([newBook, ...books]); 
      setToast("Book added successfully!");
    }
    setShowModal(false);
  };

  const handleEdit = (book: Book) => {
    setEditBook(book);
    setShowModal(true);
  };

  const handleDelete = (book: Book) => {
    setConfirmDelete(book);
  };

  const confirmDeleteBook = () => {
    if (confirmDelete) {
      const updatedBooks = books.filter((b) => b.id !== confirmDelete.id);
      setBooks(updatedBooks);
      setToast("Book deleted successfully!");
    }
    setConfirmDelete(null);
  };

  // Apply filters
  const filteredBooks = books.filter((book) => {
    const matchGenre =
      genreFilter === "All Genres" || book.genre === genreFilter;
    const matchStatus =
      statusFilter === "All Status" || book.status === statusFilter;
     const matchSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGenre && matchStatus && matchSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Header onAddBook={handleAddBook} onSearch={setSearchQuery}/>

      <div className="book-container">
        <h1>Book Management</h1>
        <p className="book-subtitle">Manage your library collection with ease</p>

        {/* Filters + Toggle */}
        <div className="toolbar">
          <div className="filters">
            <select
              className="book-select"
              value={genreFilter}
              onChange={(e) => {
                setGenreFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Genres</option>
              <option>Fiction</option>
              <option>Science Fiction</option>
              <option>Romance</option>
              <option>History</option>
              <option>Self-Help</option>
              <option>Travel</option>
            </select>

            <select
              className="book-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Status</option>
              <option>Available</option>
              <option>Issued</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              onClick={() => setView("table")}
              className={view === "table" ? "active" : ""}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={view === "grid" ? "active" : ""}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>

        {view === "table" ? (
          <div className="book-table-container">
            <table className="book-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      No books found. Please add some!
                    </td>
                  </tr>
                ) : (
                  currentBooks.map((book, index) => (
                    <tr key={book.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.year}</td>
                       <td>
                       <span
                      className={
                        book.status === "Available"
                          ? "status-available"
                          : "status-issued"
                      }
                    >
                      {book.status}
                    </span>
                    </td> 
                      <td>
                        <div className="card-actions1">
                          <Tooltip title="Edit" placement="top-end">
                            <button
                              className="action-btn action-edit"
                              onClick={() => handleEdit(book)}
                            >
                              <Edit size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" placement="top-end">
                            <button
                              className="action-btn action-delete"
                              onClick={() => handleDelete(book)}
                            >
                              <Trash size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="book-grid">
            {filteredBooks.length === 0 ? (
              <p style={{ textAlign: "center", width: "100%" }}>
                No books found. Please add some!
              </p>
            ) : (
              filteredBooks.map((book) => (
                <div key={book.id} className="book-card">
                  <div className="card-header">
                    <h3>{book.title}</h3>
                    <span
                      className={
                        book.status === "Available"
                          ? "status-available"
                          : "status-issued"
                      }
                    >
                      {book.status}
                    </span>
                  </div>
                  <p>{book.author}</p>
                  <p>
                    Genre: <span className="genre-badge">{book.genre}</span>
                  </p>
                  <p>Year: {book.year}</p>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(book)}
                      className="action-btn action-edit"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <Tooltip title="Delete" placement="top-end">
                      <button
                        onClick={() => handleDelete(book)}
                        className="action-btn action-delete"
                      >
                        <Trash size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showModal && (
        <BookFormModal
          mode={editBook ? "edit" : "add"}
          bookData={editBook || undefined}
          onClose={() => setShowModal(false)}
          onSave={handleSaveBook}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${confirmDelete.title}"?`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteBook}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </>
  );
};

export default BookManagement;
