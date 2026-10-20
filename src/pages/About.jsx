import { Link } from "react-router";
import { HoursList } from "../components/HoursList";
import { CrownIcon } from "../components/Icons";
import { WavePanel } from "../components/WavePanel";
import { RESTAURANT, telHref } from "../data/restaurant";
import { usePageTitle } from "../hooks/usePageTitle";
import "./About.css";

export function About() {
  usePageTitle("אודות");
  return (
    <article className="about">
      <WavePanel as="header" className="about-head">
        <div className="container panel-head">
          <h1 className="page-title">
            <span className="about-line">כריך אחד,</span>
            <span className="about-line">עשוי ברצינות</span>
          </h1>
          <p className="about-intro">
            קינג מיט מגישה בשרים מהגריל בסגנון ארגנטינאי, בג'בטה חמה מתנור לבנים: רצועות אנטריקוט, אבוקדו וצ'ימיצ'ורי,
            עם ירקות טריים ושלושה רטבי בית.
          </p>
        </div>
      </WavePanel>

      <figure className="about-wide">
        <img src="/images/sandwich-meat.jpg" alt="כריך קינג מיט עם צ'ימיצ'ורי בצד" width="1600" height="1067" loading="lazy" />
      </figure>

      <div className="container about-body">
        <section className="about-row">
          <h2 className="about-h2">למה דרום אמריקאי</h2>
          <div className="about-text">
            <p>
              בארגנטינה ובאורוגוואי, בשר מהגריל מגיע כמעט תמיד עם צ'ימיצ'ורי: רוטב ירוק של פטרוזיליה, שום, שמן וחומץ.
              הוא חד, רענן, וחותך את השומן של הבשר.
            </p>
            <p>
              אצלנו הוא נכנס לתוך הכריך, יחד עם אבוקדו, רוטב שום, צ'יפוטלה וקארי. ואם תרצו עוד,
              יש חמישה עשר רטבים לבחירה בצד.
            </p>
          </div>
        </section>

        <section className="about-row">
          <h2 className="about-h2">לא רק אנטריקוט</h2>
          <div className="about-text">
            <p>
              את אותו כריך אפשר להזמין עם רצועות עוף, עם המבורגר או עם פטריות פורטבלו לצמחונים. וכל מילוי מגיע
              בשלוש דרכים: בג'בטה לבנה או מחיטה מלאה, בטורטייה או כסלט גדול.
            </p>
            <Link className="btn btn-outline" to="/menu">לתפריט המלא</Link>
          </div>
        </section>

        <div className="about-pair">
          <img src="/images/roll-meat.jpg" alt="קינג רול: אנטריקוט ועגבנייה בטורטייה" width="900" height="600" loading="lazy" />
          <img src="/images/salad-meat.jpg" alt="סלט אנטריקוט עם קולסלאו, בצל מטוגן ובוטנים" width="900" height="600" loading="lazy" />
        </div>

        <section className="about-row">
          <h2 className="about-h2">כשר</h2>
          <div className="about-text">
            <p className="about-kosher">
              <CrownIcon className="crown" />
              כל התפריט כשר.
            </p>
            <p>{RESTAURANT.kosherNote}.</p>
          </div>
        </section>

        <section className="about-row">
          <h2 className="about-h2">איפה אנחנו</h2>
          <div className="about-text">
            <ul className="about-branches">
              {RESTAURANT.branches.map((b) => (
                <li key={b.id}>
                  <strong>{b.city}</strong>
                  <span>{b.street}</span>
                </li>
              ))}
              <li>
                <strong>הזמנות</strong>
                <a href={telHref(RESTAURANT.phone)} dir="ltr">{RESTAURANT.phone}</a>
              </li>
            </ul>
            {RESTAURANT.branches
              .filter((b) => b.hours.length)
              .map((b) => (
                <div key={b.id} className="about-hours">
                  <p className="about-hours-title">שעות פתיחה, {b.city}</p>
                  <HoursList hours={b.hours} />
                </div>
              ))}
          </div>
        </section>
      </div>
    </article>
  );
}
