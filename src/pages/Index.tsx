import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Users, Truck, Smartphone, BarChart3, Settings, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import OwnerDashboard from "@/components/OwnerDashboard";
import KitchenDisplay from "@/components/KitchenDisplay";
import StaffManagement from "@/components/StaffManagement";
import DeliveryInterface from "@/components/DeliveryInterface";
import CustomerApp from "@/components/CustomerApp";
import ThemeToggle from "@/components/ThemeToggle";

const MotionCard = motion.create(Card);

const Index = () => {
  const [activeView, setActiveView] = useState("landing");
  const navigate = useNavigate();

  const dashboardOptions = [
    { id: "owner", label: "Owner Dashboard", icon: BarChart3, description: "Analytics, orders & revenue overview" },
    { id: "kitchen", label: "Kitchen Display", icon: ChefHat, description: "Real-time order management" },
    { id: "staff", label: "Staff Management", icon: Users, description: "Scheduling & performance" },
    { id: "delivery", label: "Delivery Interface", icon: Truck, description: "Track riders & deliveries" },
    { id: "customer", label: "Customer App", icon: Smartphone, description: "Browse menu & order" },
  ];

  const features = [
    { icon: ChefHat, title: "Kitchen Management", description: "Real-time order tracking, inventory management, and kitchen workflow optimization" },
    { icon: Users, title: "Staff Coordination", description: "Employee scheduling, task management, and performance tracking in one place" },
    { icon: Truck, title: "Delivery Integration", description: "Seamless integration with Zomato, Swiggy, and other delivery platforms" },
    { icon: BarChart3, title: "Advanced Analytics", description: "Comprehensive reporting and insights to optimize your restaurant operations" },
    { icon: Settings, title: "Third-party APIs", description: "Connect with payment gateways, POS systems, and restaurant platforms" },
    { icon: Smartphone, title: "Customer Experience", description: "Mobile-first ordering system with real-time tracking and notifications" },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case "owner": return <OwnerDashboard />;
      case "kitchen": return <KitchenDisplay />;
      case "staff": return <StaffManagement />;
      case "delivery": return <DeliveryInterface />;
      case "customer": return <CustomerApp />;
      default: return null;
    }
  };

  if (activeView !== "landing") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <Button variant="outline" onClick={() => setActiveView("landing")}>
              ← Back to Overview
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {dashboardOptions.find(d => d.id === activeView)?.label}
            </h1>
            <ThemeToggle />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">RestaurantOS</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <Badge variant="secondary" className="mb-4">Complete Restaurant Management Solution</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Streamline Your{" "}
            <span className="text-primary">Restaurant Operations</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Unified platform connecting restaurants, staff, delivery partners, and customers.
            Seamlessly integrate with Zomato, Swiggy, and other platforms.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button size="lg" className="px-8" onClick={() => navigate("/signup")}>Start Free Trial</Button>
            <Button size="lg" variant="outline">Watch Demo</Button>
          </motion.div>
        </motion.section>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {dashboardOptions.map((dashboard, index) => {
            const IconComponent = dashboard.icon;
            return (
              <MotionCard
                key={dashboard.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveView(dashboard.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CardHeader className="text-center">
                  <motion.div
                    className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="h-7 w-7 text-primary" />
                  </motion.div>
                  <CardTitle>{dashboard.label}</CardTitle>
                  <CardDescription>{dashboard.description}</CardDescription>
                </CardHeader>
              </MotionCard>
            );
          })}
        </section>

        {/* Features */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-foreground mb-12"
          >
            Everything You Need
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <MotionCard
                  key={index}
                  className="hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <CardHeader>
                    <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </MotionCard>
              );
            })}
          </div>
        </section>

        {/* Integration Partners */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">Seamlessly Integrates With</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Zomato", "Swiggy", "UberEats", "DoorDash", "Stripe", "PayPal"].map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Badge variant="secondary" className="px-5 py-2 text-sm">{partner}</Badge>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center bg-primary/5 border border-primary/20 rounded-2xl p-12"
        >
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Restaurant?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants already using our platform to streamline operations.
          </p>
          <Button size="lg" className="px-8" onClick={() => navigate("/signup")}>Get Started Today</Button>
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
