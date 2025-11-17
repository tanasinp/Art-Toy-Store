import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArtToy } from "@/types/arttoy";
import Link from "next/link";
import { Calendar, Package } from "lucide-react";
import { format } from "date-fns";

interface ArtToyCardProps {
  artToy: ArtToy;
}

const ArtToyCard = ({ artToy }: ArtToyCardProps) => {
  const isAvailable = artToy.availableQuota > 0;
  const arrivalDate = new Date(artToy.arrivalDate);

  return (
    <Card className="overflow-hidden hover:shadow-large transition-all duration-300 group">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={artToy.posterPicture}
          alt={artToy.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{artToy.name}</h3>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Sold Out"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {artToy.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(arrivalDate, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{artToy.availableQuota} left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" disabled={!isAvailable}>
          <Link href={`/arttoy/${artToy._id}`}>
            {isAvailable ? "View Details" : "Out of Stock"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtToyCard;
