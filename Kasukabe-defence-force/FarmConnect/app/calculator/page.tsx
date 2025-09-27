"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calculator, Truck, Clock, MapPin, Fuel, IndianRupee } from "lucide-react"
import Link from "next/link"

export default function CalculatorPage() {
  const [transportData, setTransportData] = useState({
    distance: "",
    fuelPrice: "95",
    vehicleType: "",
    weight: "",
    laborCost: "",
  })

  const [timeData, setTimeData] = useState({
    cropType: "",
    quantity: "",
    workers: "",
    taskType: "",
  })

  const [results, setResults] = useState({
    transportCost: 0,
    timeEstimate: 0,
    totalCost: 0,
  })

  const vehicleTypes = [
    { value: "bike", label: "Motorcycle", capacity: "50kg", mileage: 45 },
    { value: "auto", label: "Auto Rickshaw", capacity: "200kg", mileage: 25 },
    { value: "tempo", label: "Tempo", capacity: "1000kg", mileage: 15 },
    { value: "truck", label: "Small Truck", capacity: "3000kg", mileage: 10 },
    { value: "tractor", label: "Tractor Trolley", capacity: "5000kg", mileage: 8 },
  ]

  const taskTypes = [
    { value: "harvesting", label: "Harvesting", rate: 2 }, // kg per hour per worker
    { value: "planting", label: "Planting", rate: 1.5 },
    { value: "weeding", label: "Weeding", rate: 100 }, // sq ft per hour per worker
    { value: "irrigation", label: "Irrigation", rate: 200 },
    { value: "packaging", label: "Packaging", rate: 5 },
  ]

  const calculateTransportCost = () => {
    const distance = Number.parseFloat(transportData.distance) || 0
    const fuelPrice = Number.parseFloat(transportData.fuelPrice) || 95
    const weight = Number.parseFloat(transportData.weight) || 0
    const laborCost = Number.parseFloat(transportData.laborCost) || 0

    const selectedVehicle = vehicleTypes.find((v) => v.value === transportData.vehicleType)
    if (!selectedVehicle) return

    const mileage = selectedVehicle.mileage
    const fuelCost = (distance * 2 * fuelPrice) / mileage // Round trip
    const totalCost = fuelCost + laborCost

    setResults((prev) => ({
      ...prev,
      transportCost: Math.round(totalCost),
      totalCost: Math.round(totalCost + prev.timeEstimate * 50), // Assuming ₹50 per hour labor
    }))
  }

  const calculateTimeEstimate = () => {
    const quantity = Number.parseFloat(timeData.quantity) || 0
    const workers = Number.parseInt(timeData.workers) || 1

    const selectedTask = taskTypes.find((t) => t.value === timeData.taskType)
    if (!selectedTask) return

    const rate = selectedTask.rate
    const timeInHours = quantity / (rate * workers)

    setResults((prev) => ({
      ...prev,
      timeEstimate: Math.round(timeInHours * 10) / 10, // Round to 1 decimal
      totalCost: Math.round(prev.transportCost + timeInHours * 50 * workers),
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Cost Calculator</h1>
            <p className="text-sm text-muted-foreground">Calculate transport and time costs</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs defaultValue="transport" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transport" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Transport
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time & Labor
            </TabsTrigger>
          </TabsList>

          {/* Transport Calculator */}
          <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Transport Cost Calculator
                </CardTitle>
                <CardDescription>Calculate fuel and transportation costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="distance"
                        type="number"
                        placeholder="0"
                        value={transportData.distance}
                        onChange={(e) => setTransportData({ ...transportData, distance: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuel">Fuel Price (₹/L)</Label>
                    <div className="relative">
                      <Fuel className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fuel"
                        type="number"
                        placeholder="95"
                        value={transportData.fuelPrice}
                        onChange={(e) => setTransportData({ ...transportData, fuelPrice: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle Type</Label>
                  <Select
                    value={transportData.vehicleType}
                    onValueChange={(value) => setTransportData({ ...transportData, vehicleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((vehicle) => (
                        <SelectItem key={vehicle.value} value={vehicle.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{vehicle.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {vehicle.capacity} • {vehicle.mileage} km/L
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="0"
                      value={transportData.weight}
                      onChange={(e) => setTransportData({ ...transportData, weight: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="labor">Labor Cost (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="labor"
                        type="number"
                        placeholder="0"
                        value={transportData.laborCost}
                        onChange={(e) => setTransportData({ ...transportData, laborCost: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={calculateTransportCost} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Transport Cost
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Calculator */}
          <TabsContent value="time" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time & Labor Calculator
                </CardTitle>
                <CardDescription>Estimate time and labor costs for farming tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crop">Crop Type</Label>
                  <Select
                    value={timeData.cropType}
                    onValueChange={(value) => setTimeData({ ...timeData, cropType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tomato">Tomato</SelectItem>
                      <SelectItem value="potato">Potato</SelectItem>
                      <SelectItem value="onion">Onion</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task">Task Type</Label>
                  <Select
                    value={timeData.taskType}
                    onValueChange={(value) => setTimeData({ ...timeData, taskType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((task) => (
                        <SelectItem key={task.value} value={task.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{task.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {task.rate} {task.value === "weeding" || task.value === "irrigation" ? "sq ft" : "kg"}/hr
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity ({timeData.taskType === "weeding" || timeData.taskType === "irrigation" ? "sq ft" : "kg"}
                      )
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={timeData.quantity}
                      onChange={(e) => setTimeData({ ...timeData, quantity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workers">Number of Workers</Label>
                    <Input
                      id="workers"
                      type="number"
                      placeholder="1"
                      value={timeData.workers}
                      onChange={(e) => setTimeData({ ...timeData, workers: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={calculateTimeEstimate} className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Calculate Time & Cost
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {(results.transportCost > 0 || results.timeEstimate > 0) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.transportCost > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Transport Cost</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">₹{results.transportCost}</span>
                </div>
              )}

              {results.timeEstimate > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Time Estimate</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{results.timeEstimate} hours</span>
                </div>
              )}

              {results.totalCost > 0 && (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span className="font-medium">Total Estimated Cost</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">₹{results.totalCost}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
