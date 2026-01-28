import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";

const StaffManagement = () => {
  const staff = [
    { id: 1, name: "Sarah Johnson", role: "Head Chef", status: "active", shift: "Morning", hours: "8:00 AM - 4:00 PM", performance: 95, tasksCompleted: 12, totalTasks: 15 },
    { id: 2, name: "Mike Chen", role: "Sous Chef", status: "active", shift: "Evening", hours: "2:00 PM - 10:00 PM", performance: 88, tasksCompleted: 8, totalTasks: 10 },
    { id: 3, name: "Emma Davis", role: "Server", status: "break", shift: "Morning", hours: "9:00 AM - 5:00 PM", performance: 92, tasksCompleted: 15, totalTasks: 18 },
    { id: 4, name: "James Wilson", role: "Kitchen Assistant", status: "absent", shift: "Evening", hours: "3:00 PM - 11:00 PM", performance: 76, tasksCompleted: 0, totalTasks: 8 },
    { id: 5, name: "Lisa Rodriguez", role: "Server", status: "active", shift: "Evening", hours: "4:00 PM - 12:00 AM", performance: 90, tasksCompleted: 10, totalTasks: 12 },
    { id: 6, name: "David Kim", role: "Delivery Coordinator", status: "active", shift: "Full Day", hours: "10:00 AM - 6:00 PM", performance: 85, tasksCompleted: 20, totalTasks: 25 },
  ];

  const shifts = [
    { name: "Morning Shift", time: "8:00 AM - 4:00 PM", staff: 4, capacity: 6, status: "understaffed" },
    { name: "Evening Shift", time: "2:00 PM - 10:00 PM", staff: 5, capacity: 6, status: "good" },
    { name: "Night Shift", time: "10:00 PM - 6:00 AM", staff: 2, capacity: 3, status: "good" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success";
      case "break": return "bg-warning";
      case "absent": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "break": return "On Break";
      case "absent": return "Absent";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: "12", icon: Users, color: "text-info" },
          { label: "Present Today", value: "8", icon: CheckCircle2, color: "text-success" },
          { label: "On Break", value: "1", icon: Clock, color: "text-warning" },
          { label: "Absent", value: "4", icon: XCircle, color: "text-destructive" },
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

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff List</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`} />
                      <Badge variant="outline">{getStatusText(member.status)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Shift", value: member.shift },
                    { label: "Hours", value: member.hours },
                    { label: "Tasks", value: `${member.tasksCompleted}/${member.totalTasks}` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}:</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance:</span>
                    <span className={`font-medium ${member.performance >= 90 ? 'text-success' : member.performance >= 80 ? 'text-warning' : 'text-destructive'}`}>
                      {member.performance}%
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">Assign Task</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          {shifts.map((shift, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{shift.name}</CardTitle>
                    <CardDescription>{shift.time}</CardDescription>
                  </div>
                  <Badge variant={shift.status === "good" ? "default" : "destructive"}>{shift.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{shift.staff}</p>
                      <p className="text-sm text-muted-foreground">Current</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">{shift.capacity}</p>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage Shift</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffManagement;
