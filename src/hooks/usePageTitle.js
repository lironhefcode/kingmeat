import { useEffect } from "react";
import { RESTAURANT } from "../data/restaurant";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${RESTAURANT.name}` : `${RESTAURANT.name} | ${RESTAURANT.tagline}`;
  }, [title]);
}
