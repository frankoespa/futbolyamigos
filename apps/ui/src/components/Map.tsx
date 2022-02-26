import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { icon } from 'leaflet'
import { useTheme } from '@mui/material';

const Map = () => {
    const iconMarker = icon({ iconUrl: './favicon-32x32.png', iconSize: [32, 32] });
    const theme = useTheme();
    return (
        <MapContainer center={[-33.01370, -60.66802]} zoom={16} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-33.01370, -60.66802]} icon={iconMarker}>
                <Popup>
                    Complejo El Torreón
                </Popup>
            </Marker>
            <Polygon pathOptions={{ color: theme.palette.secondary.main }} positions={[
                [-33.01348, -60.66934],
                [-33.01592, -60.66928],
                [-33.01551, -60.66793],
                [-33.01389, -60.66757],
                [-33.01346, -60.66843],
                [-33.01348, -60.66934]
            ]} />
        </MapContainer>
    )
}

export default Map;