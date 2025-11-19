import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Zap, Search, Clock, CheckCircle2 } from "lucide-react";

interface WebhookEvent {
  event: string;
  category: "payment" | "payout" | "wallet" | "kyc";
  description: string;
  payload: any;
  retryable: boolean;
}

const webhookEvents: WebhookEvent[] = [
  {
    event: "payment.created",
    category: "payment",
    description: "Fired when a new payment is initiated",
    retryable: true,
    payload: {
      id: "pay_abc123",
      amount: 10000,
      currency: "NGN",
      status: "pending",
      customer: { email: "customer@example.com" },
      metadata: { order_id: "ORD-123" },
      created_at: "2024-01-15T10:30:00Z"
    }
  },
  {
    event: "payment.processing",
    category: "payment",
    description: "Fired when payment moves to processing state",
    retryable: true,
    payload: {
      id: "pay_abc123",
      status: "processing",
      provider: "paystack",
      provider_reference: "ref_xyz789",
      updated_at: "2024-01-15T10:30:15Z"
    }
  },
  {
    event: "payment.completed",
    category: "payment",
    description: "Fired when payment is successfully completed",
    retryable: true,
    payload: {
      id: "pay_abc123",
      amount: 10000,
      currency: "NGN",
      status: "completed",
      fee: 150,
      net_amount: 9850,
      completed_at: "2024-01-15T10:30:45Z"
    }
  },
  {
    event: "payment.failed",
    category: "payment",
    description: "Fired when payment fails",
    retryable: true,
    payload: {
      id: "pay_abc123",
      status: "failed",
      error_code: "INSUFFICIENT_FUNDS",
      error_message: "Customer has insufficient funds",
      failed_at: "2024-01-15T10:30:30Z"
    }
  },
  {
    event: "payout.initiated",
    category: "payout",
    description: "Fired when a payout is initiated",
    retryable: true,
    payload: {
      id: "out_def456",
      amount: 50000,
      currency: "NGN",
      status: "initiated",
      recipient: { account_number: "1234567890", bank_code: "044" },
      created_at: "2024-01-15T11:00:00Z"
    }
  },
  {
    event: "payout.settled",
    category: "payout",
    description: "Fired when payout is successfully settled",
    retryable: true,
    payload: {
      id: "out_def456",
      status: "settled",
      settled_at: "2024-01-15T11:05:00Z"
    }
  },
  {
    event: "payout.failed",
    category: "payout",
    description: "Fired when payout fails",
    retryable: true,
    payload: {
      id: "out_def456",
      status: "failed",
      error_code: "INVALID_ACCOUNT",
      error_message: "Recipient account is invalid",
      failed_at: "2024-01-15T11:02:00Z"
    }
  },
  {
    event: "wallet.credited",
    category: "wallet",
    description: "Fired when wallet balance increases",
    retryable: true,
    payload: {
      wallet_id: "wal_ghi789",
      user_id: "user_123",
      amount: 10000,
      currency: "NGN",
      balance_before: 50000,
      balance_after: 60000,
      transaction_id: "txn_jkl012",
      created_at: "2024-01-15T10:30:45Z"
    }
  },
  {
    event: "wallet.debited",
    category: "wallet",
    description: "Fired when wallet balance decreases",
    retryable: true,
    payload: {
      wallet_id: "wal_ghi789",
      user_id: "user_123",
      amount: 5000,
      currency: "NGN",
      balance_before: 60000,
      balance_after: 55000,
      transaction_id: "txn_mno345",
      created_at: "2024-01-15T11:00:00Z"
    }
  },
  {
    event: "kyc.submitted",
    category: "kyc",
    description: "Fired when KYC documents are submitted",
    retryable: true,
    payload: {
      user_id: "user_123",
      kyc_id: "kyc_pqr678",
      status: "pending_review",
      submitted_at: "2024-01-15T09:00:00Z"
    }
  },
  {
    event: "kyc.approved",
    category: "kyc",
    description: "Fired when KYC is approved",
    retryable: true,
    payload: {
      user_id: "user_123",
      kyc_id: "kyc_pqr678",
      status: "approved",
      tier: "tier_2",
      approved_at: "2024-01-15T12:00:00Z"
    }
  },
  {
    event: "kyc.rejected",
    category: "kyc",
    description: "Fired when KYC is rejected",
    retryable: true,
    payload: {
      user_id: "user_123",
      kyc_id: "kyc_pqr678",
      status: "rejected",
      reason: "Document quality insufficient",
      rejected_at: "2024-01-15T12:00:00Z"
    }
  }
];

export const EventSystemVisualizer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);

  const filteredEvents = webhookEvents.filter(event => {
    const matchesSearch = event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment": return "bg-blue-500/10 text-blue-500";
      case "payout": return "bg-green-500/10 text-green-500";
      case "wallet": return "bg-purple-500/10 text-purple-500";
      case "kyc": return "bg-orange-500/10 text-orange-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event System Visualizer</CardTitle>
          <CardDescription>
            Webhook events, payloads, and delivery patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events">Events Catalog</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Flow</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "payment", "payout", "wallet", "kyc"].map(cat => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Events Grid */}
              <div className="grid gap-3">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.event}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-4 w-4" />
                            <code className="text-sm font-mono">{event.event}</code>
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Event Payload */}
              {selectedEvent && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {selectedEvent.event}
                    </CardTitle>
                    <CardDescription>{selectedEvent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Event Payload</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(selectedEvent.payload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Webhook Delivery Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`sequenceDiagram
    participant Service as Payment Service
    participant Queue as Event Queue
    participant Worker as Webhook Worker
    participant Merchant as Merchant Endpoint
    participant DB as Database
    
    Service->>Queue: Publish event.payment.completed
    Queue->>Worker: Dequeue event
    Worker->>DB: Get active webhook subscriptions
    DB-->>Worker: List of webhooks
    
    loop For each webhook
        Worker->>Worker: Generate HMAC signature
        Worker->>DB: Log attempt (pending)
        Worker->>Merchant: POST /webhook (with signature)
        
        alt Success (200-299)
            Merchant-->>Worker: 200 OK
            Worker->>DB: Update log (delivered)
        else Failure (4xx/5xx/timeout)
            Merchant-->>Worker: Error
            Worker->>DB: Update log (failed, attempt 1)
            
            Note over Worker: Exponential backoff
            
            loop Retry (max 5 times)
                Worker->>Merchant: POST /webhook (retry)
                alt Success
                    Merchant-->>Worker: 200 OK
                    Worker->>DB: Update log (delivered)
                else Max retries
                    Worker->>DB: Update log (permanently failed)
                    Worker->>DB: Create alert
                end
            end
        end
    end`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Retry Strategy</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Attempt 1: Immediate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Attempt 2: After 30 seconds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Attempt 3: After 2 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Attempt 4: After 10 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Attempt 5: After 1 hour</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Delivery Guarantees</h4>
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-full justify-start">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        At-least-once delivery
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        Events ordered within same resource
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        5 automatic retries with exponential backoff
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        HMAC signature for verification
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        Timeout after 30 seconds
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Webhook Implementation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Webhook Subscription</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`// Create webhook subscription
POST /api/v1/webhooks
Authorization: Bearer {jwt_token}

{
  "url": "https://merchant.com/webhooks/ndelpay",
  "events": [
    "payment.created",
    "payment.completed",
    "payment.failed"
  ],
  "secret": "whsec_abc123..." // Auto-generated
}

// Response
{
  "id": "wh_xyz789",
  "url": "https://merchant.com/webhooks/ndelpay",
  "events": ["payment.created", "payment.completed", "payment.failed"],
  "secret": "whsec_abc123...",
  "status": "active",
  "created_at": "2024-01-15T10:00:00Z"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Webhook Handler (Merchant Side)</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`const express = require('express');
const crypto = require('crypto');

app.post('/webhooks/ndelpay', express.json(), (req, res) => {
  const signature = req.headers['x-ndelpay-signature'];
  const payload = req.body;
  
  // Verify signature
  if (!verifySignature(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Handle event
  switch (payload.event) {
    case 'payment.completed':
      handlePaymentCompleted(payload.data);
      break;
    case 'payment.failed':
      handlePaymentFailed(payload.data);
      break;
    // ... other events
  }
  
  // Always return 200 to acknowledge receipt
  res.status(200).send('OK');
});

function verifySignature(payload, signature) {
  const secret = process.env.WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expected = 'sha256=' + hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

async function handlePaymentCompleted(payment) {
  // Update order status in your database
  await db.query(
    'UPDATE orders SET status = $1 WHERE payment_id = $2',
    ['completed', payment.id]
  );
  
  // Send confirmation email
  await sendEmail({
    to: payment.customer.email,
    subject: 'Payment Confirmed',
    body: \`Your payment of ${'${'}payment.amount} has been received.\`
  });
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
