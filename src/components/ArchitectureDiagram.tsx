import { useState } from "react";
import { 
  Shield, Users, Wallet, CreditCard, DollarSign, 
  Database, Cloud, Bell, BarChart3, GitBranch,
  Server, Lock, FileText, AlertTriangle, Globe,
  Smartphone, Building2, UserCog, ArrowRight, ArrowDown,
  Code, Layers, HardDrive, ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceDetail {
  name: string;
  description: string;
  techStack: string[];
  endpoints?: { method: string; path: string; description: string }[];
  database?: { table: string; fields: string[] }[];
  dependencies?: string[];
  scalability?: string;
}

interface ServiceBoxProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  colorClass: string;
  onClick?: () => void;
}

const ServiceBox = ({ icon, title, description, colorClass, onClick }: ServiceBoxProps) => (
  <Card 
    className={`p-4 ${colorClass} border-2 hover:scale-105 transition-transform duration-200 shadow-lg ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
    onClick={onClick}
  >
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

const serviceDetails: Record<string, ServiceDetail> = {
  "Authentication Service": {
    name: "Authentication Service",
    description: "Handles user authentication, JWT tokens, session management, and 2FA",
    techStack: ["Express.js", "Passport.js", "JWT", "bcrypt", "Redis (sessions)"],
    endpoints: [
      { method: "POST", path: "/api/auth/register", description: "Register new user" },
      { method: "POST", path: "/api/auth/login", description: "User login" },
      { method: "POST", path: "/api/auth/logout", description: "User logout" },
      { method: "POST", path: "/api/auth/refresh", description: "Refresh JWT token" },
      { method: "POST", path: "/api/auth/verify-2fa", description: "Verify 2FA code" },
      { method: "POST", path: "/api/auth/reset-password", description: "Password reset request" },
    ],
    database: [
      { table: "users", fields: ["id", "email", "password_hash", "created_at", "updated_at", "status"] },
      { table: "sessions", fields: ["session_id", "user_id", "token", "expires_at", "ip_address"] },
      { table: "refresh_tokens", fields: ["token_id", "user_id", "token", "expires_at"] },
    ],
    dependencies: ["User Service", "Notifications Service"],
    scalability: "Horizontally scalable, stateless with Redis for session storage",
  },
  "User Service": {
    name: "User Service",
    description: "Manages user profiles, KYC verification, and business account management",
    techStack: ["Express.js", "PostgreSQL", "AWS S3", "Third-party KYC APIs"],
    endpoints: [
      { method: "GET", path: "/api/users/:id", description: "Get user profile" },
      { method: "PUT", path: "/api/users/:id", description: "Update user profile" },
      { method: "POST", path: "/api/users/kyc", description: "Submit KYC documents" },
      { method: "GET", path: "/api/users/:id/kyc-status", description: "Check KYC status" },
      { method: "POST", path: "/api/users/business", description: "Create business account" },
      { method: "GET", path: "/api/users/business/:id", description: "Get business details" },
    ],
    database: [
      { table: "profiles", fields: ["user_id", "first_name", "last_name", "phone", "date_of_birth", "address"] },
      { table: "kyc_documents", fields: ["id", "user_id", "document_type", "document_url", "status", "verified_at"] },
      { table: "businesses", fields: ["id", "owner_id", "business_name", "registration_number", "verified", "created_at"] },
    ],
    dependencies: ["Authentication Service", "Wallet Service"],
    scalability: "Microservice with read replicas for high-read operations",
  },
  "Wallet Service": {
    name: "Wallet Service",
    description: "Manages wallet balances, ledger entries, and double-entry bookkeeping",
    techStack: ["Express.js", "PostgreSQL", "Redis (caching)", "Transaction locks"],
    endpoints: [
      { method: "GET", path: "/api/wallets/:userId", description: "Get wallet balance" },
      { method: "POST", path: "/api/wallets/credit", description: "Credit wallet" },
      { method: "POST", path: "/api/wallets/debit", description: "Debit wallet" },
      { method: "GET", path: "/api/wallets/:userId/transactions", description: "Get transaction history" },
      { method: "POST", path: "/api/wallets/transfer", description: "Internal wallet transfer" },
    ],
    database: [
      { table: "wallets", fields: ["wallet_id", "user_id", "balance", "currency", "status", "created_at"] },
      { table: "ledger_entries", fields: ["id", "wallet_id", "debit", "credit", "balance_after", "reference", "created_at"] },
      { table: "wallet_locks", fields: ["lock_id", "wallet_id", "locked_amount", "reason", "expires_at"] },
    ],
    dependencies: ["User Service", "Payments Service"],
    scalability: "ACID-compliant transactions with row-level locking, horizontally scalable",
  },
  "Payments Service": {
    name: "Payments Service",
    description: "Processes card, mobile money, bank transfers, and stablecoin payments",
    techStack: ["Express.js", "PostgreSQL", "Provider SDKs", "Bull Queue", "Webhooks"],
    endpoints: [
      { method: "POST", path: "/api/payments/initialize", description: "Initialize payment" },
      { method: "POST", path: "/api/payments/verify", description: "Verify payment" },
      { method: "GET", path: "/api/payments/:id", description: "Get payment status" },
      { method: "POST", path: "/api/payments/webhook", description: "Payment webhook handler" },
      { method: "GET", path: "/api/payments/user/:userId", description: "User payment history" },
    ],
    database: [
      { table: "payments", fields: ["payment_id", "user_id", "amount", "currency", "method", "status", "provider_ref", "created_at"] },
      { table: "payment_methods", fields: ["id", "user_id", "type", "last_four", "provider", "is_default"] },
      { table: "webhooks", fields: ["id", "provider", "event_type", "payload", "processed", "received_at"] },
    ],
    dependencies: ["Wallet Service", "Fraud & Risk Engine", "Notifications Service"],
    scalability: "Event-driven with queue workers, handles 10k+ TPS",
  },
  "Payout Service": {
    name: "Payout Service",
    description: "Manages merchant payouts, settlements, and automated disbursements",
    techStack: ["Express.js", "PostgreSQL", "SQS", "Scheduler", "Provider APIs"],
    endpoints: [
      { method: "POST", path: "/api/payouts/request", description: "Request payout" },
      { method: "GET", path: "/api/payouts/:id", description: "Get payout status" },
      { method: "GET", path: "/api/payouts/merchant/:id", description: "Merchant payout history" },
      { method: "POST", path: "/api/payouts/batch", description: "Batch payout processing" },
      { method: "PUT", path: "/api/payouts/:id/approve", description: "Approve manual payout" },
    ],
    database: [
      { table: "payouts", fields: ["payout_id", "merchant_id", "amount", "currency", "status", "scheduled_at", "processed_at"] },
      { table: "payout_rules", fields: ["id", "merchant_id", "frequency", "minimum_amount", "auto_approve"] },
      { table: "settlements", fields: ["id", "payout_id", "provider_ref", "fee", "net_amount", "completed_at"] },
    ],
    dependencies: ["Wallet Service", "Transaction Reconciliation Service"],
    scalability: "Queue-based processing with retry logic, supports batch operations",
  },
  "Transaction Reconciliation Service": {
    name: "Transaction Reconciliation Service",
    description: "Matches internal ledger with provider transactions and resolves discrepancies",
    techStack: ["Express.js", "PostgreSQL", "Scheduler (cron)", "Provider APIs", "Alert system"],
    endpoints: [
      { method: "POST", path: "/api/reconciliation/run", description: "Trigger reconciliation" },
      { method: "GET", path: "/api/reconciliation/status", description: "Get reconciliation status" },
      { method: "GET", path: "/api/reconciliation/discrepancies", description: "List discrepancies" },
      { method: "PUT", path: "/api/reconciliation/:id/resolve", description: "Resolve discrepancy" },
    ],
    database: [
      { table: "reconciliation_runs", fields: ["run_id", "provider", "start_date", "end_date", "status", "completed_at"] },
      { table: "discrepancies", fields: ["id", "run_id", "transaction_id", "expected", "actual", "resolved", "notes"] },
    ],
    dependencies: ["Payments Service", "Payout Service"],
    scalability: "Scheduled batch jobs, can process millions of records",
  },
  "Fraud & Risk Engine": {
    name: "Fraud & Risk Engine",
    description: "Real-time fraud detection, risk scoring, and transaction monitoring",
    techStack: ["Express.js", "Redis", "ML models", "Rule engine", "PostgreSQL"],
    endpoints: [
      { method: "POST", path: "/api/fraud/check", description: "Check transaction for fraud" },
      { method: "GET", path: "/api/fraud/score/:userId", description: "Get user risk score" },
      { method: "POST", path: "/api/fraud/rules", description: "Update fraud rules" },
      { method: "GET", path: "/api/fraud/flagged", description: "List flagged transactions" },
    ],
    database: [
      { table: "fraud_checks", fields: ["id", "transaction_id", "risk_score", "flags", "action", "checked_at"] },
      { table: "user_risk_scores", fields: ["user_id", "score", "factors", "updated_at"] },
      { table: "fraud_rules", fields: ["rule_id", "name", "condition", "action", "enabled"] },
    ],
    dependencies: ["Payments Service", "User Service"],
    scalability: "Real-time processing with caching, ML inference at <100ms",
  },
  "Notifications Service": {
    name: "Notifications Service",
    description: "Sends SMS, email, and push notifications to users",
    techStack: ["Express.js", "Bull Queue", "Twilio/AWS SNS", "SendGrid", "PostgreSQL"],
    endpoints: [
      { method: "POST", path: "/api/notifications/send", description: "Send notification" },
      { method: "GET", path: "/api/notifications/user/:id", description: "User notifications" },
      { method: "PUT", path: "/api/notifications/:id/read", description: "Mark as read" },
      { method: "POST", path: "/api/notifications/preferences", description: "Update preferences" },
    ],
    database: [
      { table: "notifications", fields: ["id", "user_id", "type", "channel", "content", "sent_at", "read_at"] },
      { table: "notification_preferences", fields: ["user_id", "email_enabled", "sms_enabled", "push_enabled"] },
      { table: "templates", fields: ["template_id", "name", "channel", "content", "variables"] },
    ],
    dependencies: ["User Service"],
    scalability: "Queue-based async processing, handles 100k+ notifications/min",
  },
  "Reporting & Analytics Service": {
    name: "Reporting & Analytics Service",
    description: "Generates reports, dashboards, and business intelligence",
    techStack: ["Express.js", "PostgreSQL", "Redis", "Data warehouse", "Chart libraries"],
    endpoints: [
      { method: "GET", path: "/api/reports/transactions", description: "Transaction reports" },
      { method: "GET", path: "/api/reports/revenue", description: "Revenue analytics" },
      { method: "GET", path: "/api/reports/merchants", description: "Merchant performance" },
      { method: "POST", path: "/api/reports/custom", description: "Generate custom report" },
      { method: "GET", path: "/api/analytics/dashboard", description: "Dashboard metrics" },
    ],
    database: [
      { table: "reports", fields: ["report_id", "type", "filters", "generated_by", "created_at", "file_url"] },
      { table: "metrics_cache", fields: ["metric_key", "value", "updated_at"] },
    ],
    dependencies: ["All transaction services"],
    scalability: "Read replicas, materialized views, cached aggregations",
  },
};

export const ArchitectureDiagram = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

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
              onClick={() => setSelectedService(serviceDetails["Authentication Service"])}
            />
            <ServiceBox 
              icon={<Users className="w-6 h-6 text-service-user" />}
              title="User Service"
              description="Customers, businesses, admin"
              colorClass="bg-card border-service-user/30"
              onClick={() => setSelectedService(serviceDetails["User Service"])}
            />
          </div>

          {/* Payment Core Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ServiceBox 
              icon={<Wallet className="w-6 h-6 text-service-wallet" />}
              title="Wallet Service"
              description="Balance, ledger, double-entry"
              colorClass="bg-card border-service-wallet/30"
              onClick={() => setSelectedService(serviceDetails["Wallet Service"])}
            />
            <ServiceBox 
              icon={<CreditCard className="w-6 h-6 text-service-payment" />}
              title="Payments Service"
              description="Card, MoMo, bank, crypto"
              colorClass="bg-card border-service-payment/30"
              onClick={() => setSelectedService(serviceDetails["Payments Service"])}
            />
            <ServiceBox 
              icon={<DollarSign className="w-6 h-6 text-service-payment" />}
              title="Payout Service"
              description="Merchant settlements"
              colorClass="bg-card border-service-payment/30"
              onClick={() => setSelectedService(serviceDetails["Payout Service"])}
            />
          </div>

          {/* Support Services */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ServiceBox 
              icon={<GitBranch className="w-5 h-5 text-primary" />}
              title="Reconciliation"
              description="Ledger matching"
              colorClass="bg-card"
              onClick={() => setSelectedService(serviceDetails["Transaction Reconciliation Service"])}
            />
            <ServiceBox 
              icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
              title="Fraud & Risk"
              description="Security checks"
              colorClass="bg-card"
              onClick={() => setSelectedService(serviceDetails["Fraud & Risk Engine"])}
            />
            <ServiceBox 
              icon={<Bell className="w-5 h-5 text-accent" />}
              title="Notifications"
              description="SMS, email alerts"
              colorClass="bg-card"
              onClick={() => setSelectedService(serviceDetails["Notifications Service"])}
            />
            <ServiceBox 
              icon={<BarChart3 className="w-5 h-5 text-secondary" />}
              title="Analytics"
              description="Reports & insights"
              colorClass="bg-card"
              onClick={() => setSelectedService(serviceDetails["Reporting & Analytics Service"])}
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

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Code className="w-6 h-6 text-primary" />
              {selectedService?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <Tabs defaultValue="tech" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                <TabsTrigger value="api">API Endpoints</TabsTrigger>
                <TabsTrigger value="db">Database</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="tech" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Scalability</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedService.scalability}
                  </p>
                </div>

                {selectedService.dependencies && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-primary" />
                      Dependencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="api" className="space-y-2">
                {selectedService.endpoints ? (
                  <div className="space-y-3">
                    {selectedService.endpoints.map((endpoint, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge 
                            variant={endpoint.method === "GET" ? "secondary" : "default"}
                            className="mt-0.5"
                          >
                            {endpoint.method}
                          </Badge>
                          <div className="flex-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <p className="text-sm text-muted-foreground mt-1">
                              {endpoint.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No API endpoints defined
                  </p>
                )}
              </TabsContent>

              <TabsContent value="db" className="space-y-3">
                {selectedService.database ? (
                  <div className="space-y-4">
                    {selectedService.database.map((table, idx) => (
                      <Card key={idx} className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-primary" />
                          {table.table}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {table.fields.map((field) => (
                            <Badge key={field} variant="outline" className="font-mono text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No database schema defined
                  </p>
                )}
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Service Type</h4>
                    <p className="text-sm text-muted-foreground">Express.js Microservice</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Infrastructure</h4>
                    <p className="text-sm text-muted-foreground">AWS ECS / Lambda</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Monitoring</h4>
                    <p className="text-sm text-muted-foreground">CloudWatch + X-Ray</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">Security</h4>
                    <p className="text-sm text-muted-foreground">JWT Auth, HTTPS, WAF</p>
                  </Card>
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-primary" />
                    Best Practices
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Use environment variables for configuration</li>
                    <li>Implement circuit breakers for external calls</li>
                    <li>Log all transactions with correlation IDs</li>
                    <li>Use database connection pooling</li>
                    <li>Implement rate limiting on all endpoints</li>
                  </ul>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
