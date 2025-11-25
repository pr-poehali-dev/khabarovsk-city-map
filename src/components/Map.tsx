import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapEvent {
  id: number;
  title: string;
  category: string;
  location: string;
  price: string;
  lat: number;
  lng: number;
}

interface MapProps {
  events: MapEvent[];
  onEventClick?: (eventId: number) => void;
  selectedEventId?: number;
}

function MapUpdater({ selectedEventId, events }: { selectedEventId?: number; events: MapEvent[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event) {
        map.setView([event.lat, event.lng], 15, { animate: true });
      }
    }
  }, [selectedEventId, events, map]);
  
  return null;
}

const getCategoryIcon = (category: string) => {
  const colors: Record<string, string> = {
    'События': '#0EA5E9',
    'Заведения': '#9b87f5',
    'Культура': '#F97316',
    'Развлечения': '#10B981',
    'Афиша': '#EC4899',
    'Маршруты': '#8B5CF6',
  };

  const color = colors[category] || '#0EA5E9';
  
  const svgIcon = `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z" 
            fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="12" r="5" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

export default function Map({ events, onEventClick, selectedEventId }: MapProps) {
  const mapRef = useRef<L.Map>(null);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-border">
      <MapContainer
        center={[48.4827, 135.0838]}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater selectedEventId={selectedEventId} events={events} />
        
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={getCategoryIcon(event.category)}
            eventHandlers={{
              click: () => onEventClick?.(event.id),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Категория:</span> {event.category}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Место:</span> {event.location}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Цена:</span> {event.price}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
