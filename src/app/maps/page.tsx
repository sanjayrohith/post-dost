'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
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
  distance?: number; // Distance from user location in km
}

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export default function MapsPage() {
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
  const [zoom, setZoom] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]); // For sidebar display
  const [allBusinesses, setAllBusinesses] = useState<Place[]>([]); // For map pins
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [userLocationIcon, setUserLocationIcon] = useState<L.DivIcon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const setupLeaflet = async () => {
      setIsMounted(true);
      
      // Show all Chennai businesses on map by default
      setAllBusinesses(allChennaiBusinesses);
      
      // Fix Leaflet default markers in Next.js
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default;
        
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
    };
    
    setupLeaflet();
  }, []);

  // Chennai businesses for sidebar (all over Chennai)
  const mockPlaces: Place[] = [
    {
      id: '1',
      name: 'Saravana Bhavan',
      address: 'GST Road, Tambaram, Chennai, Tamil Nadu 600045',
      latitude: 12.9249,
      longitude: 80.1000,
      category: 'Restaurant'
    },
    {
      id: '2',
      name: 'Apollo Hospitals',
      address: 'Vandalur Main Road, Kundrathur, Chennai, Tamil Nadu 600069',
      latitude: 12.8500,
      longitude: 80.0800,
      category: 'Healthcare'
    },
    {
      id: '3',
      name: 'Express Avenue Mall',
      address: 'Royapettah, Chennai, Tamil Nadu 600014',
      latitude: 13.0569,
      longitude: 80.2600,
      category: 'Shopping Mall'
    },
    {
      id: '4',
      name: 'Phoenix MarketCity',
      address: 'Velachery Main Road, Chennai, Tamil Nadu 600042',
      latitude: 12.9935,
      longitude: 80.2207,
      category: 'Shopping Mall'
    },
    {
      id: '5',
      name: 'Hotel Rainforest',
      address: 'ECR Road, Chennai, Tamil Nadu 600119',
      latitude: 12.8386,
      longitude: 80.2707,
      category: 'Hotel'
    },
    {
      id: '6',
      name: 'Marina Beach',
      address: 'Marina Beach Road, Chennai, Tamil Nadu 600013',
      latitude: 13.0487,
      longitude: 80.2825,
      category: 'Tourist Attraction'
    },
    {
      id: '7',
      name: 'Infosys Chennai',
      address: 'Sholinganallur, Chennai, Tamil Nadu 600119',
      latitude: 12.9006,
      longitude: 80.2209,
      category: 'IT Company'
    },
    {
      id: '8',
      name: 'Spencer Plaza',
      address: 'Anna Salai, Chennai, Tamil Nadu 600002',
      latitude: 13.0596,
      longitude: 80.2606,
      category: 'Shopping Mall'
    },
    {
      id: '9',
      name: 'Chennai Central Station',
      address: 'Wall Tax Road, Chennai, Tamil Nadu 600003',
      latitude: 13.0827,
      longitude: 80.2785,
      category: 'Transportation'
    },
    {
      id: '10',
      name: 'Kapaleeshwarar Temple',
      address: 'Mylapore, Chennai, Tamil Nadu 600004',
      latitude: 13.0339,
      longitude: 80.2619,
      category: 'Religious Site'
    },
    {
      id: '11',
      name: 'TCS Chennai',
      address: 'Siruseri IT Park, Chennai, Tamil Nadu 600130',
      latitude: 12.8253,
      longitude: 80.2281,
      category: 'IT Company'
    },
    {
      id: '12',
      name: 'VGP Universal Kingdom',
      address: 'ECR, Chennai, Tamil Nadu 600041',
      latitude: 12.8247,
      longitude: 80.2471,
      category: 'Amusement Park'
    },
    {
      id: '13',
      name: 'Chennai Trade Centre',
      address: 'Nandambakkam, Chennai, Tamil Nadu 600089',
      latitude: 13.0067,
      longitude: 80.1709,
      category: 'Convention Center'
    },
    {
      id: '14',
      name: 'IIT Madras',
      address: 'Sardar Patel Road, Chennai, Tamil Nadu 600036',
      latitude: 12.9915,
      longitude: 80.2336,
      category: 'Educational Institution'
    },
    {
      id: '15',
      name: 'Dakshin Restaurant',
      address: 'ITC Grand Chola, Guindy, Chennai, Tamil Nadu 600032',
      latitude: 13.0067,
      longitude: 80.2206,
      category: 'Fine Dining'
    }
  ];

  // All India businesses for map pins (including additional Chennai pins)
  const allChennaiBusinesses: Place[] = [
    // Chennai businesses (same as sidebar)
    ...mockPlaces,
    
    // Additional Chennai map pins
    {
      id: 'ch1',
      name: 'Cognizant Chennai',
      address: 'Sholinganallur, Chennai, Tamil Nadu 600119',
      latitude: 12.8955,
      longitude: 80.2185,
      category: 'IT Company'
    },
    {
      id: 'ch2',
      name: 'Forum Vijaya Mall',
      address: 'Vadapalani, Chennai, Tamil Nadu 600026',
      latitude: 13.0514,
      longitude: 80.2137,
      category: 'Shopping Mall'
    },
    {
      id: 'ch3',
      name: 'Anna University',
      address: 'Guindy, Chennai, Tamil Nadu 600025',
      latitude: 13.0067,
      longitude: 80.2206,
      category: 'Educational Institution'
    },
    {
      id: 'ch4',
      name: 'Ampa Skywalk',
      address: 'Aminjikarai, Chennai, Tamil Nadu 600029',
      latitude: 13.0732,
      longitude: 80.2206,
      category: 'Shopping Mall'
    },
    {
      id: 'ch5',
      name: 'Chennai Airport',
      address: 'Tirusulam, Chennai, Tamil Nadu 600027',
      latitude: 12.9941,
      longitude: 80.1709,
      category: 'Transportation'
    },
    {
      id: 'ch6',
      name: 'Covelong Beach',
      address: 'Kanchipuram District, Tamil Nadu 603112',
      latitude: 12.7928,
      longitude: 80.2547,
      category: 'Beach Resort'
    },
    {
      id: 'ch7',
      name: 'Ramee Mall',
      address: 'Perungudi, Chennai, Tamil Nadu 600096',
      latitude: 12.9516,
      longitude: 80.2463,
      category: 'Shopping Mall'
    },
    {
      id: 'ch8',
      name: 'MIOT Hospital',
      address: '4/112, Mount Poonamalle Road, Chennai, Tamil Nadu 600089',
      latitude: 13.0732,
      longitude: 80.1992,
      category: 'Healthcare'
    },
    {
      id: 'ch9',
      name: 'Elliot\'s Beach',
      address: 'Besant Nagar, Chennai, Tamil Nadu 600090',
      latitude: 12.9986,
      longitude: 80.2669,
      category: 'Beach'
    },
    {
      id: 'ch10',
      name: 'Wipro Chennai',
      address: 'Sholinganallur, Chennai, Tamil Nadu 600119',
      latitude: 12.8969,
      longitude: 80.2239,
      category: 'IT Company'
    },
    {
      id: 'ch11',
      name: 'Grand Sweets',
      address: 'Adyar, Chennai, Tamil Nadu 600020',
      latitude: 13.0067,
      longitude: 80.2572,
      category: 'Sweet Shop'
    },
    {
      id: 'ch12',
      name: 'SRM University',
      address: 'Kattankulathur, Chennai, Tamil Nadu 603203',
      latitude: 12.8230,
      longitude: 80.0444,
      category: 'Educational Institution'
    },
    {
      id: 'ch13',
      name: 'Chennai Port',
      address: 'Royapuram, Chennai, Tamil Nadu 600013',
      latitude: 13.1067,
      longitude: 80.3000,
      category: 'Port'
    },
    {
      id: 'ch14',
      name: 'Murugan Idli Shop',
      address: 'GN Chetty Road, T. Nagar, Chennai, Tamil Nadu 600017',
      latitude: 13.0418,
      longitude: 80.2341,
      category: 'Restaurant'
    },
    {
      id: 'ch15',
      name: 'Loyola College',
      address: 'Sterling Road, Nungambakkam, Chennai, Tamil Nadu 600034',
      latitude: 13.0648,
      longitude: 80.2408,
      category: 'Educational Institution'
    },
    
    // Mumbai businesses
    {
      id: '16',
      name: 'Tata Consultancy Services',
      address: 'BKC, Mumbai, Maharashtra',
      latitude: 19.0596,
      longitude: 72.8656,
      category: 'IT Company'
    },
    {
      id: '17',
      name: 'Reliance Industries',
      address: 'Nariman Point, Mumbai, Maharashtra',
      latitude: 18.9220,
      longitude: 72.8347,
      category: 'Corporate'
    },
    {
      id: '18',
      name: 'Leopold Cafe',
      address: 'Colaba, Mumbai, Maharashtra',
      latitude: 18.9067,
      longitude: 72.8147,
      category: 'Restaurant'
    },
    
    // Delhi businesses
    {
      id: '19',
      name: 'Karim Restaurant',
      address: 'Jama Masjid, Old Delhi',
      latitude: 28.6507,
      longitude: 77.2334,
      category: 'Restaurant'
    },
    {
      id: '20',
      name: 'DLF Cyber City',
      address: 'Gurgaon, Haryana',
      latitude: 28.4595,
      longitude: 77.0266,
      category: 'IT Hub'
    },
    {
      id: '21',
      name: 'Connaught Place Market',
      address: 'Connaught Place, New Delhi',
      latitude: 28.6304,
      longitude: 77.2177,
      category: 'Shopping'
    },
    
    // Bangalore businesses
    {
      id: '22',
      name: 'Wipro Technologies',
      address: 'Electronic City, Bangalore, Karnataka',
      latitude: 12.8456,
      longitude: 77.6603,
      category: 'IT Company'
    },
    {
      id: '23',
      name: 'UB City Mall',
      address: 'Vittal Mallya Road, Bangalore, Karnataka',
      latitude: 12.9716,
      longitude: 77.5946,
      category: 'Shopping Mall'
    },
    {
      id: '24',
      name: 'MTR Restaurant',
      address: 'Lalbagh Road, Bangalore, Karnataka',
      latitude: 12.9698,
      longitude: 77.5855,
      category: 'Restaurant'
    },
    
    // Hyderabad businesses
    {
      id: '25',
      name: 'Microsoft Hyderabad',
      address: 'HITEC City, Hyderabad, Telangana',
      latitude: 17.4483,
      longitude: 78.3915,
      category: 'IT Company'
    },
    {
      id: '26',
      name: 'Paradise Restaurant',
      address: 'Secunderabad, Hyderabad, Telangana',
      latitude: 17.4399,
      longitude: 78.4983,
      category: 'Restaurant'
    },
    {
      id: '27',
      name: 'Inorbit Mall',
      address: 'Madhapur, Hyderabad, Telangana',
      latitude: 17.4435,
      longitude: 78.3772,
      category: 'Shopping Mall'
    },
    
    // Kolkata businesses
    {
      id: '28',
      name: 'Flurys Confectionery',
      address: 'Park Street, Kolkata, West Bengal',
      latitude: 22.5488,
      longitude: 88.3639,
      category: 'Bakery'
    },
    {
      id: '29',
      name: 'New Market',
      address: 'Lindsay Street, Kolkata, West Bengal',
      latitude: 22.5675,
      longitude: 88.3492,
      category: 'Shopping'
    },
    {
      id: '30',
      name: 'Techno India',
      address: 'Salt Lake City, Kolkata, West Bengal',
      latitude: 22.5726,
      longitude: 88.4309,
      category: 'Educational Institution'
    },
    
    // Pune businesses
    {
      id: '31',
      name: 'Infosys Pune',
      address: 'Hinjewadi, Pune, Maharashtra',
      latitude: 18.5912,
      longitude: 73.7389,
      category: 'IT Company'
    },
    {
      id: '32',
      name: 'German Bakery',
      address: 'Koregaon Park, Pune, Maharashtra',
      latitude: 18.5362,
      longitude: 73.8842,
      category: 'Bakery'
    },
    
    // Ahmedabad businesses
    {
      id: '33',
      name: 'Adani Group',
      address: 'Shantinagar, Ahmedabad, Gujarat',
      latitude: 23.0225,
      longitude: 72.5714,
      category: 'Corporate'
    },
    {
      id: '34',
      name: 'Manek Chowk',
      address: 'Old City, Ahmedabad, Gujarat',
      latitude: 23.0237,
      longitude: 72.5850,
      category: 'Food Market'
    },
    
    // Jaipur businesses
    {
      id: '35',
      name: 'Rajasthali Restaurant',
      address: 'MI Road, Jaipur, Rajasthan',
      latitude: 26.9124,
      longitude: 75.7873,
      category: 'Restaurant'
    },
    {
      id: '36',
      name: 'World Trade Park',
      address: 'JLN Marg, Jaipur, Rajasthan',
      latitude: 26.8467,
      longitude: 75.8056,
      category: 'Shopping Mall'
    },
    
    // Kochi businesses
    {
      id: '37',
      name: 'Lulu Mall',
      address: 'Edapally, Kochi, Kerala',
      latitude: 10.0261,
      longitude: 76.3104,
      category: 'Shopping Mall'
    },
    {
      id: '38',
      name: 'Kashi Art Cafe',
      address: 'Fort Kochi, Kerala',
      latitude: 9.9654,
      longitude: 76.2430,
      category: 'Cafe'
    },
    
    // Chandigarh businesses
    {
      id: '39',
      name: 'Elante Mall',
      address: 'Industrial Area, Chandigarh',
      latitude: 30.7078,
      longitude: 76.8092,
      category: 'Shopping Mall'
    },
    {
      id: '40',
      name: 'Sector 17 Market',
      address: 'Sector 17, Chandigarh',
      latitude: 30.7411,
      longitude: 76.7692,
      category: 'Shopping'
    },
    
    // Bhubaneswar businesses
    {
      id: '41',
      name: 'Esplanade One Mall',
      address: 'Rasulgarh, Bhubaneswar, Odisha',
      latitude: 20.2961,
      longitude: 85.8245,
      category: 'Shopping Mall'
    },
    {
      id: '42',
      name: 'Dalma Mall',
      address: 'Patia, Bhubaneswar, Odisha',
      latitude: 20.3459,
      longitude: 85.8237,
      category: 'Shopping Mall'
    }
  ];

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter mock places based on search query
      let filteredPlaces = mockPlaces.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Add distance calculation if user location is available
      if (userLocation) {
        filteredPlaces = filteredPlaces.map(place => ({
          ...place,
          distance: calculateDistance(
            userLocation[0], userLocation[1],
            place.latitude, place.longitude
          )
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      
      setPlaces(filteredPlaces);
      
      // If places found, center map on first result
      if (filteredPlaces.length > 0) {
        setCenter([filteredPlaces[0].latitude, filteredPlaces[0].longitude]);
        setZoom(15);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [searchQuery, userLocation, mockPlaces]);

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

          // Automatically show nearby places when location is set
          setTimeout(() => {
            const nearbyPlaces = mockPlaces.map(place => ({
              ...place,
              distance: calculateDistance(
                userPos[0], userPos[1],
                place.latitude, place.longitude
              )
            })).sort((a, b) => a.distance - b.distance)
              .filter(place => place.distance <= 20); // Show places within 20km
            
            // Update sidebar with nearby places only (from Chennai businesses)
            setPlaces(nearbyPlaces);
            
            // Update all map pins with distance information (ALL Chennai businesses)
            const allBusinessesWithDistance = allChennaiBusinesses.map(place => ({
              ...place,
              distance: calculateDistance(
                userPos[0], userPos[1],
                place.latitude, place.longitude
              )
            }));
            setAllBusinesses(allBusinessesWithDistance);
          }, 500);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please allow location access.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, [mockPlaces, allChennaiBusinesses]);

  const showAllPlaces = () => {
    let allPlaces = [...mockPlaces]; // Only Chennai businesses for sidebar
    
    // Add distance calculation if user location is available
    if (userLocation) {
      allPlaces = allPlaces.map(place => ({
        ...place,
        distance: calculateDistance(
          userLocation[0], userLocation[1],
          place.latitude, place.longitude
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      // Update map pins with distance info for ALL Chennai businesses
      const allBusinessesWithDistance = allChennaiBusinesses.map(place => ({
        ...place,
        distance: calculateDistance(
          userLocation[0], userLocation[1],
          place.latitude, place.longitude
        )
      }));
      setAllBusinesses(allBusinessesWithDistance);
    }
    
    setPlaces(allPlaces); // Show in sidebar
    setCenter([20.5937, 78.9629]); // Reset to India center
    setZoom(5);
  };

  const findNearbyPlaces = useCallback(() => {
    if (!userLocation) {
      alert('Please enable location access first by clicking "My Location".');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate distances and sort by proximity
      const nearbyPlaces = mockPlaces.map(place => ({
        ...place,
        distance: calculateDistance(
          userLocation[0], userLocation[1],
          place.latitude, place.longitude
        )
      })).sort((a, b) => a.distance - b.distance)
        .filter(place => place.distance <= 20); // Show places within 20km
      
      setPlaces(nearbyPlaces);
      setCenter(userLocation);
      setZoom(13);
      setIsLoading(false);
    }, 500);
  }, [userLocation, mockPlaces]);

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
          <h1 className="text-4xl font-bold text-primary mb-4">Explore Indian Businesses</h1>
          <p className="text-muted-foreground mb-6">
            Discover businesses across India and explore detailed Chennai businesses in the sidebar - from local shops to major enterprises
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
              onClick={findNearbyPlaces}
              className="px-4"
              disabled={!userLocation}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Near Me
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
                    
                    {/* Markers for all businesses */}
                    {allBusinesses.map((place) => (
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
                            {place.distance && (
                              <p className="text-xs text-gray-500 mt-2">
                                📍 {place.distance.toFixed(1)} km away
                              </p>
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
                <CardTitle className="text-lg">
                  {userLocation ? 'Places Near You' : 'Search Results'}
                </CardTitle>
                {userLocation && places.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Sorted by distance from your location
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {places.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-4">
                      {userLocation 
                        ? "No Chennai businesses found within 20km of your location" 
                        : "Chennai businesses are shown in the list below. All India businesses are shown on the map."
                      }
                    </p>
                    <Button onClick={showAllPlaces} size="sm">
                      {userLocation ? "Show All Businesses" : "Show All in List"}
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
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{place.name}</h4>
                          {place.distance && (
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                              {place.distance.toFixed(1)} km
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {place.address}
                        </p>
                        <div className="flex justify-between items-center">
                          {place.category && (
                            <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              {place.category}
                            </span>
                          )}
                          {place.distance && (
                            <span className="text-xs text-muted-foreground">
                              📍 {place.distance < 1 ? `${(place.distance * 1000).toFixed(0)}m` : `${place.distance.toFixed(1)}km`} away
                            </span>
                          )}
                        </div>
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
