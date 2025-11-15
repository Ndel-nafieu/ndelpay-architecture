import { 
  Shield, Users, Wallet, CreditCard, DollarSign, 
  Database, Cloud, Bell, BarChart3, GitBranch,
  Server, Lock, FileText, AlertTriangle, Globe,
  Smartphone, Building2, UserCog, ArrowRight, ArrowDown
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceBoxProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  colorClass: string;
}

const ServiceBox = ({ icon, title, description, colorClass }: ServiceBoxProps) => (
  <Card className={`p-4 ${colorClass} border-2 hover:scale-105 transition-transform duration-200 shadow-lg`}>
    <div className="flex flex-col items-center text-center gap-2">
      <div className="p-2 bg-background/50 rounded-lg">
        {icon}
      </div>
      <h4 className="font-semibold text-sm leading-tight">{title}</h4>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  </Card>
);

const FlowArrow = ({ direction = "down" }: { direction?: "down" | "right" }) => (
  <div className="flex items-center justify-center">
    {direction === "down" ? (
      <ArrowDown className="w-6 h-6 text-primary animate-pulse" />
    ) : (
      <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
    )}
  </div>
);

export const ArchitectureDiagram = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          NdelPay Architecture
        </h1>
        <p className="text-muted-foreground">Multi-Rail Payments Platform - Microservices on AWS</p>
      </div>

      {/* Client Applications Layer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
          <h2 className="text-xl font-semibold">Client Applications</h2>
        </div>
        <div className="p-6 bg-layer-frontend rounded-xl border-2 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ServiceBox 
              icon={<Smartphone className="w-6 h-6 text-primary" />}
              title="Customer App"
              description="User payments & wallet"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Building2 className="w-6 h-6 text-primary" />}
              title="Merchant Dashboard"
              description="Business transactions"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<UserCog className="w-6 h-6 text-primary" />}
              title="Admin Dashboard"
              description="Platform oversight"
              colorClass="bg-card"
            />
          </div>
        </div>
      </section>

      <FlowArrow />

      {/* API Gateway Layer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-secondary to-accent rounded-full" />
          <h2 className="text-xl font-semibold">API Gateway</h2>
        </div>
        <div className="p-6 bg-layer-api rounded-xl border-2 border-secondary/20">
          <ServiceBox 
            icon={<Globe className="w-8 h-8 text-secondary" />}
            title="AWS API Gateway"
            description="Route, authenticate, rate limit"
            colorClass="bg-card"
          />
        </div>
      </section>

      <FlowArrow />

      {/* Core Microservices Layer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-accent to-primary rounded-full" />
          <h2 className="text-xl font-semibold">Core Microservices (Express.js)</h2>
        </div>
        <div className="p-6 bg-layer-services rounded-xl border-2 border-accent/20 space-y-6">
          {/* Authentication & User Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceBox 
              icon={<Shield className="w-6 h-6 text-service-auth" />}
              title="Authentication Service"
              description="JWT, session tokens, 2FA"
              colorClass="bg-card border-service-auth/30"
            />
            <ServiceBox 
              icon={<Users className="w-6 h-6 text-service-user" />}
              title="User Service"
              description="Customers, businesses, admin"
              colorClass="bg-card border-service-user/30"
            />
          </div>

          {/* Payment Core Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ServiceBox 
              icon={<Wallet className="w-6 h-6 text-service-wallet" />}
              title="Wallet Service"
              description="Balance, ledger, double-entry"
              colorClass="bg-card border-service-wallet/30"
            />
            <ServiceBox 
              icon={<CreditCard className="w-6 h-6 text-service-payment" />}
              title="Payments Service"
              description="Card, MoMo, bank, crypto"
              colorClass="bg-card border-service-payment/30"
            />
            <ServiceBox 
              icon={<DollarSign className="w-6 h-6 text-service-payment" />}
              title="Payout Service"
              description="Merchant settlements"
              colorClass="bg-card border-service-payment/30"
            />
          </div>

          {/* Support Services */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ServiceBox 
              icon={<GitBranch className="w-5 h-5 text-primary" />}
              title="Reconciliation"
              description="Ledger matching"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
              title="Fraud & Risk"
              description="Security checks"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Bell className="w-5 h-5 text-accent" />}
              title="Notifications"
              description="SMS, email alerts"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<BarChart3 className="w-5 h-5 text-secondary" />}
              title="Analytics"
              description="Reports & insights"
              colorClass="bg-card"
            />
          </div>
        </div>
      </section>

      <FlowArrow />

      {/* AWS Infrastructure Layer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-service-infra to-accent rounded-full" />
          <h2 className="text-xl font-semibold">AWS Infrastructure</h2>
        </div>
        <div className="p-6 bg-layer-infra rounded-xl border-2 border-service-infra/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ServiceBox 
              icon={<Server className="w-5 h-5 text-service-infra" />}
              title="ECS / Lambda"
              description="Container/serverless"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Database className="w-5 h-5 text-service-infra" />}
              title="RDS PostgreSQL"
              description="Transactional DB"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Cloud className="w-5 h-5 text-service-infra" />}
              title="S3 + SQS"
              description="Storage & queues"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Lock className="w-5 h-5 text-service-infra" />}
              title="Secrets Manager"
              description="API keys, tokens"
              colorClass="bg-card"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceBox 
              icon={<FileText className="w-5 h-5 text-service-infra" />}
              title="CloudWatch"
              description="Logs, metrics, alarms"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Shield className="w-5 h-5 text-service-infra" />}
              title="WAF + Shield"
              description="DDoS protection"
              colorClass="bg-card"
            />
          </div>
        </div>
      </section>

      <FlowArrow />

      {/* Payment Providers Layer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-service-provider to-secondary rounded-full" />
          <h2 className="text-xl font-semibold">Payment Providers</h2>
        </div>
        <div className="p-6 bg-layer-providers rounded-xl border-2 border-service-provider/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ServiceBox 
              icon={<CreditCard className="w-5 h-5 text-service-provider" />}
              title="Paystack"
              description="Cards, bank, MoMo"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Smartphone className="w-5 h-5 text-service-provider" />}
              title="Mobile Money"
              description="MTN, Airtel APIs"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<Building2 className="w-5 h-5 text-service-provider" />}
              title="Banks"
              description="Direct integrations"
              colorClass="bg-card"
            />
            <ServiceBox 
              icon={<DollarSign className="w-5 h-5 text-service-provider" />}
              title="Stablecoin Rails"
              description="Blockchain payments"
              colorClass="bg-card"
            />
          </div>
        </div>
      </section>

      {/* Key Flows */}
      <section className="space-y-4 mt-12">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
          <h2 className="text-xl font-semibold">Key Data Flows</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-card border-primary/20">
            <h3 className="font-semibold mb-2 text-primary">Payment Flow</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>User initiates payment via app</li>
              <li>API Gateway → Payments Service</li>
              <li>Provider authorization & capture</li>
              <li>Wallet Service updates balance</li>
              <li>Notification sent to user</li>
            </ol>
          </Card>
          <Card className="p-4 bg-card border-secondary/20">
            <h3 className="font-semibold mb-2 text-secondary">Payout Flow</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Merchant requests payout</li>
              <li>Payout Service validates balance</li>
              <li>SQS queues payout job</li>
              <li>Provider API processes transfer</li>
              <li>Reconciliation confirms completion</li>
            </ol>
          </Card>
          <Card className="p-4 bg-card border-accent/20">
            <h3 className="font-semibold mb-2 text-accent">KYC & Onboarding</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>User registration via Auth Service</li>
              <li>User Service creates profile</li>
              <li>KYC verification (external API)</li>
              <li>Business verification for merchants</li>
              <li>Wallet creation after approval</li>
            </ol>
          </Card>
          <Card className="p-4 bg-card border-service-infra/20">
            <h3 className="font-semibold mb-2 text-service-infra">Reconciliation Loop</h3>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Scheduled job queries providers</li>
              <li>Compare with internal ledger</li>
              <li>Flag discrepancies to admin</li>
              <li>Auto-resolve or manual review</li>
              <li>Update transaction status</li>
            </ol>
          </Card>
        </div>
      </section>
    </div>
  );
};
