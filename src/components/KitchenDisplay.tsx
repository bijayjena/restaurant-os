import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle2, ChefHat } from "lucide-react";
import { useState } from "react";

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([
    { id: "#1251", platform: "Zomato", customer: "Alex Chen", items: [{ name: "Margherita Pizza", quantity: 1, special: "Extra cheese" }, { name: "Garlic Bread", quantity: 2, special: "" }], orderTime: "14:32", estimatedTime: 18, priority: "normal", status: "preparing" },
    { id: "#1252", platform: "Swiggy", customer: "Priya Sharma", items: [{ name: "Chicken Biryani", quantity: 1, special: "Medium spicy" }, { name: "Raita", quantity: 1, special: "" }], orderTime: "14:28", estimatedTime: 22, priority: "urgent", status: "preparing" },
    { id: "#1253", platform: "Direct", customer: "Tom Wilson", items: [{ name: "Caesar Salad", quantity: 1, special: "No croutons" }, { name: "Lemonade", quantity: 1, special: "" }], orderTime: "14:35", estimatedTime: 8, priority: "normal", status: "ready" },
    { id: "#1254", platform: "UberEats", customer: "Maria Garcia", items: [{ name: "Butter Chicken", quantity: 1, special: "" }, { name: "Naan", quantity: 2, special: "Garlic naan" }, { name: "Basmati Rice", quantity: 1, special: "" }], orderTime: "14:30", estimatedTime: 15, priority: "normal", status: "preparing" },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  const preparingOrders = orders.filter(o => o.status === "preparing");
  const readyOrders = orders.filter(o => o.status === "ready");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Orders", value: preparingOrders.length, icon: ChefHat, color: "text-warning" },
          { label: "Ready to Serve", value: readyOrders.length, icon: CheckCircle2, color: "text-success" },
          { label: "Avg Prep Time", value: "14 min", icon: Clock, color: "text-info" },
          { label: "Urgent Orders", value: "1", icon: AlertTriangle, color: "text-destructive" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className={order.priority === 'urgent' ? 'ring-2 ring-destructive/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{order.id}</CardTitle>
                <div className="flex items-center gap-2">
                  {order.priority === "urgent" && <div className="w-3 h-3 rounded-full bg-destructive" />}
                  <Badge variant="outline">{order.platform}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{order.customer}</span>
                <span>{order.orderTime}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <p className="font-medium">{item.quantity}x {item.name}</p>
                    {item.special && <p className="text-sm text-primary">{item.special}</p>}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{order.estimatedTime} min</span>
                </div>
                <Badge variant={order.status === "ready" ? "default" : "secondary"}>{order.status}</Badge>
              </div>
              <div className="flex gap-2 pt-2">
                {order.status === "preparing" && (
                  <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, "ready")}>Mark Ready</Button>
                )}
                {order.status === "ready" && (
                  <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, "completed")}>Complete</Button>
                )}
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplay;
