import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Endpoint = "create-payment" | "get-payment" | "create-refund" | "create-payout" | "get-payout";

const endpointConfigs = {
  "create-payment": {
    method: "POST",
    path: "/v1/payments",
    description: "Create a new payment",
    examplePayload: {
      amount: 10000,
      currency: "NGN",
      customer: {
        email: "customer@example.com",
        name: "John Doe"
      },
      metadata: {
        order_id: "ORD-123"
      }
    }
  },
  "get-payment": {
    method: "GET",
    path: "/v1/payments/{payment_id}",
    description: "Get payment details",
    examplePayload: {}
  },
  "create-refund": {
    method: "POST",
    path: "/v1/payments/{payment_id}/refund",
    description: "Create a refund for a payment",
    examplePayload: {
      amount: 5000,
      reason: "Customer requested refund"
    }
  },
  "create-payout": {
    method: "POST",
    path: "/v1/payouts",
    description: "Create a new payout",
    examplePayload: {
      amount: 50000,
      currency: "NGN",
      recipient: {
        account_number: "1234567890",
        account_name: "John Doe",
        bank_code: "044"
      },
      narration: "Payment for services"
    }
  },
  "get-payout": {
    method: "GET",
    path: "/v1/payouts/{payout_id}",
    description: "Get payout details",
    examplePayload: {}
  }
};

export const ApiTesting = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>("create-payment");
  const [apiKey, setApiKey] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(endpointConfigs["create-payment"].examplePayload, null, 2)
  );
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEndpointChange = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpointConfigs[endpoint].examplePayload, null, 2));
    setResponse(null);
    setResourceId("");
  };

  const handleTest = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key",
        variant: "destructive"
      });
      return;
    }

    const config = endpointConfigs[selectedEndpoint];
    
    if (config.path.includes("{") && !resourceId) {
      toast({
        title: "Resource ID Required",
        description: "Please enter the resource ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResponses = {
        "create-payment": {
          status: 201,
          data: {
            id: "pay_" + Math.random().toString(36).substr(2, 9),
            amount: 10000,
            currency: "NGN",
            status: "pending",
            customer: { email: "customer@example.com", name: "John Doe" },
            created_at: new Date().toISOString()
          }
        },
        "get-payment": {
          status: 200,
          data: {
            id: resourceId || "pay_abc123",
            amount: 10000,
            currency: "NGN",
            status: "completed",
            customer: { email: "customer@example.com", name: "John Doe" },
            completed_at: new Date().toISOString()
          }
        },
        "create-refund": {
          status: 201,
          data: {
            id: "ref_" + Math.random().toString(36).substr(2, 9),
            payment_id: resourceId || "pay_abc123",
            amount: 5000,
            status: "processing",
            reason: "Customer requested refund",
            created_at: new Date().toISOString()
          }
        },
        "create-payout": {
          status: 201,
          data: {
            id: "out_" + Math.random().toString(36).substr(2, 9),
            amount: 50000,
            currency: "NGN",
            status: "initiated",
            recipient: {
              account_number: "1234567890",
              account_name: "John Doe",
              bank_code: "044"
            },
            created_at: new Date().toISOString()
          }
        },
        "get-payout": {
          status: 200,
          data: {
            id: resourceId || "out_def456",
            amount: 50000,
            currency: "NGN",
            status: "settled",
            recipient: {
              account_number: "1234567890",
              account_name: "John Doe",
              bank_code: "044"
            },
            settled_at: new Date().toISOString()
          }
        }
      };

      setResponse(mockResponses[selectedEndpoint]);
      setLoading(false);
      toast({
        title: "Request Sent",
        description: "API request completed successfully"
      });
    }, 1500);
  };

  const config = endpointConfigs[selectedEndpoint];
  const requiresResourceId = config.path.includes("{");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            API Testing Tools
          </CardTitle>
          <CardDescription>
            Test API endpoints with real-time requests and responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Endpoint Selection */}
          <div className="space-y-2">
            <Label>Select Endpoint</Label>
            <Select value={selectedEndpoint} onValueChange={(val) => handleEndpointChange(val as Endpoint)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create-payment">Create Payment</SelectItem>
                <SelectItem value="get-payment">Get Payment</SelectItem>
                <SelectItem value="create-refund">Create Refund</SelectItem>
                <SelectItem value="create-payout">Create Payout</SelectItem>
                <SelectItem value="get-payout">Get Payout</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>

          {/* Endpoint Details */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">{config.method}</Badge>
            <code className="text-sm bg-muted/50 px-2 py-1 rounded">
              https://api.ndelpay.com{config.path}
            </code>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder="sk_test_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your secret API key (test mode)
            </p>
          </div>

          {/* Resource ID Input (conditional) */}
          {requiresResourceId && (
            <div className="space-y-2">
              <Label>
                {selectedEndpoint.includes("payment") ? "Payment ID" : "Payout ID"}
              </Label>
              <Input
                placeholder={selectedEndpoint.includes("payment") ? "pay_abc123" : "out_def456"}
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
              />
            </div>
          )}

          {/* Request Body (for POST requests) */}
          {config.method === "POST" && (
            <div className="space-y-2">
              <Label>Request Body</Label>
              <Textarea
                className="font-mono text-sm"
                rows={12}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            </div>
          )}

          {/* Send Request Button */}
          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Send Request
              </>
            )}
          </Button>

          {/* Response */}
          {response && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Response</Label>
                <Badge variant={response.status < 300 ? "default" : "destructive"}>
                  {response.status} {response.status < 300 ? "Success" : "Error"}
                </Badge>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is a mock testing interface. In production, replace with actual API calls to https://api.ndelpay.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
