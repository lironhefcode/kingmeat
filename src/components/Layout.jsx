import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Toast } from "./Toast";

// New page starts at the top, or at the #section the link points to
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export function Layout() {
  useScrollOnNavigate();
  return (
    <>
      <a className="skip-link" href="#main">דלגו לתוכן</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
