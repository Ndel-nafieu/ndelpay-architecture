import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, Lock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  auth: string;
  rateLimit: string;
  request: string;
  response: string;
  curl: string;
}

const endpoints: Record<string, Endpoint[]> = {
  payments: [
    {
      method: "POST",
      path: "/api/v1/payments",
      description: "Create a new payment transaction",
      auth: "API Key (Bearer Token)",
      rateLimit: "100 requests/minute",
      request: `{
  "amount": 5000,
  "currency": "USD",
  "customer_id": "cus_abc123",
  "payment_method": "card",
  "description": "Order #12345",
  "metadata": {
    "order_id": "12345",
    "customer_email": "user@example.com"
  }
}`,
      response: `{
  "id": "pay_xyz789",
  "status": "pending",
  "amount": 5000,
  "currency": "USD",
  "created_at": "2024-01-15T10:30:00Z",
  "processing_time_ms": 145,
  "authorization_code": "AUTH123456"
}`,
      curl: `curl -X POST https://api.payment.com/v1/payments \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 5000, "currency": "USD", "customer_id": "cus_abc123"}'`
    },
    {
      method: "GET",
      path: "/api/v1/payments/{id}",
      description: "Retrieve payment details by ID",
      auth: "API Key (Bearer Token)",
      rateLimit: "200 requests/minute",
      request: `// No request body required
// Path parameter: id (string)`,
      response: `{
  "id": "pay_xyz789",
  "status": "completed",
  "amount": 5000,
  "currency": "USD",
  "customer_id": "cus_abc123",
  "payment_method": "card",
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:30:03Z",
  "metadata": {
    "order_id": "12345"
  }
}`,
      curl: `curl -X GET https://api.payment.com/v1/payments/pay_xyz789 \\
  -H "Authorization: Bearer your_api_key"`
    },
    {
      method: "POST",
      path: "/api/v1/payments/{id}/refund",
      description: "Refund a completed payment",
      auth: "API Key (Bearer Token)",
      rateLimit: "50 requests/minute",
      request: `{
  "amount": 5000,
  "reason": "customer_request",
  "metadata": {
    "refund_reason": "Product returned"
  }
}`,
      response: `{
  "id": "rfnd_abc123",
  "payment_id": "pay_xyz789",
  "status": "processing",
  "amount": 5000,
  "created_at": "2024-01-15T11:00:00Z",
  "estimated_completion": "2024-01-15T11:05:00Z"
}`,
      curl: `curl -X POST https://api.payment.com/v1/payments/pay_xyz789/refund \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 5000, "reason": "customer_request"}'`
    }
  ],
  payouts: [
    {
      method: "POST",
      path: "/api/v1/payouts",
      description: "Create a new payout to merchant",
      auth: "API Key (Bearer Token)",
      rateLimit: "50 requests/minute",
      request: `{
  "merchant_id": "mer_xyz456",
  "amount": 10000,
  "currency": "USD",
  "destination": {
    "type": "bank_account",
    "account_number": "****1234",
    "routing_number": "123456789"
  },
  "metadata": {
    "settlement_period": "2024-01-15"
  }
}`,
      response: `{
  "id": "po_abc789",
  "status": "pending",
  "merchant_id": "mer_xyz456",
  "amount": 10000,
  "currency": "USD",
  "created_at": "2024-01-15T14:00:00Z",
  "estimated_arrival": "2024-01-17T09:00:00Z"
}`,
      curl: `curl -X POST https://api.payment.com/v1/payouts \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"merchant_id": "mer_xyz456", "amount": 10000, "currency": "USD"}'`
    },
    {
      method: "GET",
      path: "/api/v1/payouts/{id}",
      description: "Retrieve payout status and details",
      auth: "API Key (Bearer Token)",
      rateLimit: "200 requests/minute",
      request: `// No request body required
// Path parameter: id (string)`,
      response: `{
  "id": "po_abc789",
  "status": "completed",
  "merchant_id": "mer_xyz456",
  "amount": 10000,
  "currency": "USD",
  "created_at": "2024-01-15T14:00:00Z",
  "completed_at": "2024-01-17T09:15:00Z",
  "destination": {
    "type": "bank_account",
    "last4": "1234"
  }
}`,
      curl: `curl -X GET https://api.payment.com/v1/payouts/po_abc789 \\
  -H "Authorization: Bearer your_api_key"`
    },
    {
      method: "POST",
      path: "/api/v1/payouts/{id}/cancel",
      description: "Cancel a pending payout",
      auth: "API Key (Bearer Token)",
      rateLimit: "50 requests/minute",
      request: `{
  "reason": "requested_by_merchant",
  "metadata": {
    "cancellation_note": "Merchant requested hold"
  }
}`,
      response: `{
  "id": "po_abc789",
  "status": "cancelled",
  "cancelled_at": "2024-01-15T15:00:00Z",
  "cancellation_reason": "requested_by_merchant"
}`,
      curl: `curl -X POST https://api.payment.com/v1/payouts/po_abc789/cancel \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"reason": "requested_by_merchant"}'`
    }
  ],
  webhooks: [
    {
      method: "POST",
      path: "/api/v1/webhooks",
      description: "Register a webhook endpoint",
      auth: "API Key (Bearer Token)",
      rateLimit: "20 requests/minute",
      request: `{
  "url": "https://your-app.com/webhooks",
  "events": [
    "payment.completed",
    "payment.failed",
    "payout.completed"
  ],
  "secret": "whsec_your_secret"
}`,
      response: `{
  "id": "wh_123456",
  "url": "https://your-app.com/webhooks",
  "events": [
    "payment.completed",
    "payment.failed",
    "payout.completed"
  ],
  "status": "active",
  "created_at": "2024-01-15T10:00:00Z"
}`,
      curl: `curl -X POST https://api.payment.com/v1/webhooks \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://your-app.com/webhooks", "events": ["payment.completed"]}'`
    }
  ]
};

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  POST: "bg-green-500/10 text-green-500 border-green-500/20",
  PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  DELETE: "bg-red-500/10 text-red-500 border-red-500/20"
};

export function ApiDocumentation() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="text-3xl">API Documentation</CardTitle>
          <CardDescription className="text-base">
            Complete reference for integrating with our Payment & Payout APIs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Authentication</p>
                    <p className="text-sm text-muted-foreground">Bearer Token (API Key)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Base URL</p>
                    <p className="text-sm text-muted-foreground">https://api.payment.com/v1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Rate Limits</p>
                    <p className="text-sm text-muted-foreground">Varies by endpoint</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
          <TabsTrigger value="payments">Payments API</TabsTrigger>
          <TabsTrigger value="payouts">Payouts API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {categoryEndpoints.map((endpoint, idx) => (
              <Card key={`${category}-${idx}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${methodColors[endpoint.method]} font-mono`}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Auth:</span>
                      <Badge variant="outline" className="ml-2">{endpoint.auth}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rate Limit:</span>
                      <Badge variant="outline" className="ml-2">{endpoint.rateLimit}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="request">Request</TabsTrigger>
                      <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="curl" className="relative">
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{endpoint.curl}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(endpoint.curl, `curl-${category}-${idx}`)}
                        >
                          {copiedIndex === `curl-${category}-${idx}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="request" className="relative">
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{endpoint.request}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(endpoint.request, `req-${category}-${idx}`)}
                        >
                          {copiedIndex === `req-${category}-${idx}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="response" className="relative">
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{endpoint.response}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(endpoint.response, `res-${category}-${idx}`)}
                        >
                          {copiedIndex === `res-${category}-${idx}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}