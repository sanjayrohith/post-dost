'use client';

import { useState } from 'react';
import { Search, MapPin, Clock, Star, Phone, Globe } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviews: number;
  phone?: string;
  website?: string;
  openHours: string;
  image: string;
  description: string;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock business data for demonstration - Chennai businesses
  const mockBusinesses: Business[] = [
    {
      id: '1',
      name: 'Saravana Bhavan',
      category: 'South Indian Restaurant',
      address: '77, Usman Rd, T. Nagar, Chennai, Tamil Nadu 600017',
      rating: 4.6,
      reviews: 1256,
      phone: '+91-44-2434-5678',
      website: 'www.saravanabhavan.com',
      openHours: '7:00 AM - 11:00 PM',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      description: 'World-famous South Indian restaurant chain serving authentic Tamil Nadu cuisine. Known for filter coffee, dosas, and traditional vegetarian meals.'
    },
    {
      id: '2',
      name: 'Apollo Hospitals',
      category: 'Healthcare',
      address: '21, Greams Ln, Off Greams Road, Chennai, Tamil Nadu 600006',
      rating: 4.3,
      reviews: 892,
      phone: '+91-44-2829-3333',
      website: 'www.apollohospitals.com',
      openHours: '24/7',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop',
      description: 'Leading multi-specialty hospital providing world-class healthcare services with advanced medical technology and expert doctors.'
    },
    {
      id: '3',
      name: 'Ravi Coffee Works',
      category: 'Coffee Shop',
      address: '12, Luz Church Rd, Mylapore, Chennai, Tamil Nadu 600004',
      rating: 4.8,
      reviews: 342,
      phone: '+91-44-2499-1234',
      openHours: '6:00 AM - 9:00 PM',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
      description: 'Traditional South Indian coffee shop famous for filter coffee, crispy vadas, and authentic Mylapore experience since 1962.'
    },
    {
      id: '4',
      name: 'Infosys Chennai',
      category: 'IT Company',
      address: 'Rajiv Gandhi Salai, Sholinganallur, Chennai, Tamil Nadu 600119',
      rating: 4.2,
      reviews: 1567,
      phone: '+91-44-3352-2000',
      website: 'www.infosys.com',
      openHours: '9:00 AM - 6:00 PM',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      description: 'Global leader in next-generation digital services and consulting. Major IT hub providing software development and technology solutions.'
    },
    {
      id: '5',
      name: 'Kumar Tailors',
      category: 'Tailoring Services',
      address: '45, Ranganathan St, T. Nagar, Chennai, Tamil Nadu 600017',
      rating: 4.7,
      reviews: 203,
      phone: '+91-44-2434-7890',
      openHours: '9:00 AM - 9:00 PM',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      description: 'Expert tailoring services specializing in traditional South Indian clothing, custom suits, and alterations. Family business since 1975.'
    },
    {
      id: '6',
      name: 'Loyola College',
      category: 'Educational Institution',
      address: 'Sterling Rd, Nungambakkam, Chennai, Tamil Nadu 600034',
      rating: 4.5,
      reviews: 756,
      phone: '+91-44-2817-8200',
      website: 'www.loyolacollege.edu',
      openHours: '8:00 AM - 5:00 PM',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
      description: 'Prestigious autonomous college affiliated to University of Madras, known for excellence in arts, science, and commerce education.'
    },
    {
      id: '7',
      name: 'Spencer Plaza',
      category: 'Shopping Mall',
      address: '769, Anna Salai, Thousand Lights, Chennai, Tamil Nadu 600002',
      rating: 4.1,
      reviews: 1834,
      phone: '+91-44-2852-1234',
      website: 'www.spencerplaza.in',
      openHours: '10:00 AM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      description: 'One of Chennai\'s oldest and largest shopping malls featuring fashion, electronics, food court, and entertainment options.'
    },
    {
      id: '8',
      name: 'Woodlands Restaurant',
      category: 'Multi-Cuisine Restaurant',
      address: '30, Dr Radhakrishnan Salai, Mylapore, Chennai, Tamil Nadu 600004',
      rating: 4.4,
      reviews: 967,
      phone: '+91-44-2811-5678',
      website: 'www.woodlandsrestaurant.com',
      openHours: '11:00 AM - 11:00 PM',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      description: 'Classic Chennai restaurant serving both South Indian and North Indian cuisine in an elegant ambiance. Famous for their thalis and desserts.'
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setBusinesses(mockBusinesses);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredBusinesses = mockBusinesses.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setBusinesses(filteredBusinesses);
      setIsLoading(false);
    }, 1000);
  };

  const handleExploreAll = () => {
    setSearchQuery('');
    setBusinesses(mockBusinesses);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Explore Chennai Businesses</h1>
          <p className="text-muted-foreground mb-6">
            Discover amazing local businesses in Chennai. From traditional eateries to modern IT companies, find what you need.
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for restaurants, shops, services..."
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
              onClick={handleExploreAll}
              className="px-6"
            >
              Explore All
            </Button>
          </div>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No businesses found. Try a different search term or explore all businesses.
              </p>
              <Button onClick={handleExploreAll}>
                Show All Businesses
              </Button>
            </div>
          )}

          {isLoading && (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <Image 
                  src={business.image} 
                  alt={business.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {business.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{business.rating}</span>
                    <span className="text-muted-foreground">({business.reviews})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {business.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{business.openHours}</span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={`https://${business.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {business.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}