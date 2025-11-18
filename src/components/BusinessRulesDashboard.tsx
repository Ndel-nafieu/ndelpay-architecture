import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calculator, Shield, Calendar, Percent } from "lucide-react";

export const BusinessRulesDashboard = () => {
  const [amount, setAmount] = useState("10000");
  const [tier, setTier] = useState<"tier_1" | "tier_2" | "tier_3">("tier_1");

  const calculateFee = (amt: number) => {
    const baseFee = amt * 0.015; // 1.5%
    const cappedFee = Math.min(baseFee, 2000); // Max 2000 NGN
    const minimumFee = Math.max(cappedFee, 100); // Min 100 NGN
    return minimumFee;
  };

  const fee = calculateFee(Number(amount));
  const netAmount = Number(amount) - fee;

  const tierLimits = {
    tier_1: {
      name: "Tier 1 (Unverified)",
      kyc: "None",
      single_transaction: 50000,
      daily_limit: 100000,
      monthly_limit: 500000,
      payout_allowed: false
    },
    tier_2: {
      name: "Tier 2 (Basic KYC)",
      kyc: "BVN + Phone",
      single_transaction: 500000,
      daily_limit: 2000000,
      monthly_limit: 10000000,
      payout_allowed: true
    },
    tier_3: {
      name: "Tier 3 (Full KYC)",
      kyc: "ID + Address + BVN",
      single_transaction: 5000000,
      daily_limit: 20000000,
      monthly_limit: 100000000,
      payout_allowed: true
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Rules Dashboard</CardTitle>
          <CardDescription>
            Transaction limits, fees, KYC tiers, and fraud rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fees" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fees">Fee Calculator</TabsTrigger>
              <TabsTrigger value="limits">Transaction Limits</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Rules</TabsTrigger>
              <TabsTrigger value="settlement">Settlement</TabsTrigger>
            </TabsList>

            <TabsContent value="fees" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Fee Structure Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Transaction Amount (NGN)
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Transaction</p>
                        <p className="text-2xl font-bold">₦{Number(amount).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Fee (1.5%)</p>
                        <p className="text-2xl font-bold text-orange-500">₦{fee.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Net Amount</p>
                        <p className="text-2xl font-bold text-green-500">₦{netAmount.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Fee Structure Rules</h4>
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-full justify-start">
                        <Percent className="h-3 w-3 mr-2" />
                        Base Rate: 1.5% of transaction amount
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <Percent className="h-3 w-3 mr-2" />
                        Minimum Fee: ₦100
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <Percent className="h-3 w-3 mr-2" />
                        Maximum Fee: ₦2,000 (capped)
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <Percent className="h-3 w-3 mr-2" />
                        International: Additional 3.5%
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Implementation</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`function calculateTransactionFee(amount, currency = 'NGN') {
  // Base fee: 1.5%
  let fee = amount * 0.015;
  
  // Apply cap: max 2000 NGN
  fee = Math.min(fee, 2000);
  
  // Apply floor: min 100 NGN
  fee = Math.max(fee, 100);
  
  // International surcharge
  if (currency !== 'NGN') {
    fee += amount * 0.035; // Additional 3.5%
  }
  
  return {
    gross_amount: amount,
    fee: fee,
    net_amount: amount - fee,
    fee_percentage: (fee / amount) * 100
  };
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limits" className="space-y-6">
              <div className="flex gap-2 mb-4">
                {(Object.keys(tierLimits) as Array<keyof typeof tierLimits>).map(t => (
                  <Badge
                    key={t}
                    variant={tier === t ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTier(t)}
                  >
                    {tierLimits[t].name}
                  </Badge>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{tierLimits[tier].name}</CardTitle>
                  <CardDescription>KYC Requirement: {tierLimits[tier].kyc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Single Transaction</p>
                        <p className="text-xl font-bold">
                          ₦{tierLimits[tier].single_transaction.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Daily Limit</p>
                        <p className="text-xl font-bold">
                          ₦{tierLimits[tier].daily_limit.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Monthly Limit</p>
                        <p className="text-xl font-bold">
                          ₦{tierLimits[tier].monthly_limit.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">Payout Allowed</p>
                        <p className="text-xl font-bold">
                          {tierLimits[tier].payout_allowed ? "✓ Yes" : "✗ No"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Limit Enforcement</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`async function validateTransactionLimits(userId, amount) {
  // Get user's KYC tier
  const user = await db.query(
    'SELECT kyc_tier FROM users WHERE id = $1',
    [userId]
  );
  
  const limits = TIER_LIMITS[user.kyc_tier];
  
  // Check single transaction limit
  if (amount > limits.single_transaction) {
    throw new Error(
      \`Transaction exceeds single limit of ₦\${limits.single_transaction}\`
    );
  }
  
  // Check daily limit
  const dailyTotal = await db.query(
    \`SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions
     WHERE user_id = $1
     AND created_at >= NOW() - INTERVAL '1 day'\`,
    [userId]
  );
  
  if (dailyTotal.rows[0].total + amount > limits.daily_limit) {
    throw new Error(
      \`Transaction exceeds daily limit of ₦\${limits.daily_limit}\`
    );
  }
  
  // Check monthly limit
  const monthlyTotal = await db.query(
    \`SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions
     WHERE user_id = $1
     AND created_at >= NOW() - INTERVAL '30 days'\`,
    [userId]
  );
  
  if (monthlyTotal.rows[0].total + amount > limits.monthly_limit) {
    throw new Error(
      \`Transaction exceeds monthly limit of ₦\${limits.monthly_limit}\`
    );
  }
  
  return true;
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fraud" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Fraud Detection Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Risk Scoring Rules</h4>
                    <div className="space-y-3">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium mb-1">Velocity Check</p>
                              <p className="text-sm text-muted-foreground">
                                More than 5 transactions in 1 minute
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                              +30 points
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium mb-1">Amount Anomaly</p>
                              <p className="text-sm text-muted-foreground">
                                Transaction 10x higher than average
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                              +40 points
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium mb-1">New Device</p>
                              <p className="text-sm text-muted-foreground">
                                Transaction from unrecognized device
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                              +20 points
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium mb-1">Geographic Anomaly</p>
                              <p className="text-sm text-muted-foreground">
                                IP location differs from user's country
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              +50 points
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium mb-1">Failed Login Attempts</p>
                              <p className="text-sm text-muted-foreground">
                                More than 3 failed logins in 10 minutes
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              +60 points
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-green-500/20">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Low Risk</p>
                        <p className="text-xl font-bold text-green-500">0-30</p>
                        <p className="text-xs text-muted-foreground mt-1">Auto-approve</p>
                      </CardContent>
                    </Card>
                    <Card className="border-yellow-500/20">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Medium Risk</p>
                        <p className="text-xl font-bold text-yellow-500">31-70</p>
                        <p className="text-xs text-muted-foreground mt-1">Manual review</p>
                      </CardContent>
                    </Card>
                    <Card className="border-red-500/20">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">High Risk</p>
                        <p className="text-xl font-bold text-red-500">71-100</p>
                        <p className="text-xs text-muted-foreground mt-1">Block</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Implementation</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`async function calculateRiskScore(transaction) {
  let score = 0;
  
  // Velocity check
  const recentTxns = await countRecentTransactions(
    transaction.user_id, 
    60 // last 1 minute
  );
  if (recentTxns > 5) score += 30;
  
  // Amount anomaly
  const avgAmount = await getAverageAmount(transaction.user_id);
  if (transaction.amount > avgAmount * 10) score += 40;
  
  // New device
  const isNewDevice = await checkDeviceFingerprint(
    transaction.user_id,
    transaction.device_id
  );
  if (isNewDevice) score += 20;
  
  // Geographic anomaly
  const isAnomalousLocation = await checkIPLocation(
    transaction.user_id,
    transaction.ip_address
  );
  if (isAnomalousLocation) score += 50;
  
  return {
    score,
    action: score < 31 ? 'approve' : 
            score < 71 ? 'review' : 'block'
  };
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settlement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Settlement Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">T+1 Settlement</p>
                            <p className="text-sm text-muted-foreground">
                              Standard merchants (Tier 2+)
                            </p>
                          </div>
                          <Badge>Default</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Funds settled to merchant account next business day at 10:00 AM
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">Instant Settlement</p>
                            <p className="text-sm text-muted-foreground">
                              Premium merchants (Tier 3)
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Premium
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Funds available within 30 minutes. Additional 0.5% fee applies
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">T+3 Settlement</p>
                            <p className="text-sm text-muted-foreground">
                              New merchants (Tier 1, first 30 days)
                            </p>
                          </div>
                          <Badge variant="outline">New Merchant</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Funds held for 3 business days as risk mitigation
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Settlement Logic</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`async function determineSettlementSchedule(merchantId) {
  const merchant = await db.query(
    'SELECT kyc_tier, created_at FROM users WHERE id = $1',
    [merchantId]
  );
  
  const accountAge = Date.now() - merchant.created_at;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  
  // New merchants: T+3
  if (accountAge < thirtyDays) {
    return { 
      schedule: 'T+3',
      delay_days: 3,
      reason: 'New merchant risk period'
    };
  }
  
  // Premium merchants: Instant (if opted in)
  if (merchant.kyc_tier === 'tier_3') {
    const hasInstant = await checkInstantSettlement(merchantId);
    if (hasInstant) {
      return {
        schedule: 'INSTANT',
        delay_days: 0,
        additional_fee: 0.005 // 0.5%
      };
    }
  }
  
  // Standard: T+1
  return {
    schedule: 'T+1',
    delay_days: 1,
    settlement_time: '10:00 AM'
  };
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
