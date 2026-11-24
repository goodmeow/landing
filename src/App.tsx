import { MotionConfig } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import NotFoundPage from "@/pages/not-found";
import PrivacyPage from "@/pages/privacy";
import StreamPage from "@/pages/stream";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<StreamPage />} path="/stream" />
        <Route element={<PrivacyPage />} path="/privacy" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </MotionConfig>
  );
}

export default App;
