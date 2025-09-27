
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Settings, User, Bell, Palette, Banknote, Lock, LogOut, Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function SettingsPage() {
  const { setTheme } = useTheme();

  const loginHistory = [
    { device: 'Chrome on Windows', location: 'New York, USA', time: '2 hours ago', ip: '192.168.1.1' },
    { device: 'Safari on iPhone', location: 'San Francisco, USA', time: '1 day ago', ip: '10.0.0.1' },
    { device: 'Firefox on Linux', location: 'London, UK', time: '3 days ago', ip: '172.16.0.1' },
  ];

  const integrations = [
    {
        name: 'PayPal',
        description: 'Sync your PayPal transactions for automated income and expense tracking.',
        logo: 'https://www.paypalobjects.com/digitalassets/c/website/logo/full-text/pp_fc_hl.svg',
        connected: true,
    },
    {
        name: 'Stripe',
        description: 'Integrate Stripe to automatically import your freelance earnings and fees.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
        connected: false,
    },
     {
        name: 'Razorpay',
        description: 'Connect Razorpay to get a unified view of payments from Indian clients.',
        logo: 'https://razorpay.com/assets/razorpay-logo.svg',
        connected: false,
    },
    {
        name: 'Fiverr',
        description: 'Automatically pull your earnings and project data from your Fiverr account.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fiverr_Logo_09.2020.svg/1200px-Fiverr_Logo_09.2020.svg.png',
        connected: true,
    },
  ]

  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings /> Settings
          </CardTitle>
          <CardDescription>
            Manage your account settings, notifications, and appearance.
          </CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="profile" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" />Appearance</TabsTrigger>
            <TabsTrigger value="financials"><Banknote className="mr-2 h-4 w-4" />Financials</TabsTrigger>
            <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4" />Security</TabsTrigger>
            <TabsTrigger value="integrations"><Share2 className="mr-2 h-4 w-4" />Integrations</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="your.email@example.com" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" defaultValue="Freelance Developer" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Payment & Invoice Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                        Receive alerts for upcoming and overdue payments.
                    </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Scam & Fraud Alerts</Label>
                     <p className="text-sm text-muted-foreground">
                        Get AI-powered warnings about potential financial fraud.
                    </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                 <div className="space-y-0.5">
                    <Label className="text-base">Tax & Compliance Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                        Reminders for tax deadlines and compliance updates.
                    </p>
                </div>
                <Switch />
              </div>
               <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                 <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                        Notifications about unusual account activity.
                    </p>
                </div>
                <Switch defaultChecked/>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setTheme('light')}>Light</Button>
                    <Button variant="outline" onClick={() => setTheme('dark')}>Dark</Button>
                    <Button variant="outline" onClick={() => setTheme('system')}>System</Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
            <Card>
                <CardHeader>
                    <CardTitle>Financial Settings</CardTitle>
                    <CardDescription>Manage your default currency, tax information, and other financial settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Default Currency</Label>
                            <Select defaultValue="INR">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                    <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tax-id">Tax ID / PAN</Label>
                            <Input id="tax-id" placeholder="Enter your Tax ID" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                            <Select defaultValue="april">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select start month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="january">January</SelectItem>
                                    <SelectItem value="april">April</SelectItem>
                                    <SelectItem value="july">July</SelectItem>
                                    <SelectItem value="october">October</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button>Save Financial Settings</Button>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="security">
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password, two-factor authentication, and active sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                         <Button>Update Password</Button>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security to your account.
                            </p>
                            <Button variant="outline">Enable 2FA</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Login History</h3>
                        <Card>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Device</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>IP Address</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loginHistory.map((session, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{session.device}</TableCell>
                                            <TableCell>{session.location}</TableCell>
                                            <TableCell>{session.time}</TableCell>
                                            <TableCell>{session.ip}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                        <Button variant="destructive" className="w-full md:w-auto">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out From All Devices
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

         <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>App Integrations</CardTitle>
              <CardDescription>
                Connect your favorite apps to sync data and automate your workflow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-10 w-24">
                        <Image
                            src={integration.logo}
                            alt={`${integration.name} logo`}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base">{integration.name}</Label>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked={integration.connected} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    