import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, AlertTriangle, Clock, DollarSign, Users } from "lucide-react";

const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change} from last hour
      </p>
    </CardContent>
  </Card>
);

export const MonitoringDashboard = () => {
  // Mock real-time data
  const transactionData = [
    { time: '00:00', volume: 245, success: 238, failed: 7 },
    { time: '00:15', volume: 312, success: 305, failed: 7 },
    { time: '00:30', volume: 289, success: 285, failed: 4 },
    { time: '00:45', volume: 356, success: 348, failed: 8 },
    { time: '01:00', volume: 423, success: 415, failed: 8 },
    { time: '01:15', volume: 398, success: 392, failed: 6 },
  ];

  const processingTimeData = [
    { endpoint: 'Create Payment', avgTime: 145, p50: 120, p95: 280, p99: 420 },
    { endpoint: 'Process Refund', avgTime: 98, p50: 85, p95: 180, p99: 250 },
    { endpoint: 'Create Payout', avgTime: 187, p50: 160, p95: 340, p99: 480 },
    { endpoint: 'Verify Payment', avgTime: 52, p50: 45, p95: 95, p99: 135 },
    { endpoint: 'Webhook Delivery', avgTime: 234, p50: 200, p95: 450, p99: 680 },
  ];

  const errorDistribution = [
    { name: 'Insufficient Funds', value: 35, color: 'hsl(var(--destructive))' },
    { name: 'Invalid Card', value: 28, color: 'hsl(var(--warning))' },
    { name: 'Network Timeout', value: 18, color: 'hsl(var(--muted))' },
    { name: 'Rate Limited', value: 12, color: 'hsl(var(--accent))' },
    { name: 'Other', value: 7, color: 'hsl(var(--secondary))' },
  ];

  const statusDistribution = [
    { name: 'Success', value: 94.2, color: 'hsl(142 76% 36%)' },
    { name: 'Failed', value: 3.8, color: 'hsl(var(--destructive))' },
    { name: 'Pending', value: 2.0, color: 'hsl(var(--warning))' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Real-time system metrics and performance indicators
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Transaction Volume"
          value="1,245"
          change="+12.5%"
          icon={Activity}
          trend="up"
        />
        <MetricCard
          title="Success Rate"
          value="94.2%"
          change="+0.8%"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Error Rate"
          value="3.8%"
          change="-0.3%"
          icon={AlertTriangle}
          trend="down"
        />
        <MetricCard
          title="Avg Processing Time"
          value="145ms"
          change="-8ms"
          icon={Clock}
          trend="up"
        />
      </div>

      <Tabs defaultValue="volume" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="volume">Transaction Volume</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume Over Time</CardTitle>
              <CardDescription>Last 6 hours - 15 minute intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Total Volume"
                  />
                  <Line
                    type="monotone"
                    dataKey="success"
                    stroke="hsl(142 76% 36%)"
                    strokeWidth={2}
                    name="Successful"
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Failed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Merchants by Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'TechCorp Inc.', volume: 1245, revenue: '$245,890' },
                    { name: 'Digital Services LLC', volume: 987, revenue: '$187,430' },
                    { name: 'E-Commerce Solutions', volume: 756, revenue: '$156,720' },
                    { name: 'Global Retail Co.', volume: 623, revenue: '$124,560' },
                  ].map((merchant, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{merchant.name}</p>
                        <p className="text-sm text-muted-foreground">{merchant.volume} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{merchant.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { method: 'Credit Card', percentage: 65, count: 808 },
                    { method: 'Debit Card', percentage: 20, count: 249 },
                    { method: 'Bank Transfer', percentage: 10, count: 125 },
                    { method: 'Digital Wallet', percentage: 5, count: 63 },
                  ].map((method, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{method.method}</span>
                        <span className="text-muted-foreground">{method.count} ({method.percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Performance</CardTitle>
              <CardDescription>Average response times and percentiles (ms)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="endpoint" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="p50" fill="hsl(var(--primary))" name="P50" />
                  <Bar dataKey="avgTime" fill="hsl(var(--accent))" name="Average" />
                  <Bar dataKey="p95" fill="hsl(var(--warning))" name="P95" />
                  <Bar dataKey="p99" fill="hsl(var(--destructive))" name="P99" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: 'API Gateway', status: 'operational', uptime: '99.98%' },
                    { service: 'Payment Processor', status: 'operational', uptime: '99.95%' },
                    { service: 'Database Cluster', status: 'operational', uptime: '99.99%' },
                    { service: 'Webhook Service', status: 'degraded', uptime: '98.82%' },
                    { service: 'Cache Layer', status: 'operational', uptime: '99.97%' },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                        />
                        <span className="font-medium">{service.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{service.uptime}</span>
                        <Badge variant={service.status === 'operational' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { resource: 'CPU Usage', current: 45, max: 100, status: 'normal' },
                    { resource: 'Memory Usage', current: 62, max: 100, status: 'normal' },
                    { resource: 'Database Connections', current: 127, max: 200, status: 'normal' },
                    { resource: 'API Rate Limit', current: 4250, max: 5000, status: 'warning' },
                  ].map((resource, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{resource.resource}</span>
                        <span className="text-muted-foreground">
                          {resource.current} / {resource.max}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            resource.status === 'warning' ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${(resource.current / resource.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={errorDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {errorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { code: 'ERR_4001', message: 'Insufficient funds', count: 12, time: '2 min ago' },
                    { code: 'ERR_4002', message: 'Invalid card number', count: 8, time: '5 min ago' },
                    { code: 'ERR_5001', message: 'Gateway timeout', count: 3, time: '8 min ago' },
                    { code: 'ERR_4003', message: 'Card expired', count: 5, time: '12 min ago' },
                    { code: 'ERR_4291', message: 'Rate limit exceeded', count: 2, time: '15 min ago' },
                  ].map((error, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{error.code}</Badge>
                          <span className="font-medium text-sm">{error.message}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{error.time}</p>
                      </div>
                      <Badge variant="outline">{error.count}x</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Error Rate Trend</CardTitle>
              <CardDescription>Percentage of failed transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { time: '00:00', rate: 2.8 },
                    { time: '04:00', rate: 3.2 },
                    { time: '08:00', rate: 4.1 },
                    { time: '12:00', rate: 3.6 },
                    { time: '16:00', rate: 3.9 },
                    { time: '20:00', rate: 3.8 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Error Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Processed</span>
                      <span className="text-2xl font-bold">$1,245,890</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fees Collected</span>
                      <span className="font-medium">$31,147</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Successful</span>
                      <span className="text-lg font-semibold text-green-600">$1,173,649</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Failed</span>
                      <span className="text-lg font-semibold text-red-600">$47,341</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="text-lg font-semibold text-yellow-600">$24,900</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Transaction</span>
                      <span className="text-xl font-bold">$1,001</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
