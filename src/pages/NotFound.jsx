import { Link } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFound() {
  usePageTitle("העמוד לא נמצא");
  return (
    <div className="container" style={{ display: "grid", justifyItems: "start", gap: 24, paddingBlock: "96px 160px" }}>
      <h1 className="page-title">העמוד לא נמצא</h1>
      <p className="lead" style={{ marginTop: 0 }}>הקישור שהגעתם ממנו לא קיים יותר. התפריט כן.</p>
      <Link className="btn btn-red" to="/menu">לתפריט</Link>
    </div>
  );
}
