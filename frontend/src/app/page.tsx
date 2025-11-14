"use client";

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ArtToyCard from '@/components/ArtToyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { ArtToy } from '@/types/arttoy';

// Mock data - replace with API calls
const mockArtToys: ArtToy[] = [
  {
    id: '1',
    sku: 'AT-001',
    name: 'Cosmic Explorer',
    description: 'Limited edition space-themed collectible figure with LED features',
    arrivalDate: '2025-12-01',
    availableQuota: 50,
    posterPicture: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500&q=80',
    price: 299,
  },
  {
    id: '2',
    sku: 'AT-002',
    name: 'Urban Legend',
    description: 'Street art inspired designer toy with interchangeable parts',
    arrivalDate: '2025-11-20',
    availableQuota: 30,
    posterPicture: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=500&q=80',
    price: 199,
  },
  {
    id: '3',
    sku: 'AT-003',
    name: 'Neon Dreams',
    description: 'Glow-in-the-dark cyberpunk character with premium packaging',
    arrivalDate: '2025-11-25',
    availableQuota: 0,
    posterPicture: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    price: 249,
  },
  {
    id: '4',
    sku: 'AT-004',
    name: 'Forest Spirit',
    description: 'Nature-inspired design with hand-painted details',
    arrivalDate: '2025-12-10',
    availableQuota: 75,
    posterPicture: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80',
    price: 179,
  },
  {
    id: '5',
    sku: 'AT-005',
    name: 'Retro Wave',
    description: '80s inspired collectible with nostalgic aesthetics',
    arrivalDate: '2025-11-28',
    availableQuota: 40,
    posterPicture: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=500&q=80',
    price: 229,
  },
  {
    id: '6',
    sku: 'AT-006',
    name: 'Ocean Guardian',
    description: 'Marine life themed figure supporting ocean conservation',
    arrivalDate: '2025-12-05',
    availableQuota: 60,
    posterPicture: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80',
    price: 189,
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artToys] = useState<ArtToy[]>(mockArtToys);

  const filteredArtToys = artToys.filter((toy) =>
    toy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    toy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Discover Unique
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Art Toys </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Pre-order limited edition collectibles from renowned artists worldwide
            </p>
            <div className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search art toys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Art Toys Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Available Art Toys
            <span className="ml-2 text-muted-foreground text-lg">
              ({filteredArtToys.length})
            </span>
          </h2>
        </div>

        {filteredArtToys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtToys.map((artToy) => (
              <ArtToyCard key={artToy.id} artToy={artToy} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No art toys found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
