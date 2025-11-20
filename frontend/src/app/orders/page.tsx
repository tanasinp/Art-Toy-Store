"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [orderAmount, setOrderAmount] = useState(1);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        setOrders(Array.isArray(json.data) ? json.data : []);
      } catch {
        toast.error("Failed to fetch orders");
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingOrder) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orders/${editingOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderAmount }),
        }
      );

      const json = await res.json();
      if (res.ok && json.data) {
        setOrders(
          orders.map((order) =>
            order._id === editingOrder._id ? json.data : order
          )
        );
        toast.success("Order updated successfully");
      } else {
        toast.error(json.message || "Failed to update order");
        return;
      }
    } catch {
      toast.error("Failed to update order");
    }

    resetForm();
  };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setOrderAmount(order.orderAmount);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orders/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== id));
        toast.success("Order cancelled");
      } else {
        toast.error(json.message || "Failed to cancel order");
      }
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const resetForm = () => {
    setOrderAmount(1);
    setEditingOrder(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your toy pre-orders
        </p>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
              <DialogDescription>
                Modify your pre-order amount (1–5)
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Order Amount</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(parseInt(e.target.value))}
                  required
                />
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Orders list */}
        <div className="grid gap-4">
          {orders.length === 0 && (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          )}

          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {order.artToy?.name}
                    </h3>
                    <div className="flex gap-3 text-sm">
                      <Badge variant="outline">Qty: {order.orderAmount}</Badge>
                      <Badge variant="outline">
                        Quota Left: {order?.artToy?.availableQuota}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      User: {order.user?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ordered on:{" "}
                      {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(order._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
