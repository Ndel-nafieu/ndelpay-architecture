import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, Clock, AlertTriangle, Link2,
  DollarSign, Banknote, TrendingUp, RefreshCw, Link2Off
} from "lucide-react";

interface Transaction {
  id: string;
  type: "payment" | "payout";
  amount: number;
  currency: string;
  timestamp: number;
  status: "processing" | "completed" | "failed";
  linkedTransactionId?: string;
}

interface ReconciliationRecord {
  id: string;
  paymentId: string;
  payoutId?: string;
  amount: number;
  currency: string;
  status: "matched" | "unmatched" | "pending_settlement" | "settled";
  settlementStage: number; // 0-4
  createdAt: number;
  settledAt?: number;
}

const SETTLEMENT_STAGES = [
  { name: "Payment Received", icon: () => <DollarSign className="w-4 h-4" /> },
  { name: "Clearing", icon: () => <RefreshCw className="w-4 h-4" /> },
  { name: "Settlement Pool", icon: () => <TrendingUp className="w-4 h-4" /> },
  { name: "Payout Initiated", icon: () => <Banknote className="w-4 h-4" /> },
  { name: "Settled", icon: () => <CheckCircle2 className="w-4 h-4" /> }
];

export const ReconciliationView = () => {
  const [records, setRecords] = useState<ReconciliationRecord[]>([]);
  const [totalMatched, setTotalMatched] = useState(0);
  const [totalUnmatched, setTotalUnmatched] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const createNewRecord = () => {
    const amount = Math.floor(Math.random() * 50000) + 5000;
    const newRecord: ReconciliationRecord = {
      id: `rec-${Date.now()}`,
      paymentId: `pay-${Date.now()}`,
      payoutId: Math.random() > 0.2 ? `out-${Date.now()}` : undefined,
      amount,
      currency: "NGN",
      status: Math.random() > 0.2 ? "pending_settlement" : "unmatched",
      settlementStage: 0,
      createdAt: Date.now()
    };

    setRecords(prev => [newRecord, ...prev].slice(0, 10));
    
    if (newRecord.status === "unmatched") {
      setTotalUnmatched(p => p + 1);
    } else {
      setTotalPending(p => p + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRecords(prev => {
        return prev.map(record => {
          if (record.status === "settled") {
            return record;
          }

          // Unmatched records occasionally get matched
          if (record.status === "unmatched" && Math.random() < 0.1) {
            setTotalUnmatched(p => Math.max(0, p - 1));
            setTotalPending(p => p + 1);
            return {
              ...record,
              payoutId: `out-${Date.now()}`,
              status: "pending_settlement" as const,
              settlementStage: 0
            };
          }

          // Progress settlement stages
          if (record.status === "pending_settlement") {
            const timeSinceCreation = Date.now() - record.createdAt;
            const stageInterval = 2000; // 2 seconds per stage
            const expectedStage = Math.min(
              Math.floor(timeSinceCreation / stageInterval),
              SETTLEMENT_STAGES.length - 1
            );

            if (expectedStage > record.settlementStage) {
              const newStage = record.settlementStage + 1;
              
              if (newStage >= SETTLEMENT_STAGES.length - 1) {
                setTotalPending(p => Math.max(0, p - 1));
                setTotalMatched(p => p + 1);
                return {
                  ...record,
                  status: "settled" as const,
                  settlementStage: newStage,
                  settledAt: Date.now()
                };
              }

              return {
                ...record,
                settlementStage: newStage
              };
            }
          }

          return record;
        });
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoCreate = setInterval(() => {
      if (records.length < 10 && Math.random() > 0.5) {
        createNewRecord();
      }
    }, 3000);

    return () => clearInterval(autoCreate);
  }, [records.length]);

  const getStatusColor = (status: ReconciliationRecord["status"]) => {
    switch (status) {
      case "settled": return "bg-green-500";
      case "matched": return "bg-blue-500";
      case "pending_settlement": return "bg-yellow-500";
      case "unmatched": return "bg-destructive";
    }
  };

  const getStatusBadge = (status: ReconciliationRecord["status"]) => {
    switch (status) {
      case "settled":
        return <Badge className="bg-green-500 gap-1"><CheckCircle2 className="w-3 h-3" />Settled</Badge>;
      case "matched":
        return <Badge className="bg-blue-500 gap-1"><Link2 className="w-3 h-3" />Matched</Badge>;
      case "pending_settlement":
        return <Badge className="bg-yellow-500 gap-1"><Clock className="w-3 h-3" />Settling</Badge>;
      case "unmatched":
        return <Badge variant="destructive" className="gap-1"><Link2Off className="w-3 h-3" />Unmatched</Badge>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Transaction Reconciliation Dashboard
        </h2>
        <p className="text-muted-foreground">Real-time payment and payout matching with settlement tracking</p>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-500">{totalMatched}</div>
          <div className="text-xs text-muted-foreground">Settled Transactions</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-500">{totalPending}</div>
          <div className="text-xs text-muted-foreground">Pending Settlement</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-destructive">{totalUnmatched}</div>
          <div className="text-xs text-muted-foreground">Unmatched Records</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {totalMatched + totalPending + totalUnmatched}
          </div>
          <div className="text-xs text-muted-foreground">Total Processed</div>
        </Card>
      </div>

      {/* Control */}
      <div className="flex justify-center">
        <Button onClick={createNewRecord} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Create New Transaction
        </Button>
      </div>

      {/* Settlement Flow Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Settlement Flow Process
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {SETTLEMENT_STAGES.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                <div className="text-muted-foreground">{stage.icon()}</div>
                <div className="text-sm font-medium">{stage.name}</div>
              </div>
              {idx < SETTLEMENT_STAGES.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Reconciliation Records */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          Live Reconciliation Records
        </h3>
        {records.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            No reconciliation records. Click "Create New Transaction" to start.
          </Card>
        )}
        {records.map(record => {
          const timeSinceCreation = Date.now() - record.createdAt;
          const settlementTime = record.settledAt 
            ? Math.round((record.settledAt - record.createdAt) / 1000)
            : Math.round(timeSinceCreation / 1000);

          return (
            <Card key={record.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {record.id.slice(-8)}
                  </Badge>
                  <div className="text-lg font-bold">
                    {record.currency} {record.amount.toLocaleString()}
                  </div>
                  {getStatusBadge(record.status)}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {settlementTime}s
                </div>
              </div>

              {/* Transaction IDs */}
              <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-primary" />
                  <span className="text-muted-foreground">Payment:</span>
                  <code className="bg-muted px-2 py-1 rounded">{record.paymentId.slice(-8)}</code>
                </div>
                {record.payoutId ? (
                  <>
                    <Link2 className="w-3 h-3 text-green-500" />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-3 h-3 text-secondary" />
                      <span className="text-muted-foreground">Payout:</span>
                      <code className="bg-muted px-2 py-1 rounded">{record.payoutId.slice(-8)}</code>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-xs">Awaiting payout match</span>
                  </div>
                )}
              </div>

              {/* Settlement Progress */}
              {record.status !== "unmatched" && (
                <div className="relative">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {SETTLEMENT_STAGES.map((stage, idx) => {
                      const isCompleted = idx < record.settlementStage;
                      const isActive = idx === record.settlementStage;
                      const isPending = idx > record.settlementStage;

                      return (
                        <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                          <div className={`
                            relative flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all
                            ${isCompleted ? "text-green-500 bg-green-500/10 border-green-500/20" : ""}
                            ${isActive ? "text-primary bg-primary/10 border-primary/20 animate-pulse scale-110" : ""}
                            ${isPending ? "text-muted-foreground bg-muted/30 border-muted" : ""}
                          `}>
                            <div className="relative">
                              {stage.icon()}
                              {isActive && (
                                <div className="absolute -inset-1 border-2 border-primary rounded-full animate-ping" />
                              )}
                            </div>
                            <div className="text-xs font-medium text-center min-w-[80px]">
                              {stage.name}
                            </div>
                            {isCompleted && (
                              <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                            )}
                          </div>
                          {idx < SETTLEMENT_STAGES.length - 1 && (
                            <ArrowRight className={`
                              w-5 h-5 flex-shrink-0
                              ${isCompleted ? "text-green-500" : "text-muted"}
                            `} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unmatched State */}
              {record.status === "unmatched" && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Payment received but no matching payout found. Awaiting reconciliation...</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
