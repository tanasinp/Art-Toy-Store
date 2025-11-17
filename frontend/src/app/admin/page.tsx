"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { ArtToy } from "@/types/arttoy";
import { format } from "date-fns";

const AdminDashboard = () => {
  const [artToys, setArtToys] = useState<ArtToy[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingToy, setEditingToy] = useState<ArtToy | null>(null);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    arrivalDate: "",
    availableQuota: 0,
    posterPicture: "",
  });

  useEffect(() => {
    const fetchArtToys = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/arttoys`
        );
        const json = await res.json();
        setArtToys(Array.isArray(json.data) ? json.data : []);
      } catch (error) {
        toast.error("Failed to fetch data");
        setArtToys([]);
      }
    };
    fetchArtToys();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const arrivalDate = new Date(formData.arrivalDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrivalDate < today) {
      toast.error("Arrival date cannot be earlier than today");
      return;
    }

    if (editingToy) {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/arttoys/${editingToy._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        const json = await res.json();
        if (res.ok && json.data) {
          setArtToys(
            artToys.map((toy) => (toy._id === editingToy._id ? json.data : toy))
          );
          toast.success("Art toy updated successfully");
        } else {
          toast.error(json.message || "Failed to update art toy");
          return;
        }
      } catch (error) {
        toast.error("Failed to update art toy");
        return;
      }
    } else {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/arttoys`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        const json = await res.json();
        if (res.ok && json.data) {
          setArtToys([...artToys, json.data]);
          toast.success("Art toy created successfully");
        } else {
          toast.error(json.message || "Failed to create art toy");
          return;
        }
      } catch (error) {
        toast.error("Failed to create art toy");
        return;
      }
    }

    resetForm();
  };

  const handleEdit = (toy: ArtToy) => {
    setEditingToy(toy);
    setFormData({
      sku: toy.sku,
      name: toy.name,
      description: toy.description,
      arrivalDate: toy.arrivalDate,
      availableQuota: toy.availableQuota,
      posterPicture: toy.posterPicture,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/arttoys/${_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      if (res.ok) {
        setArtToys(artToys.filter((toy) => toy._id !== _id));
        toast.success("Art toy deleted successfully");
      } else {
        toast.error(json.message || "Failed to delete art toy");
      }
    } catch {
      toast.error("Failed to delete art toy");
    }
  };

  const resetForm = () => {
    setFormData({
      sku: "",
      name: "",
      description: "",
      arrivalDate: "",
      availableQuota: 0,
      posterPicture: "",
    });
    setEditingToy(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your art toy inventory
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Art Toy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingToy ? "Edit Art Toy" : "Add New Art Toy"}
                </DialogTitle>
                <DialogDescription>
                  {editingToy
                    ? "Update the art toy details"
                    : "Create a new art toy listing"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableQuota">Available Quota</Label>
                    <Input
                      id="availableQuota"
                      type="number"
                      min="0"
                      value={formData.availableQuota}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availableQuota: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Arrival Date</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) =>
                      setFormData({ ...formData, arrivalDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posterPicture">Image URL</Label>
                  <Input
                    id="posterPicture"
                    type="url"
                    value={formData.posterPicture}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        posterPicture: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingToy ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {artToys.map((toy) => (
            <Card key={toy._id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={toy.posterPicture}
                    alt={toy.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{toy.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          SKU: {toy.sku}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(toy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(toy._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{toy.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">
                        Arrives:{" "}
                        {format(new Date(toy.arrivalDate), "MMM dd, yyyy")}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>{toy.availableQuota} units available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
