import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";

interface SequenceFlow {
  id: string;
  title: string;
  description: string;
  diagram: string;
  codeExample?: string;
}

const sequences: SequenceFlow[] = [
  {
    id: "payment",
    title: "Payment Creation Flow",
    description: "End-to-end sequence for creating and processing a payment",
    diagram: `sequenceDiagram
    participant C as Customer
    participant API as API Gateway
    participant Auth as Auth Service
    participant Fraud as Fraud Detection
    participant Pay as Payment Service
    participant Wallet as Wallet Service
    participant Provider as Payment Provider
    participant DB as Database
    
    C->>API: POST /payments (amount, currency, method)
    API->>Auth: Validate API Key/JWT
    Auth-->>API: Token Valid
    API->>DB: Create Payment Record (status: pending)
    DB-->>API: Payment ID
    API->>Fraud: Check Transaction
    Fraud->>DB: Get User History
    DB-->>Fraud: Transaction History
    Fraud->>Fraud: Calculate Risk Score
    alt Risk Score High
        Fraud-->>API: Fraud Detected
        API->>DB: Update Status (failed)
        API-->>C: 403 Forbidden
    else Risk Score OK
        Fraud-->>API: Check Passed
        API->>Pay: Process Payment
        Pay->>Provider: Charge Request
        Provider-->>Pay: Charge Response
        alt Charge Failed
            Pay->>DB: Update Status (failed)
            Pay-->>API: Payment Failed
            API-->>C: 402 Payment Failed
        else Charge Success
            Pay->>Wallet: Credit Merchant Wallet
            Wallet->>DB: Update Wallet Balance
            Pay->>DB: Update Status (completed)
            Pay-->>API: Payment Success
            API-->>C: 200 Payment Created
        end
    end`,
    codeExample: `// Payment Creation Endpoint
POST /api/v1/payments
Authorization: Bearer {jwt_token}

{
  "amount": 10000,
  "currency": "NGN",
  "payment_method": "card",
  "customer": {
    "email": "customer@example.com",
    "phone": "+2348012345678"
  },
  "metadata": {
    "order_id": "ORD-123"
  }
}

// Response
{
  "id": "pay_abc123",
  "status": "completed",
  "amount": 10000,
  "currency": "NGN",
  "created_at": "2024-01-15T10:30:00Z"
}`
  },
  {
    id: "webhook",
    title: "Webhook Delivery Flow",
    description: "How webhooks are published, delivered, and retried",
    diagram: `sequenceDiagram
    participant Pay as Payment Service
    participant Queue as Event Queue
    participant WH as Webhook Service
    participant Merchant as Merchant Server
    participant DB as Database
    
    Pay->>Queue: Publish Event (payment.completed)
    Queue->>WH: Consume Event
    WH->>DB: Get Webhook Subscriptions
    DB-->>WH: Active Webhooks
    loop For Each Webhook
        WH->>WH: Generate HMAC Signature
        WH->>DB: Create Webhook Log (pending)
        WH->>Merchant: POST /webhook (signed)
        alt Response 200-299
            Merchant-->>WH: 200 OK
            WH->>DB: Update Log (delivered)
        else Response 4xx/5xx or Timeout
            Merchant-->>WH: Error/Timeout
            WH->>DB: Update Log (failed, attempt 1)
            Note over WH: Wait exponential backoff
            WH->>Merchant: Retry POST /webhook
            alt Max Retries (5) Exceeded
                WH->>DB: Update Log (failed, max_retries)
                WH->>DB: Create Alert
            else Retry Success
                Merchant-->>WH: 200 OK
                WH->>DB: Update Log (delivered)
            end
        end
    end`,
    codeExample: `// Webhook Endpoint (Merchant Side)
POST /webhooks/ndelpay
X-NdelPay-Signature: sha256=abc123...

{
  "event": "payment.completed",
  "data": {
    "id": "pay_abc123",
    "amount": 10000,
    "currency": "NGN",
    "status": "completed"
  },
  "created_at": "2024-01-15T10:30:00Z"
}

// Signature Verification
const crypto = require('crypto');
const signature = req.headers['x-ndelpay-signature'];
const payload = JSON.stringify(req.body);
const secret = process.env.WEBHOOK_SECRET;

const hmac = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (signature !== \`sha256=\${hmac}\`) {
  return res.status(401).send('Invalid signature');
}`
  },
  {
    id: "refund",
    title: "Refund Processing Flow",
    description: "Complete refund lifecycle from request to settlement",
    diagram: `sequenceDiagram
    participant M as Merchant
    participant API as API Gateway
    participant Auth as Auth Service
    participant Refund as Refund Service
    participant Wallet as Wallet Service
    participant Provider as Payment Provider
    participant DB as Database
    
    M->>API: POST /refunds (payment_id, amount)
    API->>Auth: Validate API Key
    Auth-->>API: Authenticated
    API->>DB: Get Payment Record
    DB-->>API: Payment Details
    alt Payment Not Found
        API-->>M: 404 Payment Not Found
    else Payment Cannot Be Refunded
        API-->>M: 400 Invalid Status
    else Valid Refund
        API->>DB: Create Refund Record (pending)
        DB-->>API: Refund ID
        API->>Refund: Process Refund
        Refund->>Wallet: Debit Merchant Wallet
        Wallet->>DB: Update Wallet Balance
        alt Insufficient Balance
            Wallet-->>Refund: Insufficient Funds
            Refund->>DB: Update Status (failed)
            Refund-->>API: Refund Failed
            API-->>M: 402 Insufficient Funds
        else Balance OK
            Wallet-->>Refund: Balance Updated
            Refund->>Provider: Refund Request
            Provider-->>Refund: Refund Confirmed
            Refund->>DB: Update Status (completed)
            Refund->>Wallet: Credit Customer Wallet
            Refund-->>API: Refund Success
            API-->>M: 200 Refund Created
        end
    end`,
    codeExample: `// Refund Request
POST /api/v1/refunds
Authorization: Bearer {jwt_token}

{
  "payment_id": "pay_abc123",
  "amount": 5000,
  "reason": "customer_request",
  "metadata": {
    "ticket_id": "SUP-456"
  }
}

// Response
{
  "id": "ref_xyz789",
  "payment_id": "pay_abc123",
  "amount": 5000,
  "status": "completed",
  "created_at": "2024-01-15T11:00:00Z"
}`
  },
  {
    id: "auth",
    title: "Authentication & Token Refresh",
    description: "JWT lifecycle with automatic token refresh",
    diagram: `sequenceDiagram
    participant C as Client
    participant API as API Gateway
    participant Auth as Auth Service
    participant DB as Database
    
    C->>API: POST /auth/login (email, password)
    API->>Auth: Validate Credentials
    Auth->>DB: Get User by Email
    DB-->>Auth: User Record
    Auth->>Auth: Verify Password Hash
    alt Invalid Credentials
        Auth-->>API: 401 Unauthorized
        API-->>C: 401 Invalid Credentials
    else Valid Credentials
        Auth->>Auth: Generate Access Token (15m)
        Auth->>Auth: Generate Refresh Token (7d)
        Auth->>DB: Store Refresh Token
        Auth-->>API: Tokens
        API-->>C: 200 {access_token, refresh_token}
    end
    
    Note over C: Access token expires after 15 minutes
    
    C->>API: GET /api/resource
    API->>Auth: Validate Access Token
    Auth-->>API: Token Expired
    API-->>C: 401 Token Expired
    
    C->>API: POST /auth/refresh (refresh_token)
    API->>Auth: Validate Refresh Token
    Auth->>DB: Check Refresh Token
    DB-->>Auth: Token Valid
    Auth->>Auth: Generate New Access Token
    Auth->>Auth: Rotate Refresh Token
    Auth->>DB: Update Refresh Token
    Auth-->>API: New Tokens
    API-->>C: 200 {access_token, refresh_token}
    
    C->>API: GET /api/resource (new access_token)
    API->>Auth: Validate Access Token
    Auth-->>API: Token Valid
    API-->>C: 200 Resource Data`,
    codeExample: `// Login Request
POST /api/v1/auth/login
{
  "email": "merchant@example.com",
  "password": "secure_password"
}

// Response
{
  "access_token": "eyJhbGc...",  // 15 min expiry
  "refresh_token": "eyJhbGc...", // 7 days expiry
  "expires_in": 900
}

// Auto-refresh Logic (Client)
async function apiCall(endpoint) {
  let response = await fetch(endpoint, {
    headers: { Authorization: \`Bearer \${accessToken}\` }
  });
  
  if (response.status === 401) {
    // Token expired, refresh it
    const refresh = await fetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    const tokens = await refresh.json();
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    
    // Retry original request
    response = await fetch(endpoint, {
      headers: { Authorization: \`Bearer \${accessToken}\` }
    });
  }
  
  return response;
}`
  }
];

export const SequenceDiagramViewer = () => {
  const [selectedFlow, setSelectedFlow] = useState(sequences[0].id);
  const currentFlow = sequences.find(s => s.id === selectedFlow)!;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sequence Diagram Viewer</CardTitle>
          <CardDescription>
            Detailed interaction flows showing how services communicate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedFlow} onValueChange={setSelectedFlow}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {sequences.map(seq => (
                <TabsTrigger key={seq.id} value={seq.id}>
                  {seq.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {sequences.map(flow => (
              <TabsContent key={flow.id} value={flow.id} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{flow.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{flow.description}</p>
                  <Badge variant="outline">Mermaid Sequence Diagram</Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sequence Flow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {flow.diagram}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {flow.codeExample && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Code Example
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {flow.codeExample}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
