import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { placeOrder } from "../api/orders";
import { useCart } from "../cart/CartContext";
import { totals } from "../cart/pricing";
import { CartLines } from "../components/CartDrawer";
import { Price, priceText } from "../components/Price";
import { WavePanel } from "../components/WavePanel";
import { RESTAURANT } from "../data/restaurant";
import { usePageTitle } from "../hooks/usePageTitle";
import "./Checkout.css";

const INITIAL = {
  fulfillment: "pickup",
  branch: RESTAURANT.branches[0].id,
  city: "",
  street: "",
  apartment: "",
  name: "",
  phone: "",
  email: "",
  timing: "asap",
  time: "",
  payment: "card",
  notes: "",
};

const digits = (s) => s.replace(/\D/g, "");

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "נא למלא שם מלא";
  const phone = digits(form.phone);
  if (!/^05\d{8}$/.test(phone) && !/^0[2-9]\d{7}$/.test(phone)) errors.phone = "מספר הטלפון לא תקין. לדוגמה: 050-1234567";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "כתובת האימייל לא תקינה";
  if (form.fulfillment === "delivery") {
    if (!form.city.trim()) errors.city = "נא למלא עיר";
    if (!form.street.trim()) errors.street = "נא למלא רחוב ומספר בית";
  }
  if (form.timing === "scheduled" && !form.time) errors.time = "נא לבחור שעה";
  return errors;
}

function Field({ id, label, optional, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="optional"> (לא חובה)</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

function Choice({ name, value, form, onChange, label, sub }) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={form[name] === value} onChange={onChange} />
      <span className="choice-label">
        {label}
        {sub && <span className="choice-sub">{sub}</span>}
      </span>
    </label>
  );
}

export function Checkout() {
  usePageTitle("תשלום");
  const navigate = useNavigate();
  const { lines, setQty, clear } = useCart();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const sums = totals(lines, form.fulfillment);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  // Shared props for text inputs: value binding plus error wiring
  const input = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange,
    className: "input",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    const branch = RESTAURANT.branches.find((b) => b.id === form.branch);
    // TODO: for card payments, hand off to the payment provider before confirming
    const order = await placeOrder({
      customer: { name: form.name.trim(), phone: form.phone, email: form.email },
      fulfillment: form.fulfillment,
      branch: form.fulfillment === "pickup" ? branch : null,
      address:
        form.fulfillment === "delivery" ? { city: form.city, street: form.street, apartment: form.apartment } : null,
      time: form.timing === "scheduled" ? form.time : null,
      payment: form.payment,
      notes: form.notes,
      lines: lines.map((l) => ({ key: l.key, name: l.item.name, qty: l.qty, details: l.details, total: l.total })),
      ...sums,
    });
    navigate(`/order/${order.id}`, { state: { order } });
    clear();
  };

  if (lines.length === 0) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title">הסל ריק</h1>
        <p className="lead">כדי להזמין, בחרו מנות מהתפריט והן יופיעו כאן.</p>
        <Link className="btn btn-red" to="/menu">לתפריט</Link>
      </div>
    );
  }

  // Only count errors that still apply (e.g. not address errors after switching to pickup)
  const stillInvalid = validate(form);
  const errorCount = Object.keys(errors).filter((k) => errors[k] && stillInvalid[k]).length;

  return (
    <>
      <WavePanel as="div">
        <div className="container panel-head">
          <h1 className="page-title">תשלום</h1>
        </div>
      </WavePanel>

      <div className="container checkout-grid after-panel">
        <form id="checkout-form" className="checkout-form" onSubmit={onSubmit} noValidate>
          <fieldset className="checkout-step">
            <legend className="step-title">איך תרצו לקבל?</legend>
            <div className="choice-row">
              <Choice name="fulfillment" value="pickup" form={form} onChange={onChange} label="איסוף עצמי" sub="מאחד הסניפים" />
              <Choice
                name="fulfillment"
                value="delivery"
                form={form}
                onChange={onChange}
                label="משלוח"
                sub={RESTAURANT.deliveryFee ? `דמי משלוח ${priceText(RESTAURANT.deliveryFee)}` : "עד הבית"}
              />
            </div>

            {form.fulfillment === "pickup" ? (
              <div className="step-sub">
                <p className="label" id="branch-label">מאיזה סניף?</p>
                <div className="choice-row" role="radiogroup" aria-labelledby="branch-label">
                  {RESTAURANT.branches.map((b) => (
                    <Choice key={b.id} name="branch" value={b.id} form={form} onChange={onChange} label={b.city} sub={b.street} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="step-sub field-grid">
                <Field id="city" label="עיר" error={errors.city}>
                  <input {...input("city")} autoComplete="address-level2" />
                </Field>
                <Field id="street" label="רחוב ומספר בית" error={errors.street}>
                  <input {...input("street")} autoComplete="street-address" />
                </Field>
                <Field id="apartment" label="דירה, קומה, קוד כניסה" optional>
                  <input {...input("apartment")} />
                </Field>
              </div>
            )}
          </fieldset>

          <fieldset className="checkout-step">
            <legend className="step-title">פרטים ליצירת קשר</legend>
            <div className="field-grid">
              <Field id="name" label="שם מלא" error={errors.name}>
                <input {...input("name")} autoComplete="name" />
              </Field>
              <Field id="phone" label="טלפון" error={errors.phone} hint="נעדכן אתכם כשההזמנה מוכנה">
                <input {...input("phone")} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" />
              </Field>
              <Field id="email" label="אימייל" optional error={errors.email}>
                <input {...input("email")} type="email" autoComplete="email" dir="ltr" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="checkout-step">
            <legend className="step-title">מתי?</legend>
            <div className="choice-row">
              <Choice name="timing" value="asap" form={form} onChange={onChange} label="כמה שיותר מהר" />
              <Choice name="timing" value="scheduled" form={form} onChange={onChange} label="בשעה מסוימת" />
            </div>
            {form.timing === "scheduled" && (
              <div className="step-sub time-field">
                <Field id="time" label="שעה" error={errors.time}>
                  <input {...input("time")} type="time" step="900" />
                </Field>
              </div>
            )}
          </fieldset>

          <fieldset className="checkout-step">
            <legend className="step-title">תשלום</legend>
            <div className="choice-row">
              <Choice name="payment" value="card" form={form} onChange={onChange} label="כרטיס אשראי" sub="בעמוד תשלום מאובטח" />
              <Choice
                name="payment"
                value="cash"
                form={form}
                onChange={onChange}
                label="מזומן"
                sub={form.fulfillment === "delivery" ? "לשליח" : "בסניף"}
              />
            </div>
          </fieldset>

          <fieldset className="checkout-step">
            <legend className="visually-hidden">הערות</legend>
            <Field id="notes" label="הערות להזמנה" optional>
              <textarea {...input("notes")} rows="3" />
            </Field>
          </fieldset>
        </form>

        <aside className="checkout-summary" aria-labelledby="summary-title">
          <h2 id="summary-title" className="summary-title">ההזמנה שלך</h2>
          <CartLines lines={lines} setQty={setQty} />
          <dl className="summary-totals">
            <div>
              <dt>סכום ביניים</dt>
              <dd><Price value={sums.subtotal} plain /></dd>
            </div>
            {form.fulfillment === "delivery" && (
              <div>
                <dt>משלוח</dt>
                <dd><Price value={sums.delivery} plain /></dd>
              </div>
            )}
            <div className="summary-grand">
              <dt>סה"כ לתשלום</dt>
              <dd><Price value={sums.total} /></dd>
            </div>
          </dl>
          {errorCount > 0 && (
            <p className="field-error summary-error" role="alert">
              {errorCount === 1 ? "יש שדה אחד שצריך לתקן." : `יש ${errorCount} שדות שצריך לתקן.`}
            </p>
          )}
          <button type="submit" form="checkout-form" className="btn btn-red btn-block summary-submit" disabled={submitting}>
            {submitting ? "שולחים את ההזמנה…" : "שליחת ההזמנה"}
          </button>
        </aside>
      </div>
    </>
  );
}
