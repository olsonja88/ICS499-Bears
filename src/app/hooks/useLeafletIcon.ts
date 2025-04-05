import { useEffect, useState } from "react";

export function useLeafletIcon(iconUrl: string) {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet only on the client
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");

    const customIcon = new L.Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowSize: [50, 64],
      className: "custom-pin-icon",
    });

    setIcon(customIcon);
  }, [iconUrl]);

  return icon;
}
