// Everything a customer needs to reach the restaurant lives here.
// Phone and Kfar Saba hours come from the restaurant's Wolt page (October 2026).
export const RESTAURANT = {
  name: "קינג מיט",
  tagline: "כריך אנטריקוט דרום אמריקאי",
  kosherNote: "הכשרות באחריות בית העסק",
  phone: "050-3888836",
  branches: [
    {
      id: "kfar-saba",
      city: "כפר סבא",
      street: 'התע"ש 14',
      hours: [
        { days: "א׳–ה׳", hours: "11:00–01:00" },
        { days: "שישי", hours: "סגור" },
        { days: "מוצאי שבת", hours: "19:00–02:00" },
      ],
    },
    // TODO: Hod HaSharon opening hours
    { id: "hod-hasharon", city: "הוד השרון", street: "רמתיים 36", hours: [] },
  ],
  // TODO: the restaurant's own delivery fee (Wolt's fee is Wolt's, not theirs)
  deliveryFee: 0,
};

export const telHref = (phone) => "tel:+972" + phone.replace(/\D/g, "").replace(/^0/, "");
