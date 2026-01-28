import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChefHat, Store, MapPin, Clock, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import type { Tenant } from "@/lib/supabase";

const CUISINE_TYPES = [
  "Indian", "Chinese", "Italian", "Mexican", "Japanese",
  "Thai", "American", "French", "Mediterranean", "Korean",
  "Middle Eastern", "Ethiopian", "Multi-cuisine", "Other",
];

const STEPS = [
  { id: 1, label: "Restaurant Info", icon: Store },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Operations", icon: Clock },
  { id: 4, label: "Confirm", icon: Check },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    cuisine_type: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    seating_capacity: "",
    opening_time: "09:00",
    closing_time: "23:00",
    delivery_enabled: true,
    dine_in_enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const { setTenant } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name"
        ? { slug: (value as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
        : {}),
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return form.name && form.cuisine_type && form.phone;
      case 2: return form.address && form.city;
      case 3: return true;
      default: return true;
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    // TODO: Replace with supabase insert into tenants, tenant_members, user_roles
    await new Promise((r) => setTimeout(r, 1500));
    const mockTenant: Tenant = {
      id: "mock-tenant-id",
      name: form.name,
      slug: form.slug,
      cuisine_type: form.cuisine_type,
      address: `${form.address}, ${form.city}, ${form.state} ${form.pincode}`,
      phone: form.phone,
      email: form.email,
      status: "active",
      settings: {
        seating_capacity: form.seating_capacity,
        opening_time: form.opening_time,
        closing_time: form.closing_time,
        delivery_enabled: form.delivery_enabled,
        dine_in_enabled: form.dine_in_enabled,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTenant(mockTenant);
    setLoading(false);
    navigate("/");
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 4)); };
  const goPrev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">RestaurantOS</span>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={`w-8 h-0.5 ${isDone ? "bg-primary" : "bg-border"} transition-colors`} />
                )}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <Card>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Tell us about your restaurant</CardTitle>
                    <CardDescription>Basic information to set up your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Restaurant Name *</Label>
                      <Input placeholder="My Awesome Restaurant" value={form.name} onChange={(e) => update("name", e.target.value)} />
                      {form.slug && (
                        <p className="text-xs text-muted-foreground">
                          URL: restaurantos.app/<span className="text-primary font-medium">{form.slug}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Cuisine Type *</Label>
                      <Select value={form.cuisine_type} onValueChange={(v) => update("cuisine_type", v)}>
                        <SelectTrigger><SelectValue placeholder="Select cuisine" /></SelectTrigger>
                        <SelectContent>
                          {CUISINE_TYPES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone *</Label>
                        <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="info@restaurant.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle>Where are you located?</CardTitle>
                    <CardDescription>Your restaurant's address for customers and delivery</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Street Address *</Label>
                      <Textarea placeholder="123 Main Street, Floor 2" value={form.address} onChange={(e) => update("address", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input placeholder="Mumbai" value={form.city} onChange={(e) => update("city", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input placeholder="Maharashtra" value={form.state} onChange={(e) => update("state", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Pincode</Label>
                        <Input placeholder="400001" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle>Operational details</CardTitle>
                    <CardDescription>Configure your restaurant's working hours and services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Opening Time</Label>
                        <Input type="time" value={form.opening_time} onChange={(e) => update("opening_time", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Closing Time</Label>
                        <Input type="time" value={form.closing_time} onChange={(e) => update("closing_time", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Seating Capacity</Label>
                      <Input type="number" placeholder="50" value={form.seating_capacity} onChange={(e) => update("seating_capacity", e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                      <Badge
                        variant={form.dine_in_enabled ? "default" : "secondary"}
                        className="cursor-pointer px-4 py-2"
                        onClick={() => update("dine_in_enabled", !form.dine_in_enabled)}
                      >
                        {form.dine_in_enabled ? "✓ " : ""}Dine-in
                      </Badge>
                      <Badge
                        variant={form.delivery_enabled ? "default" : "secondary"}
                        className="cursor-pointer px-4 py-2"
                        onClick={() => update("delivery_enabled", !form.delivery_enabled)}
                      >
                        {form.delivery_enabled ? "✓ " : ""}Delivery
                      </Badge>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 4 && (
                <>
                  <CardHeader>
                    <CardTitle>Everything looks good!</CardTitle>
                    <CardDescription>Review your restaurant details before we set things up</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Restaurant</span>
                        <span className="font-medium text-foreground">{form.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Cuisine</span>
                        <span className="font-medium text-foreground">{form.cuisine_type}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium text-foreground">{form.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">
                          {form.address}, {form.city}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Hours</span>
                        <span className="font-medium text-foreground">{form.opening_time} – {form.closing_time}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Services</span>
                        <div className="flex gap-2">
                          {form.dine_in_enabled && <Badge variant="secondary">Dine-in</Badge>}
                          {form.delivery_enabled && <Badge variant="secondary">Delivery</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between p-6 pt-2">
            <Button variant="ghost" onClick={goPrev} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={goNext} disabled={!canProceed()}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={loading}>
                {loading ? "Setting up…" : "Launch Restaurant 🚀"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
