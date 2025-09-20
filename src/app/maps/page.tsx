'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Navigation, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
});

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false
});

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false
});

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false
});

interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
}

export default function MapsPage() {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // New Delhi
  const [zoom, setZoom] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userLocationIcon, setUserLocationIcon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<any>();

  useEffect(() => {
    setIsMounted(true);
    
    // Fix Leaflet default markers in Next.js
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create custom user location icon
      const userIcon = L.divIcon({
        html: `
          <div style="
            background: linear-gradient(45deg, #3b82f6, #1d4ed8);
            border: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              background: white;
              border-radius: 50%;
              width: 6px;
              height: 6px;
            "></div>
          </div>
        `,
        className: 'user-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      setUserLocationIcon(userIcon);
    }
  }, []);

  // Mock data for demonstration - in real app, this would come from a geocoding API
  const mockPlaces: Place[] = [
    {
      id: '1',
      name: 'Red Fort',
      address: 'Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi',
      latitude: 28.6562,
      longitude: 77.2410,
      category: 'Tourist Attraction'
    },
    {
      id: '2',
      name: 'India Gate',
      address: 'Rajpath, India Gate, New Delhi',
      latitude: 28.6129,
      longitude: 77.2295,
      category: 'Monument'
    },
    {
      id: '3',
      name: 'Connaught Place',
      address: 'Connaught Place, New Delhi',
      latitude: 28.6304,
      longitude: 77.2177,
      category: 'Shopping'
    },
    {
      id: '4',
      name: 'Lotus Temple',
      address: 'Lotus Temple Rd, Bahapur, Shambhu Dayal Bagh, Kalkaji, New Delhi',
      latitude: 28.5535,
      longitude: 77.2588,
      category: 'Religious Site'
    },
    {
      id: '5',
      name: 'Qutub Minar',
      address: 'Qutb Minar, Mehrauli, New Delhi',
      latitude: 28.5245,
      longitude: 77.1855,
      category: 'Historical Monument'
    }
  ];

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter mock places based on search query
      const filteredPlaces = mockPlaces.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setPlaces(filteredPlaces);
      
      // If places found, center map on first result
      if (filteredPlaces.length > 0) {
        setCenter([filteredPlaces[0].latitude, filteredPlaces[0].longitude]);
        setZoom(15);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [searchQuery]);

  const handleMarkerClick = useCallback((place: Place) => {
    setCenter([place.latitude, place.longitude]);
    setZoom(16);
  }, []);

  const getCurrentLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos: [number, number] = [latitude, longitude];
          
          // Set state for markers and initial center
          setUserLocation(userPos);
          setCenter(userPos);
          setZoom(15);
          
          // Force map to fly to user location if map ref is available
          if (mapRef.current) {
            const map = mapRef.current;
            map.flyTo(userPos, 15, {
              duration: 1.5, // Smooth animation duration in seconds
              easeLinearity: 0.1
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  const showAllPlaces = () => {
    setPlaces(mockPlaces);
    setCenter([28.6139, 77.2090]); // Reset to Delhi center
    setZoom(11);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-4">Explore Maps</h1>
          <p className="text-muted-foreground mb-6">
            Discover local businesses and places of interest in your area using Leaflet Maps
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for places, businesses, or landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="px-6"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outline" 
              onClick={getCurrentLocation}
              className="px-4"
            >
              <Navigation className="h-4 w-4 mr-2" />
              My Location
            </Button>
            <Button 
              variant="outline" 
              onClick={showAllPlaces}
              className="px-4"
            >
              Show All
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="h-full relative">
                  <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* User Location Marker */}
                    {userLocation && userLocationIcon && (
                      <Marker
                        position={userLocation}
                        icon={userLocationIcon}
                      >
                        <Popup>
                          <div className="p-3 min-w-[180px] text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div className="bg-blue-600 text-white p-2 rounded-full mr-2">
                                <Navigation className="h-4 w-4" />
                              </div>
                              <h3 className="font-semibold text-lg">Your Location</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Latitude: {userLocation[0].toFixed(6)}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                              Longitude: {userLocation[1].toFixed(6)}
                            </p>
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                              📍 Current Position
                            </span>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                    
                    {/* Markers for search results */}
                    {places.map((place) => (
                      <Marker
                        key={place.id}
                        position={[place.latitude, place.longitude]}
                        eventHandlers={{
                          click: () => handleMarkerClick(place)
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                            {place.category && (
                              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {place.category}
                              </span>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Results Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                {places.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-4">
                      Search for places to see results here
                    </p>
                    <Button onClick={showAllPlaces} size="sm">
                      Show Popular Places
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {places.map((place) => (
                      <div
                        key={place.id}
                        className="p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => handleMarkerClick(place)}
                      >
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {place.address}
                        </p>
                        {place.category && (
                          <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                            {place.category}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
