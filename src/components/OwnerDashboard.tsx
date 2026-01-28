import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Clock, DollarSign, ChefHat } from "lucide-react";

const OwnerDashboard = () => {
  const todayStats = [
    { label: "Total Orders", value: "127", change: "+12%", icon: BarChart3, trend: "up" },
    { label: "Revenue", value: "$2,847", change: "+8%", icon: DollarSign, trend: "up" },
    { label: "Active Staff", value: "8/12", change: "4 absent", icon: Users, trend: "neutral" },
    { label: "Avg. Prep Time", value: "14 min", change: "-2 min", icon: Clock, trend: "up" },
  ];

  const recentOrders = [
    { id: "#1247", platform: "Zomato", customer: "John Doe", amount: "$24.50", status: "preparing", time: "2 min ago" },
    { id: "#1248", platform: "Swiggy", customer: "Jane Smith", amount: "$31.25", status: "ready", time: "5 min ago" },
    { id: "#1249", platform: "Direct", customer: "Mike Johnson", amount: "$18.75", status: "delivered", time: "12 min ago" },
    { id: "#1250", platform: "UberEats", customer: "Sarah Wilson", amount: "$42.00", status: "preparing", time: "15 min ago" },
  ];

  const topItems = [
    { name: "Margherita Pizza", orders: 23, revenue: "$345.00" },
    { name: "Chicken Biryani", orders: 18, revenue: "$270.00" },
    { name: "Caesar Salad", orders: 15, revenue: "$187.50" },
    { name: "Butter Chicken", orders: 12, revenue: "$180.00" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-warning";
      case "ready": return "bg-success";
      case "delivered": return "bg-info";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {todayStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs ${stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-destructive' : 'text-warning'}`}>
                  {stat.change} from yesterday
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders from all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-sm text-primary">{order.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Top Selling Items
            </CardTitle>
            <CardDescription>Most popular items today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-primary font-medium">{item.revenue}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground items-center">
                    <span>{item.orders} orders</span>
                    <Progress value={(item.orders / 25) * 100} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your restaurant operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline">Update Menu</Button>
            <Button variant="outline">Staff Schedule</Button>
            <Button variant="outline">Inventory Check</Button>
            <Button variant="outline">Analytics</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
