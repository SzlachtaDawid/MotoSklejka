import { Navigation } from "lucide-react";

type Props = {
  lat: number;
  lng: number;
};

const DirectionButton = ({ lat, lng }: Props) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  return (
    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary mt-1">
      <Navigation size={16} />
      Trasa do punktu startu
    </a>
  );
};

export default DirectionButton;
