import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

const timeSlots = [
  {
    id: "SLOT001",
    startTime: "08:00",
    endTime: "09:00",
    duration: "1 hour",
    maxBookings: 5,
    currentBookings: 3,
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SLOT002",
    startTime: "09:00",
    endTime: "10:00",
    duration: "1 hour",
    maxBookings: 5,
    currentBookings: 5,
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SLOT003",
    startTime: "10:00",
    endTime: "11:00",
    duration: "1 hour", 
    maxBookings: 5,
    currentBookings: 2,
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SLOT004",
    startTime: "11:00",
    endTime: "12:00",
    duration: "1 hour",
    maxBookings: 5,
    currentBookings: 4,
    status: "active",
    createdDate: "2023-12-01"
  },
  {
    id: "SLOT005",
    startTime: "12:00",
    endTime: "13:00",
    duration: "1 hour",
    maxBookings: 5,
    currentBookings: 0,
    status: "inactive",
    createdDate: "2023-12-01"
  },
  {
    id: "SLOT006",
    startTime: "14:00",
    endTime: "15:00",
    duration: "1 hour",
    maxBookings: 5,
    currentBookings: 1,
    status: "active",
    createdDate: "2023-12-01"
  }
];

const getStatusBadge = (status: string) => {
  return status === 'active' 
    ? <Badge className="bg-success-light text-success border-success/20">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    : <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>;
};

const getAvailabilityBadge = (current: number, max: number) => {
  const percentage = (current / max) * 100;
  
  if (percentage >= 100) {
    return <Badge className="bg-destructive-light text-destructive border-destructive/20">Full</Badge>;
  } else if (percentage >= 80) {
    return <Badge className="bg-warning-light text-warning border-warning/20">Almost Full</Badge>;
  } else {
    return <Badge className="bg-success-light text-success border-success/20">Available</Badge>;
  }
};

export default function Slots() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredSlots = timeSlots.filter(slot => 
    slot.startTime.includes(searchTerm) ||
    slot.endTime.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Time Slots</h1>
          <p className="text-muted-foreground mt-1">Manage booking time slots</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-primary to-primary-hover"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slot
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Slots</p>
                <p className="text-2xl font-bold text-foreground">{filteredSlots.length}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Slots</p>
                <p className="text-2xl font-bold text-success">
                  {filteredSlots.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Slots</p>
                <p className="text-2xl font-bold text-destructive">
                  {filteredSlots.filter(s => s.currentBookings >= s.maxBookings).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-info">
                  {filteredSlots.filter(s => s.currentBookings < s.maxBookings && s.status === 'active').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Add New Time Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input type="time" placeholder="Start Time" />
              <Input type="time" placeholder="End Time" />
              <Input type="number" placeholder="Max Bookings" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Create Slot</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <Input
            placeholder="Search time slots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11"
          />
        </CardContent>
      </Card>

      {/* Slots Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Time Slots ({filteredSlots.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Time Slot</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <div className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {slot.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{slot.currentBookings}</span>
                      <span className="text-muted-foreground"> / {slot.maxBookings}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getAvailabilityBadge(slot.currentBookings, slot.maxBookings)}</TableCell>
                  <TableCell>{getStatusBadge(slot.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}