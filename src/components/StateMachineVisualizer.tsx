import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, XCircle, PlayCircle } from "lucide-react";

interface State {
  id: string;
  name: string;
  type: "initial" | "intermediate" | "terminal" | "error";
  description: string;
}

interface Transition {
  from: string;
  to: string;
  trigger: string;
  condition?: string;
  timeout?: string;
}

const paymentStates: State[] = [
  { id: "pending", name: "Pending", type: "initial", description: "Payment initiated by customer" },
  { id: "validating", name: "Validating", type: "intermediate", description: "Validating payment details" },
  { id: "fraud_check", name: "Fraud Check", type: "intermediate", description: "Running fraud detection" },
  { id: "processing", name: "Processing", type: "intermediate", description: "Payment being processed by provider" },
  { id: "clearing", name: "Clearing", type: "intermediate", description: "Funds clearing through banking system" },
  { id: "completed", name: "Completed", type: "terminal", description: "Payment successfully completed" },
  { id: "failed", name: "Failed", type: "error", description: "Payment failed" },
  { id: "expired", name: "Expired", type: "error", description: "Payment session expired" },
  { id: "cancelled", name: "Cancelled", type: "error", description: "Payment cancelled by user" },
];

const paymentTransitions: Transition[] = [
  { from: "pending", to: "validating", trigger: "API Request", condition: "Valid payload" },
  { from: "pending", to: "expired", trigger: "Timeout", timeout: "15 minutes" },
  { from: "validating", to: "fraud_check", trigger: "Validation Passed" },
  { from: "validating", to: "failed", trigger: "Validation Failed", condition: "Invalid details" },
  { from: "fraud_check", to: "processing", trigger: "Fraud Check Passed" },
  { from: "fraud_check", to: "failed", trigger: "Fraud Detected", condition: "Risk score > threshold" },
  { from: "processing", to: "clearing", trigger: "Provider Confirmed" },
  { from: "processing", to: "failed", trigger: "Provider Rejected", condition: "Insufficient funds, etc." },
  { from: "clearing", to: "completed", trigger: "Funds Cleared" },
  { from: "clearing", to: "failed", trigger: "Clearing Failed", timeout: "72 hours" },
  { from: "pending", to: "cancelled", trigger: "User Action" },
  { from: "validating", to: "cancelled", trigger: "User Action" },
];

const payoutStates: State[] = [
  { id: "initiated", name: "Initiated", type: "initial", description: "Payout request created" },
  { id: "kyc_check", name: "KYC Check", type: "intermediate", description: "Verifying recipient KYC status" },
  { id: "balance_check", name: "Balance Check", type: "intermediate", description: "Verifying wallet balance" },
  { id: "scheduled", name: "Scheduled", type: "intermediate", description: "Payout scheduled for processing" },
  { id: "processing", name: "Processing", type: "intermediate", description: "Processing payout to recipient" },
  { id: "settled", name: "Settled", type: "terminal", description: "Payout successfully settled" },
  { id: "failed", name: "Failed", type: "error", description: "Payout failed" },
  { id: "rejected", name: "Rejected", type: "error", description: "Payout rejected due to compliance" },
];

const payoutTransitions: Transition[] = [
  { from: "initiated", to: "kyc_check", trigger: "API Request" },
  { from: "kyc_check", to: "balance_check", trigger: "KYC Verified" },
  { from: "kyc_check", to: "rejected", trigger: "KYC Failed", condition: "Incomplete or invalid KYC" },
  { from: "balance_check", to: "scheduled", trigger: "Balance Sufficient" },
  { from: "balance_check", to: "failed", trigger: "Insufficient Balance" },
  { from: "scheduled", to: "processing", trigger: "Batch Scheduled", condition: "Based on settlement schedule" },
  { from: "processing", to: "settled", trigger: "Provider Confirmed" },
  { from: "processing", to: "failed", trigger: "Provider Rejected", condition: "Invalid account, etc." },
];

export const StateMachineVisualizer = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [flowType, setFlowType] = useState<"payment" | "payout">("payment");

  const states = flowType === "payment" ? paymentStates : payoutStates;
  const transitions = flowType === "payment" ? paymentTransitions : payoutTransitions;

  const getStateIcon = (type: State["type"]) => {
    switch (type) {
      case "initial": return <PlayCircle className="h-4 w-4" />;
      case "intermediate": return <Clock className="h-4 w-4" />;
      case "terminal": return <CheckCircle2 className="h-4 w-4" />;
      case "error": return <XCircle className="h-4 w-4" />;
    }
  };

  const getStateColor = (type: State["type"]) => {
    switch (type) {
      case "initial": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "intermediate": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "terminal": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "error": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getRelatedTransitions = (stateId: string) => {
    return transitions.filter(t => t.from === stateId || t.to === stateId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>State Machine Visualizer</CardTitle>
          <CardDescription>
            Interactive visualization of payment and payout state transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={flowType} onValueChange={(v) => setFlowType(v as "payment" | "payout")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="payment">Payment Flow</TabsTrigger>
              <TabsTrigger value="payout">Payout Flow</TabsTrigger>
            </TabsList>

            <TabsContent value={flowType} className="space-y-6">
              {/* Mermaid Diagram */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Flow Diagram</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
{flowType === "payment" ? `stateDiagram-v2
    [*] --> Pending
    Pending --> Validating: API Request
    Pending --> Expired: Timeout (15m)
    Pending --> Cancelled: User Action
    Validating --> FraudCheck: Validation Passed
    Validating --> Failed: Validation Failed
    Validating --> Cancelled: User Action
    FraudCheck --> Processing: Fraud Check Passed
    FraudCheck --> Failed: Fraud Detected
    Processing --> Clearing: Provider Confirmed
    Processing --> Failed: Provider Rejected
    Clearing --> Completed: Funds Cleared
    Clearing --> Failed: Clearing Failed (72h)
    Completed --> [*]
    Failed --> [*]
    Expired --> [*]
    Cancelled --> [*]` : `stateDiagram-v2
    [*] --> Initiated
    Initiated --> KYCCheck: API Request
    KYCCheck --> BalanceCheck: KYC Verified
    KYCCheck --> Rejected: KYC Failed
    BalanceCheck --> Scheduled: Balance Sufficient
    BalanceCheck --> Failed: Insufficient Balance
    Scheduled --> Processing: Batch Scheduled
    Processing --> Settled: Provider Confirmed
    Processing --> Failed: Provider Rejected
    Settled --> [*]
    Failed --> [*]
    Rejected --> [*]`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* States Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Available States</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {states.map((state) => (
                    <Button
                      key={state.id}
                      variant="outline"
                      className={`h-auto p-4 flex flex-col items-start gap-2 ${
                        selectedState === state.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedState(state.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {getStateIcon(state.type)}
                        <span className="font-medium text-sm">{state.name}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStateColor(state.type)}`}>
                        {state.type}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected State Details */}
              {selectedState && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getStateIcon(states.find(s => s.id === selectedState)?.type!)}
                      {states.find(s => s.id === selectedState)?.name}
                    </CardTitle>
                    <CardDescription>
                      {states.find(s => s.id === selectedState)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Transitions from this state
                      </h4>
                      <div className="space-y-2">
                        {getRelatedTransitions(selectedState)
                          .filter(t => t.from === selectedState)
                          .map((transition, idx) => (
                            <Card key={idx}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline">{transition.trigger}</Badge>
                                      <span className="text-sm text-muted-foreground">→</span>
                                      <Badge>{states.find(s => s.id === transition.to)?.name}</Badge>
                                    </div>
                                    {transition.condition && (
                                      <p className="text-xs text-muted-foreground">
                                        Condition: {transition.condition}
                                      </p>
                                    )}
                                    {transition.timeout && (
                                      <p className="text-xs text-muted-foreground">
                                        Timeout: {transition.timeout}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Transitions to this state</h4>
                      <div className="space-y-2">
                        {getRelatedTransitions(selectedState)
                          .filter(t => t.to === selectedState)
                          .map((transition, idx) => (
                            <Card key={idx}>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                  <Badge>{states.find(s => s.id === transition.from)?.name}</Badge>
                                  <span className="text-sm text-muted-foreground">→</span>
                                  <Badge variant="outline">{transition.trigger}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
