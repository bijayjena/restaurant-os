import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Clock, DollarSign, Package, Route } from "lucide-react";
import { useState } from "react";

const DeliveryInterface = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([
    { id: "#1251", customer: "Alex Chen", address: "123 Oak Street, Downtown", phone: "+1 (555) 123-4567", platform: "Zomato", amount: "$24.50", distance: "2.3 km", estimatedTime: "15 min", status: "picked_up", rider: "John Doe" },
    { id: "#1252", customer: "Priya Sharma", address: "456 Pine Avenue, Uptown", phone: "+1 (555) 987-6543", platform: "Swiggy", amount: "$31.25", distance: "1.8 km", estimatedTime: "12 min", status: "ready_for_pickup", rider: "Mike Johnson" },
    { id: "#1254", customer: "Maria Garcia", address: "789 Elm Drive, Eastside", phone: "+1 (555) 456-7890", platform: "UberEats", amount: "$42.00", distance: "3.1 km", estimatedTime: "18 min", status: "assigned", rider: "Sarah Wilson" },
  ]);

  const riders = [
    { name: "John Doe", status: "delivering", orders: 1, location: "Downtown", earnings: "$145.75", rating: 4.8 },
    { name: "Mike Johnson", status: "available", orders: 0, location: "Uptown", earnings: "$89.50", rating: 4.6 },
    { name: "Sarah Wilson", status: "en_route", orders: 1, location: "Eastside", earnings: "$203.25", rating: 4.9 },
    { name: "David Lee", status: "offline", orders: 0, location: "Westside", earnings: "$67.00", rating: 4.4 },
  ];

  const updateDeliveryStatus = (orderId: string, newStatus: string) => {
    setActiveDeliveries(d => d.map(del => del.id === orderId ? { ...del, status: newStatus } : del));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_pickup": return "bg-warning";
      case "assigned": return "bg-info";
      case "picked_up": return "bg-primary";
      case "delivered": return "bg-success";
      default: return "bg-muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready_for_pickup": return "Ready for Pickup";
      case "assigned": return "Assigned";
      case "picked_up": return "Picked Up";
      case "delivered": return "Delivered";
      default: return "Unknown";
    }
  };

  const getRiderStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "available": return "default";
      case "delivering": case "en_route": return "secondary";
      case "offline": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Deliveries", value: activeDeliveries.length, icon: Truck, color: "text-info" },
          { label: "Available Riders", value: riders.filter(r => r.status === 'available').length, icon: Package, color: "text-success" },
          { label: "Avg Delivery Time", value: "18 min", icon: Clock, color: "text-warning" },
          { label: "Total Earnings", value: "$505.50", icon: DollarSign, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><Truck className="h-5 w-5" /> Active Deliveries</h3>
          {activeDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{delivery.id}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(delivery.status)}`} />
                    <Badge variant="outline">{getStatusText(delivery.status)}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <CardDescription>{delivery.customer}</CardDescription>
                  <Badge variant="secondary">{delivery.platform}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm">{delivery.address}</p>
                    <p className="text-sm text-muted-foreground">{delivery.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "Amount", value: delivery.amount },
                    { label: "Distance", value: delivery.distance },
                    { label: "ETA", value: delivery.estimatedTime },
                  ].map(d => (
                    <div key={d.label}>
                      <p className="text-muted-foreground">{d.label}</p>
                      <p className="font-medium">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Rider: <span className="text-foreground">{delivery.rider}</span></p>
                  <div className="flex gap-2">
                    {delivery.status === "ready_for_pickup" && (
                      <Button size="sm" onClick={() => updateDeliveryStatus(delivery.id, "picked_up")}>Picked Up</Button>
                    )}
                    {delivery.status === "picked_up" && (
                      <Button size="sm" onClick={() => updateDeliveryStatus(delivery.id, "delivered")}>Delivered</Button>
                    )}
                    <Button size="sm" variant="outline">Track</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><Route className="h-5 w-5" /> Delivery Riders</h3>
          {riders.map((rider, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{rider.name}</h4>
                    <p className="text-sm text-muted-foreground">{rider.location}</p>
                  </div>
                  <Badge variant={getRiderStatusVariant(rider.status)}>{rider.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "Orders", value: rider.orders },
                    { label: "Earnings", value: rider.earnings },
                    { label: "Rating", value: `⭐ ${rider.rating}` },
                  ].map(d => (
                    <div key={d.label}>
                      <p className="text-muted-foreground">{d.label}</p>
                      <p className="font-medium">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">Assign Order</Button>
                  <Button size="sm" variant="outline" className="flex-1">Contact</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryInterface;
