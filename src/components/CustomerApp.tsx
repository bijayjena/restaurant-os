import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Search, Star, Clock, Heart, Truck } from "lucide-react";
import { useState } from "react";

const CustomerApp = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    { id: 1, name: "Margherita Pizza", description: "Fresh mozzarella, tomato sauce, and basil on thin crust", price: 18.50, category: "Pizza", image: "🍕", rating: 4.8, prepTime: "15-20 min", popular: true, vegetarian: true },
    { id: 2, name: "Chicken Biryani", description: "Aromatic basmati rice with spiced chicken and saffron", price: 22.75, category: "Indian", image: "🍛", rating: 4.9, prepTime: "25-30 min", popular: true, vegetarian: false },
    { id: 3, name: "Caesar Salad", description: "Crisp romaine lettuce with parmesan and croutons", price: 14.25, category: "Salads", image: "🥗", rating: 4.6, prepTime: "5-10 min", popular: false, vegetarian: true },
    { id: 4, name: "Butter Chicken", description: "Tender chicken in rich tomato and cream curry", price: 19.50, category: "Indian", image: "🍗", rating: 4.7, prepTime: "20-25 min", popular: true, vegetarian: false },
    { id: 5, name: "Chocolate Brownie", description: "Warm chocolate brownie with vanilla ice cream", price: 8.75, category: "Desserts", image: "🍫", rating: 4.5, prepTime: "10-15 min", popular: false, vegetarian: true },
    { id: 6, name: "Fish Tacos", description: "Grilled fish with fresh salsa and lime crema", price: 16.25, category: "Mexican", image: "🌮", rating: 4.4, prepTime: "15-20 min", popular: false, vegetarian: false },
  ];

  const orderHistory = [
    { id: "#1234", date: "2024-01-15", items: ["Margherita Pizza", "Caesar Salad"], total: "$32.75", status: "Delivered", rating: 5 },
    { id: "#1189", date: "2024-01-10", items: ["Chicken Biryani", "Butter Chicken"], total: "$42.25", status: "Delivered", rating: 4 },
    { id: "#1156", date: "2024-01-08", items: ["Fish Tacos", "Chocolate Brownie"], total: "$25.00", status: "Delivered", rating: 5 },
  ];

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, newQty: number) => {
    if (newQty === 0) { setCart(prev => prev.filter(i => i.id !== itemId)); return; }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const getTotalPrice = () => cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2);

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(menuItems.map(item => item.category))];

  const MenuItemCard = ({ item }: { item: typeof menuItems[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{item.image}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {item.name}
                  {item.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                  {item.vegetarian && <span className="text-xs">🌱</span>}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-warning" />{item.rating}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />{item.prepTime}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${item.price}</p>
                <Button size="sm" className="mt-2" onClick={() => addToCart(item)}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Bella Vista Restaurant</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning" /> 4.8 (1,250+ reviews)</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 25-35 min delivery</span>
                <span className="flex items-center gap-1"><Truck className="h-4 w-4" /> Free delivery over $25</span>
              </CardDescription>
            </div>
            <Button variant="outline"><Heart className="h-4 w-4 mr-2" /> Favorite</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              {categories.map(c => <TabsTrigger key={c} value={c.toLowerCase()}>{c}</TabsTrigger>)}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map(item => <MenuItemCard key={item.id} item={item} />)}
              </div>
            </TabsContent>

            {categories.map(category => (
              <TabsContent key={category} value={category.toLowerCase()} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.filter(i => i.category === category).map(item => <MenuItemCard key={item.id} item={item} />)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Your Order ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-sm">${item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                    <Button className="w-full mt-3">Proceed to Checkout</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div key={order.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge>{order.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{order.date}</p>
                      <p>{order.items.join(", ")}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{order.total}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < order.rating ? 'text-warning' : 'text-muted'}`} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerApp;
