'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Package, ArrowLeft, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';

const mockArtToy = {
  id: '1',
  sku: 'AT-001',
  name: 'Cosmic Explorer',
  description:
    'Limited edition space-themed collectible figure with LED features. This stunning piece combines artistic craftsmanship with modern technology, featuring intricate details and premium materials. Perfect for collectors and enthusiasts alike.',
  arrivalDate: '2025-12-01',
  availableQuota: 50,
  posterPicture:
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&q=80',
  price: 299,
};

export default function ArtToyDetail() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [artToy] = useState(mockArtToy);

  const isAvailable = artToy.availableQuota > 0;
  const arrivalDate = new Date(artToy.arrivalDate);
  const maxQuantity = Math.min(5, artToy.availableQuota);

  const handlePreOrder = () => {
    if (!isAuthenticated) {
      toast.error('Please login to place a pre-order');
      router.push('/login');
      return;
    }

    if (user?.role !== 'member') {
      toast.error('Only members can place pre-orders');
      return;
    }

    toast.success(`Pre-order placed for ${quantity} unit(s)!`);
    router.push('/orders');
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(maxQuantity, quantity + delta));
    setQuantity(newQty);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted shadow-large">
              <img
                src={artToy.posterPicture}
                alt={artToy.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{artToy.name}</h1>
                <Badge
                  variant={isAvailable ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {isAvailable ? 'Available' : 'Sold Out'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">SKU: {artToy.sku}</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {artToy.description}
            </p>

            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Arrival Date:</span>
                  </div>
                  <span className="font-medium">
                    {format(arrivalDate, 'MMMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Available Quota:</span>
                  </div>
                  <span className="font-medium">{artToy.availableQuota} units</span>
                </div>
              </CardContent>
            </Card>

            <div className="pt-4 border-t">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-3xl font-bold">${artToy.price}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm">
                    Quantity (max 5)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1 || !isAvailable}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1))
                        )
                      }
                      className="w-20 text-center"
                      min={1}
                      max={maxQuantity}
                      disabled={!isAvailable}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity || !isAvailable}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handlePreOrder}
                disabled={!isAvailable}
              >
                {isAvailable ? 'Place Pre-Order' : 'Out of Stock'}
              </Button>

              {!isAuthenticated && isAvailable && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Please{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    login
                  </Link>{' '}
                  to place a pre-order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
