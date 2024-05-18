import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import HomePage from "./pages/HomePage";
import CancelPage from "./pages/CancelPage";
import FeedbackPage from "./pages/FeedbackPage";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />}  />
          <Route path='/hotels' element={<HomePage />}  />
          <Route path='/cancel' element={<CancelPage />}  />
          <Route path='/feedback' element={<FeedbackPage />}  />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
