import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Users, Wallet, CreditCard, DollarSign,
  Database, Server, Bell, AlertTriangle, Globe,
  Smartphone, Building2, UserCog, Zap
} from "lucide-react";

interface ServiceNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  color: string;
  category: "client" | "gateway" | "service" | "infra" | "provider";
}

interface Connection {
  from: string;
  to: string;
  latency: number;
  active: boolean;
}

interface DataPacket {
  id: string;
  path: string[];
  currentIndex: number;
  progress: number;
  color: string;
}

const nodes: ServiceNode[] = [
  // Client Layer
  { id: "customer", name: "Customer App", icon: <Smartphone className="w-4 h-4" />, x: 10, y: 20, color: "text-primary", category: "client" },
  { id: "merchant", name: "Merchant", icon: <Building2 className="w-4 h-4" />, x: 10, y: 50, color: "text-primary", category: "client" },
  { id: "admin", name: "Admin", icon: <UserCog className="w-4 h-4" />, x: 10, y: 80, color: "text-primary", category: "client" },
  
  // Gateway
  { id: "gateway", name: "API Gateway", icon: <Globe className="w-4 h-4" />, x: 30, y: 50, color: "text-secondary", category: "gateway" },
  
  // Core Services
  { id: "auth", name: "Auth", icon: <Shield className="w-4 h-4" />, x: 50, y: 15, color: "text-service-auth", category: "service" },
  { id: "user", name: "User", icon: <Users className="w-4 h-4" />, x: 50, y: 35, color: "text-service-user", category: "service" },
  { id: "wallet", name: "Wallet", icon: <Wallet className="w-4 h-4" />, x: 50, y: 50, color: "text-service-wallet", category: "service" },
  { id: "payment", name: "Payment", icon: <CreditCard className="w-4 h-4" />, x: 50, y: 65, color: "text-service-payment", category: "service" },
  { id: "payout", name: "Payout", icon: <DollarSign className="w-4 h-4" />, x: 50, y: 80, color: "text-service-payment", category: "service" },
  { id: "fraud", name: "Fraud Check", icon: <AlertTriangle className="w-3 h-3" />, x: 70, y: 35, color: "text-destructive", category: "service" },
  { id: "notify", name: "Notify", icon: <Bell className="w-3 h-3" />, x: 70, y: 65, color: "text-accent", category: "service" },
  
  // Infrastructure
  { id: "db", name: "PostgreSQL", icon: <Database className="w-4 h-4" />, x: 70, y: 50, color: "text-service-infra", category: "infra" },
  
  // Providers
  { id: "provider", name: "Paystack", icon: <Server className="w-4 h-4" />, x: 90, y: 50, color: "text-service-provider", category: "provider" },
];

const connections: Connection[] = [
  // Client to Gateway
  { from: "customer", to: "gateway", latency: 15, active: true },
  { from: "merchant", to: "gateway", latency: 12, active: true },
  { from: "admin", to: "gateway", latency: 18, active: false },
  
  // Gateway to Services
  { from: "gateway", to: "auth", latency: 8, active: true },
  { from: "gateway", to: "user", latency: 10, active: false },
  { from: "gateway", to: "wallet", latency: 12, active: true },
  { from: "gateway", to: "payment", latency: 15, active: true },
  { from: "gateway", to: "payout", latency: 11, active: false },
  
  // Service to Service
  { from: "auth", to: "user", latency: 5, active: true },
  { from: "payment", to: "fraud", latency: 3, active: true },
  { from: "payment", to: "wallet", latency: 7, active: true },
  { from: "wallet", to: "db", latency: 4, active: true },
  { from: "payment", to: "notify", latency: 6, active: true },
  { from: "payout", to: "wallet", latency: 5, active: false },
  
  // Services to Infrastructure
  { from: "auth", to: "db", latency: 4, active: true },
  { from: "user", to: "db", latency: 3, active: false },
  { from: "payment", to: "db", latency: 5, active: true },
  
  // Services to Providers
  { from: "payment", to: "provider", latency: 45, active: true },
  { from: "payout", to: "provider", latency: 50, active: false },
];

export const NetworkTopology = () => {
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [activeConnections, setActiveConnections] = useState<Connection[]>(connections);

  // Simulate data packets flowing through the system
  useEffect(() => {
    const interval = setInterval(() => {
      // Random payment flow
      const flows = [
        ["customer", "gateway", "auth", "user", "db"],
        ["customer", "gateway", "payment", "fraud", "wallet", "db"],
        ["customer", "gateway", "payment", "provider"],
        ["merchant", "gateway", "payout", "wallet", "db"],
        ["customer", "gateway", "payment", "notify"],
      ];
      
      const randomFlow = flows[Math.floor(Math.random() * flows.length)];
      const newPacket: DataPacket = {
        id: Math.random().toString(),
        path: randomFlow,
        currentIndex: 0,
        progress: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      };
      
      setDataPackets(prev => [...prev, newPacket]);
      
      // Update active connections
      setActiveConnections(prev => prev.map(conn => ({
        ...conn,
        active: Math.random() > 0.5,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Animate packets
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPackets(prev => 
        prev
          .map(packet => {
            const newProgress = packet.progress + 0.02;
            if (newProgress >= 1) {
              return {
                ...packet,
                currentIndex: packet.currentIndex + 1,
                progress: 0,
              };
            }
            return { ...packet, progress: newProgress };
          })
          .filter(packet => packet.currentIndex < packet.path.length - 1)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const getConnectionPath = (from: string, to: string) => {
    const fromPos = getNodePosition(from);
    const toPos = getNodePosition(to);
    return { fromPos, toPos };
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Network Topology - Live Data Flow
        </h2>
        <p className="text-muted-foreground">Real-time visualization of request routing and service communication</p>
        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Active Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-muted-foreground">Idle Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Data Packet</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[600px] bg-card border-2 border-border rounded-xl overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {/* Draw connections */}
          {activeConnections.map((conn, idx) => {
            const { fromPos, toPos } = getConnectionPath(conn.from, conn.to);
            const x1 = `${fromPos.x}%`;
            const y1 = `${fromPos.y}%`;
            const x2 = `${toPos.x}%`;
            const y2 = `${toPos.y}%`;

            return (
              <g key={`${conn.from}-${conn.to}-${idx}`}>
                {/* Connection line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={conn.active ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                  strokeWidth={conn.active ? "2" : "1"}
                  strokeOpacity={conn.active ? "0.6" : "0.2"}
                  strokeDasharray={conn.active ? "5,5" : "none"}
                  className={conn.active ? "animate-pulse" : ""}
                />
                
                {/* Latency badge */}
                <text
                  x={`${(fromPos.x + toPos.x) / 2}%`}
                  y={`${(fromPos.y + toPos.y) / 2}%`}
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                  textAnchor="middle"
                  className="select-none"
                >
                  {conn.latency}ms
                </text>
              </g>
            );
          })}

          {/* Draw animated data packets */}
          {dataPackets.map(packet => {
            if (packet.currentIndex >= packet.path.length - 1) return null;
            
            const fromPos = getNodePosition(packet.path[packet.currentIndex]);
            const toPos = getNodePosition(packet.path[packet.currentIndex + 1]);
            const x = fromPos.x + (toPos.x - fromPos.x) * packet.progress;
            const y = fromPos.y + (toPos.y - fromPos.y) * packet.progress;

            return (
              <g key={packet.id}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={packet.color}
                  className="animate-pulse"
                />
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="8"
                  fill={packet.color}
                  opacity="0.3"
                />
              </g>
            );
          })}
        </svg>

        {/* Service Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <Card className="p-3 shadow-lg hover:shadow-xl transition-shadow bg-card border-2 hover:scale-110 transition-transform duration-200">
              <div className="flex flex-col items-center gap-1 min-w-[80px]">
                <div className={`p-2 rounded-full bg-background ${node.color}`}>
                  {node.icon}
                </div>
                <span className="text-xs font-semibold text-center leading-tight">
                  {node.name}
                </span>
                <Badge 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0"
                >
                  {node.category}
                </Badge>
              </div>
            </Card>
          </div>
        ))}

        {/* Layer Labels */}
        <div className="absolute top-4 left-4 space-y-1">
          <Badge variant="outline" className="bg-layer-frontend/80">Client Apps</Badge>
        </div>
        <div className="absolute top-4 left-[30%] transform -translate-x-1/2 space-y-1">
          <Badge variant="outline" className="bg-layer-api/80">API Layer</Badge>
        </div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 space-y-1">
          <Badge variant="outline" className="bg-layer-services/80">Microservices</Badge>
        </div>
        <div className="absolute top-4 right-4 space-y-1">
          <Badge variant="outline" className="bg-layer-providers/80">External</Badge>
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {dataPackets.length}
          </div>
          <div className="text-xs text-muted-foreground">Active Requests</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-secondary">
            {activeConnections.filter(c => c.active).length}
          </div>
          <div className="text-xs text-muted-foreground">Active Connections</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-accent">
            {Math.round(activeConnections.reduce((sum, c) => sum + c.latency, 0) / activeConnections.length)}ms
          </div>
          <div className="text-xs text-muted-foreground">Avg Latency</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-service-infra">
            99.9%
          </div>
          <div className="text-xs text-muted-foreground">Uptime</div>
        </Card>
      </div>

      {/* Flow Examples */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Common Data Flows
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
            <Badge variant="outline" className="text-xs">Payment</Badge>
            <span className="text-xs text-muted-foreground">
              Customer → Gateway → Auth → Payment → Fraud → Wallet → DB → Provider
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
            <Badge variant="outline" className="text-xs">Payout</Badge>
            <span className="text-xs text-muted-foreground">
              Merchant → Gateway → Auth → Payout → Wallet → DB → Provider
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
            <Badge variant="outline" className="text-xs">KYC</Badge>
            <span className="text-xs text-muted-foreground">
              Customer → Gateway → Auth → User → DB
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
            <Badge variant="outline" className="text-xs">Notification</Badge>
            <span className="text-xs text-muted-foreground">
              Payment → Notify → Customer
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
