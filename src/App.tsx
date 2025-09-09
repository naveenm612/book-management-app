import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookManagement from "./components/bookmanagement/BookManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
