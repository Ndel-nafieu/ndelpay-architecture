import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smartphone, Globe, Shield, CreditCard, AlertTriangle,
  Wallet, Server, CheckCircle2, Clock, ArrowRight, DollarSign
} from "lucide-react";

interface PaymentStep {
  id: string;
  name: string;
  icon: () => React.ReactNode;
  status: "pending" | "processing" | "completed" | "failed";
  latency: number;
  description: string;
}

interface PaymentFlow {
  id: string;
  amount: number;
  currency: string;
  steps: PaymentStep[];
  currentStep: number;
  startTime: number;
}

const INITIAL_STEPS: PaymentStep[] = [
  {
    id: "customer",
    name: "Customer Initiates",
    icon: () => <Smartphone className="w-5 h-5" />,
    status: "pending",
    latency: 0,
    description: "Payment request sent from customer app"
  },
  {
    id: "gateway",
    name: "API Gateway",
    icon: () => <Globe className="w-5 h-5" />,
    status: "pending",
    latency: 15,
    description: "Request routing and rate limiting"
  },
  {
    id: "auth",
    name: "Authentication",
    icon: () => <Shield className="w-5 h-5" />,
    status: "pending",
    latency: 8,
    description: "JWT validation and session check"
  },
  {
    id: "fraud",
    name: "Fraud Detection",
    icon: () => <AlertTriangle className="w-5 h-5" />,
    status: "pending",
    latency: 45,
    description: "Risk scoring and anomaly detection"
  },
  {
    id: "payment",
    name: "Payment Service",
    icon: () => <CreditCard className="w-5 h-5" />,
    status: "pending",
    latency: 12,
    description: "Transaction creation and validation"
  },
  {
    id: "wallet",
    name: "Wallet Service",
    icon: () => <Wallet className="w-5 h-5" />,
    status: "pending",
    latency: 18,
    description: "Balance check and ledger update"
  },
  {
    id: "provider",
    name: "Payment Provider",
    icon: () => <Server className="w-5 h-5" />,
    status: "pending",
    latency: 350,
    description: "Paystack/Bank processing"
  },
  {
    id: "settlement",
    name: "Settlement",
    icon: () => <CheckCircle2 className="w-5 h-5" />,
    status: "pending",
    latency: 25,
    description: "Final confirmation and notification"
  }
];

export const PaymentFlowVisualizer = () => {
  const [activeFlows, setActiveFlows] = useState<PaymentFlow[]>([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [successRate, setSuccessRate] = useState(100);

  const startNewPayment = () => {
    const newFlow: PaymentFlow = {
      id: `payment-${Date.now()}`,
      amount: Math.floor(Math.random() * 50000) + 1000,
      currency: "NGN",
      steps: INITIAL_STEPS.map(step => ({ ...step })),
      currentStep: 0,
      startTime: Date.now()
    };

    setActiveFlows(prev => [...prev, newFlow]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlows(prev => {
        return prev.map(flow => {
          if (flow.currentStep >= flow.steps.length) {
            return flow;
          }

          const updatedSteps = flow.steps.map((step, idx) => {
            if (idx < flow.currentStep) {
              return { ...step, status: "completed" as const };
            }
            if (idx === flow.currentStep) {
              // Simulate occasional failures at fraud check
              if (step.id === "fraud" && Math.random() < 0.1) {
                return { ...step, status: "failed" as const };
              }
              return { ...step, status: "processing" as const };
            }
            return step;
          });

          const currentStepData = flow.steps[flow.currentStep];
          const hasElapsed = Date.now() - flow.startTime >= 
            flow.steps.slice(0, flow.currentStep + 1).reduce((sum, s) => sum + s.latency, 0);

          if (hasElapsed) {
            const isFailed = updatedSteps[flow.currentStep]?.status === "failed";
            
            if (isFailed) {
              setTotalProcessed(p => p + 1);
              setSuccessRate(p => Math.max(85, p - 0.5));
              return { ...flow, currentStep: flow.steps.length, steps: updatedSteps };
            }

            const nextStep = flow.currentStep + 1;
            if (nextStep >= flow.steps.length) {
              setTotalProcessed(p => p + 1);
              setSuccessRate(p => Math.min(100, p + 0.1));
            }
            return { ...flow, currentStep: nextStep, steps: updatedSteps };
          }

          return { ...flow, steps: updatedSteps };
        }).filter(flow => {
          const timeSinceStart = Date.now() - flow.startTime;
          const totalLatency = flow.steps.reduce((sum, s) => sum + s.latency, 0);
          return timeSinceStart < totalLatency + 3000;
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoStart = setInterval(() => {
      if (Math.random() > 0.3) {
        startNewPayment();
      }
    }, 3000);

    return () => clearInterval(autoStart);
  }, []);

  const getStatusColor = (status: PaymentStep["status"]) => {
    switch (status) {
      case "completed": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "processing": return "text-primary bg-primary/10 border-primary/20 animate-pulse";
      case "failed": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted/30 border-muted";
    }
  };

  const getTotalLatency = (steps: PaymentStep[], upToStep: number) => {
    return steps.slice(0, upToStep + 1).reduce((sum, step) => sum + step.latency, 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Real-Time Payment Flow Visualization
        </h2>
        <p className="text-muted-foreground">Watch payments flow through the microservices architecture</p>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{activeFlows.length}</div>
          <div className="text-xs text-muted-foreground">Active Payments</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-secondary">{totalProcessed}</div>
          <div className="text-xs text-muted-foreground">Total Processed</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-accent">{successRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-service-infra">
            {activeFlows.length > 0 ? Math.round(
              activeFlows.reduce((sum, f) => 
                sum + getTotalLatency(f.steps, f.currentStep), 0
              ) / activeFlows.length
            ) : 0}ms
          </div>
          <div className="text-xs text-muted-foreground">Avg Processing Time</div>
        </Card>
      </div>

      {/* Control */}
      <div className="flex justify-center">
        <Button onClick={startNewPayment} className="gap-2">
          <DollarSign className="w-4 h-4" />
          Simulate New Payment
        </Button>
      </div>

      {/* Payment Flow Steps Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Payment Processing Pipeline
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {INITIAL_STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                <div className="text-muted-foreground">{step.icon()}</div>
                <div className="text-sm">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-xs text-muted-foreground">{step.latency}ms</div>
                </div>
              </div>
              {idx < INITIAL_STEPS.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Active Payment Flows */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Live Payment Transactions
        </h3>
        {activeFlows.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            No active payments. Click "Simulate New Payment" to start.
          </Card>
        )}
        {activeFlows.map(flow => {
          const totalLatency = getTotalLatency(flow.steps, flow.currentStep);
          const hasFailed = flow.steps.some(s => s.status === "failed");
          
          return (
            <Card key={flow.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {flow.id.slice(-8)}
                  </Badge>
                  <div className="text-lg font-bold">
                    {flow.currency} {flow.amount.toLocaleString()}
                  </div>
                  {hasFailed ? (
                    <Badge variant="destructive">Failed</Badge>
                  ) : flow.currentStep >= flow.steps.length ? (
                    <Badge className="bg-green-500">Completed</Badge>
                  ) : (
                    <Badge variant="secondary">Processing</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {totalLatency}ms elapsed
                </div>
              </div>

              {/* Flow visualization */}
              <div className="relative">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {flow.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                      <div className={`
                        relative flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all
                        ${getStatusColor(step.status)}
                        ${step.status === "processing" ? "scale-110" : ""}
                      `}>
                        <div className="relative">
                          {step.icon()}
                          {step.status === "processing" && (
                            <div className="absolute -inset-1 border-2 border-primary rounded-full animate-ping" />
                          )}
                        </div>
                        <div className="text-xs font-medium text-center min-w-[80px]">
                          {step.name}
                        </div>
                        {step.status !== "pending" && (
                          <div className="text-[10px] text-muted-foreground">
                            {step.latency}ms
                          </div>
                        )}
                        {step.status === "completed" && (
                          <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                        )}
                      </div>
                      {idx < flow.steps.length - 1 && (
                        <ArrowRight className={`
                          w-5 h-5 flex-shrink-0
                          ${step.status === "completed" ? "text-primary" : "text-muted"}
                        `} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Current step details */}
                {flow.currentStep < flow.steps.length && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {flow.steps[flow.currentStep]?.description}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
