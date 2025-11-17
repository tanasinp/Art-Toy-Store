"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import ArtToyCard from "@/components/ArtToyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { ArtToy } from "@/types/arttoy";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize artToys state as an empty array to be populated by the API call
  const [artToys, setArtToys] = useState<ArtToy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchArtToys = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/arttoys`);

        if (!response.ok) {
          throw new Error("Failed to fetch art toys.");
        }
        const responseData = await response.json();
        // Map API response structure to the ArtToy interface
        const fetchedArtToys: ArtToy[] = responseData.data;

        setArtToys(fetchedArtToys);
      } catch (error) {
        console.error("Error fetching art toys:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtToys();
  }, [API_BASE_URL]);

  const filteredArtToys = artToys.filter(
    (toy) =>
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
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {" "}
                Art Toys{" "}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Pre-order limited edition collectibles from renowned artists
              worldwide
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
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-primary text-lg">Loading art toys...</p>
          </div>
        ) : filteredArtToys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {" "}
            {filteredArtToys.map((artToy) => (
              <ArtToyCard key={artToy._id} artToy={artToy} />
            ))}{" "}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No art toys found matching your search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
