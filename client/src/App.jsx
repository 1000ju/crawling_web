import "./App.css";
import CrawlingPage from "./pages/CrawlingPage";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="crawling" element={<CrawlingPage />} />
      </Routes>
    </div>
  );
}

export default App;
