import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { About } from "./pages/About";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { Menu } from "./pages/Menu";
import { NotFound } from "./pages/NotFound";
import { OrderConfirmed } from "./pages/OrderConfirmed";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="about" element={<About />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order/:id" element={<OrderConfirmed />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
