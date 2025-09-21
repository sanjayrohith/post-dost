'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Globe, 
  Calendar,
  ExternalLink,
  Navigation
} from 'lucide-react';
import Image from 'next/image';

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

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessDetailsModal({ 
  business, 
  isOpen, 
  onClose 
}: BusinessDetailsModalProps) {
  if (!business) return null;

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(business.address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCall = () => {
    if (business.phone) {
      window.location.href = `tel:${business.phone}`;
    }
  };

  const handleVisitWebsite = () => {
    if (business.website) {
      const url = business.website.startsWith('http') 
        ? business.website 
        : `https://${business.website}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{business.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Business details for {business.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-2 -mt-2">
          <Badge variant="secondary">
            {business.category}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Business Image */}
          <div className="relative h-64 w-full overflow-hidden rounded-lg">
            <Image 
              src={business.image} 
              alt={business.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{business.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({business.reviews} reviews)
              </span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {business.description}
            </p>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{business.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{business.openHours}</span>
              </div>

              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{business.phone}</span>
                </div>
              )}

              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{business.website}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleGetDirections}
              className="flex-1 flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </Button>

            {business.phone && (
              <Button 
                variant="outline"
                onClick={handleCall}
                className="flex-1 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
            )}

            {business.website && (
              <Button 
                variant="outline"
                onClick={handleVisitWebsite}
                className="flex-1 flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}