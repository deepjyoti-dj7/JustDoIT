import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DocPage } from "@/components/docs/DocPage";
import { Hero } from "@/components/home/Hero";

export function App() {
  return (
    <BrowserRouter basename="/JustDoIT">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hero />} />
          <Route path="*" element={<DocPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
