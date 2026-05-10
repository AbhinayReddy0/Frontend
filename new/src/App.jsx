// App.jsx — add these routes
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Integrations from "./components/Integrations";
import ManualUpload from "./components/ManualUpload";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Integrations />} />
      <Route path="/manual-upload" element={<ManualUpload />} />
    </Routes>
  </BrowserRouter>
);

export default App;