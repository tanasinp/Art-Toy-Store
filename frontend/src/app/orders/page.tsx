'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/arttoy';
import { format } from 'date-fns';
import { Package, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    artToyId: '1',
    orderAmount: 2,
    createdAt: '2025-11-10',
    status: 'pending',
    artToy: {
      id: '1',
      sku: 'AT-001',
      name: 'Cosmic Explorer',
      description: 'Limited edition space-themed collectible',
      arrivalDate: '2025-12-01',
      availableQuota: 50,
      posterPicture:
        'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500&q=80',
      price: 299,
    },
  },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleEdit = (orderId: string) => {
    toast.info('Edit order functionality - to be implemented');
  };

  const handleDelete = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    toast.success('Order cancelled successfully');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Pre-Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage your art toy pre-orders
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {order.artToy && (
                      <img
                        src={order.artToy.posterPicture}
                        alt={order.artToy.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {order.artToy?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order.id}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(order.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground">
                        {order.artToy?.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status?.toUpperCase() || 'PENDING'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>Quantity: {order.orderAmount}</span>
                        </div>
                        <span className="text-muted-foreground">
                          Ordered: {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </span>
                        {order.artToy?.price && (
                          <span className="font-semibold">
                            Total: ${order.artToy.price * order.orderAmount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">
                Start exploring our collection and place your first pre-order!
              </p>
              <Button asChild className="mt-4">
                <Link href="/">Browse Art Toys</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
