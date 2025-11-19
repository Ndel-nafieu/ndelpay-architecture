import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, Zap, ArrowRight } from "lucide-react";

interface TimelineStage {
  id: string;
  name: string;
  status: "completed" | "processing" | "pending" | "failed";
  description: string;
  duration: string;
  events: string[];
  details: string;
}

const successfulPaymentFlow: TimelineStage[] = [
  {
    id: "initiated",
    name: "Payment Initiated",
    status: "completed",
    description: "Customer initiates payment on merchant website",
    duration: "0s",
    events: ["payment.created"],
    details: "Customer fills payment form and submits. Payment record created with status 'pending'."
  },
  {
    id: "validation",
    name: "Request Validation",
    status: "completed",
    description: "API validates request parameters and merchant credentials",
    duration: "< 1s",
    events: [],
    details: "Validates amount, currency, customer data, API key, and merchant limits."
  },
  {
    id: "fraud-check",
    name: "Fraud Detection",
    status: "completed",
    description: "Risk engine evaluates transaction for fraud indicators",
    duration: "1-2s",
    events: [],
    details: "Checks customer history, velocity, device fingerprint, and suspicious patterns."
  },
  {
    id: "processing",
    name: "Processing",
    status: "completed",
    description: "Payment sent to provider for processing",
    duration: "2-5s",
    events: ["payment.processing"],
    details: "Payment forwarded to Paystack or bank API. Status updated to 'processing'."
  },
  {
    id: "provider-auth",
    name: "Provider Authorization",
    status: "completed",
    description: "Payment provider authorizes transaction with bank",
    duration: "5-15s",
    events: [],
    details: "Provider communicates with issuing bank for authorization. Customer may need OTP."
  },
  {
    id: "wallet-credit",
    name: "Wallet Credited",
    status: "completed",
    description: "Merchant wallet balance updated",
    duration: "< 1s",
    events: ["wallet.credited"],
    details: "Double-entry ledger records credit. Balance increased by net amount (after fees)."
  },
  {
    id: "completed",
    name: "Completed",
    status: "completed",
    description: "Payment successfully completed",
    duration: "< 1s",
    events: ["payment.completed"],
    details: "Final webhook sent. Transaction marked complete. Funds available for payout."
  }
];

const failedPaymentFlow: TimelineStage[] = [
  {
    id: "initiated",
    name: "Payment Initiated",
    status: "completed",
    description: "Customer initiates payment on merchant website",
    duration: "0s",
    events: ["payment.created"],
    details: "Customer fills payment form and submits. Payment record created with status 'pending'."
  },
  {
    id: "validation",
    name: "Request Validation",
    status: "completed",
    description: "API validates request parameters and merchant credentials",
    duration: "< 1s",
    events: [],
    details: "Validates amount, currency, customer data, API key, and merchant limits."
  },
  {
    id: "fraud-check",
    name: "Fraud Detection",
    status: "completed",
    description: "Risk engine evaluates transaction for fraud indicators",
    duration: "1-2s",
    events: [],
    details: "Checks customer history, velocity, device fingerprint, and suspicious patterns."
  },
  {
    id: "processing",
    name: "Processing",
    status: "completed",
    description: "Payment sent to provider for processing",
    duration: "2-5s",
    events: ["payment.processing"],
    details: "Payment forwarded to Paystack or bank API. Status updated to 'processing'."
  },
  {
    id: "provider-declined",
    name: "Provider Declined",
    status: "failed",
    description: "Payment provider declines transaction",
    duration: "5-15s",
    events: [],
    details: "Bank declines due to insufficient funds, invalid card, or other reasons."
  },
  {
    id: "failed",
    name: "Payment Failed",
    status: "failed",
    description: "Payment marked as failed",
    duration: "< 1s",
    events: ["payment.failed"],
    details: "Webhook sent with failure reason. Transaction marked failed. Customer notified."
  }
];

const payoutFlow: TimelineStage[] = [
  {
    id: "initiated",
    name: "Payout Initiated",
    status: "completed",
    description: "Merchant initiates payout request",
    duration: "0s",
    events: ["payout.initiated"],
    details: "Merchant requests withdrawal. System validates balance and recipient details."
  },
  {
    id: "validation",
    name: "Validation",
    status: "completed",
    description: "Validate wallet balance and recipient account",
    duration: "1-2s",
    events: [],
    details: "Checks sufficient balance, validates bank account number and bank code."
  },
  {
    id: "wallet-debit",
    name: "Wallet Debited",
    status: "completed",
    description: "Merchant wallet debited",
    duration: "< 1s",
    events: ["wallet.debited"],
    details: "Double-entry ledger records debit. Balance reduced by payout amount plus fees."
  },
  {
    id: "queued",
    name: "Queued for Processing",
    status: "completed",
    description: "Payout queued in settlement batch",
    duration: "0-60min",
    events: [],
    details: "Payouts batched for efficiency. Processing happens every hour or threshold reached."
  },
  {
    id: "processing",
    name: "Bank Processing",
    status: "completed",
    description: "Sent to bank for processing",
    duration: "5-30min",
    events: [],
    details: "Batch sent to bank via API. Bank processes transfer to recipient account."
  },
  {
    id: "settled",
    name: "Settled",
    status: "completed",
    description: "Funds settled in recipient account",
    duration: "< 1min",
    events: ["payout.settled"],
    details: "Bank confirms settlement. Final webhook sent. Payout complete."
  }
];

export const PaymentLifecycleTimeline = () => {
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null);
  const [activeFlow, setActiveFlow] = useState<"success" | "failed" | "payout">("success");

  const getCurrentFlow = () => {
    switch (activeFlow) {
      case "success":
        return successfulPaymentFlow;
      case "failed":
        return failedPaymentFlow;
      case "payout":
        return payoutFlow;
      default:
        return successfulPaymentFlow;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/20 text-green-500";
      case "failed":
        return "bg-red-500/10 border-red-500/20 text-red-500";
      case "processing":
        return "bg-blue-500/10 border-blue-500/20 text-blue-500";
      default:
        return "bg-muted/50 border-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Payment Lifecycle Timeline
          </CardTitle>
          <CardDescription>
            Complete journey from payment initiation to settlement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFlow} onValueChange={(val) => setActiveFlow(val as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="success">Successful Payment</TabsTrigger>
              <TabsTrigger value="failed">Failed Payment</TabsTrigger>
              <TabsTrigger value="payout">Payout Flow</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFlow} className="space-y-6">
              {/* Timeline */}
              <div className="relative">
                {getCurrentFlow().map((stage, index) => (
                  <div key={stage.id} className="relative">
                    {/* Timeline line */}
                    {index !== getCurrentFlow().length - 1 && (
                      <div className="absolute left-[21px] top-[40px] w-0.5 h-[calc(100%+16px)] bg-border" />
                    )}

                    {/* Stage card */}
                    <Card
                      className={`mb-4 cursor-pointer transition-all hover:border-primary/50 ${
                        selectedStage?.id === stage.id ? "border-primary/50 shadow-lg" : ""
                      }`}
                      onClick={() => setSelectedStage(stage)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Status icon */}
                          <div className="relative z-10 flex-shrink-0 mt-1">
                            {getStatusIcon(stage.status)}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h4 className="font-semibold">{stage.name}</h4>
                                <p className="text-sm text-muted-foreground">{stage.description}</p>
                              </div>
                              <Badge variant="outline" className="flex-shrink-0">
                                {stage.duration}
                              </Badge>
                            </div>

                            {/* Events */}
                            {stage.events.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {stage.events.map((event) => (
                                  <Badge
                                    key={event}
                                    className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                                  >
                                    <Zap className="h-3 w-3 mr-1" />
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Selected Stage Details */}
              {selectedStage && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getStatusIcon(selectedStage.status)}
                      {selectedStage.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Details</h4>
                      <p className="text-sm text-muted-foreground">{selectedStage.details}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <Badge variant="outline">{selectedStage.duration}</Badge>
                    </div>

                    {selectedStage.events.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Events Fired</h4>
                        <div className="space-y-2">
                          {selectedStage.events.map((event) => (
                            <div key={event} className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-purple-500" />
                              <code className="text-sm bg-muted/50 px-2 py-1 rounded">{event}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Total Processing Time</h4>
                  <p className="text-sm text-muted-foreground">
                    {activeFlow === "success" && "Typical successful payment: 15-30 seconds"}
                    {activeFlow === "failed" && "Typical failed payment: 10-20 seconds"}
                    {activeFlow === "payout" && "Typical payout: 1-2 hours (includes batching)"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
