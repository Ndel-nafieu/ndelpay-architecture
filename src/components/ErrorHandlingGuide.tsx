import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, RefreshCw, XCircle, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ErrorCode {
  code: string;
  status: number;
  title: string;
  description: string;
  category: "client" | "server" | "business" | "integration";
  retryable: boolean;
  action: string;
}

const errorCodes: ErrorCode[] = [
  {
    code: "INVALID_API_KEY",
    status: 401,
    title: "Invalid API Key",
    description: "The provided API key is invalid or has been revoked",
    category: "client",
    retryable: false,
    action: "Verify API key in dashboard and regenerate if needed"
  },
  {
    code: "INSUFFICIENT_FUNDS",
    status: 402,
    title: "Insufficient Funds",
    description: "Wallet balance is insufficient for this transaction",
    category: "business",
    retryable: false,
    action: "Fund wallet before retrying transaction"
  },
  {
    code: "RATE_LIMIT_EXCEEDED",
    status: 429,
    title: "Rate Limit Exceeded",
    description: "Too many requests. Rate limit exceeded",
    category: "client",
    retryable: true,
    action: "Wait for rate limit window to reset (check X-RateLimit-Reset header)"
  },
  {
    code: "PAYMENT_NOT_FOUND",
    status: 404,
    title: "Payment Not Found",
    description: "The requested payment ID does not exist",
    category: "client",
    retryable: false,
    action: "Verify payment ID is correct"
  },
  {
    code: "INVALID_PAYMENT_METHOD",
    status: 400,
    title: "Invalid Payment Method",
    description: "The payment method is not supported or invalid",
    category: "business",
    retryable: false,
    action: "Use supported payment methods: card, bank_transfer, ussd"
  },
  {
    code: "DUPLICATE_TRANSACTION",
    status: 409,
    title: "Duplicate Transaction",
    description: "Transaction with this idempotency key already exists",
    category: "business",
    retryable: false,
    action: "Use a different idempotency key or retrieve existing transaction"
  },
  {
    code: "KYC_VERIFICATION_FAILED",
    status: 403,
    title: "KYC Verification Failed",
    description: "User has not completed KYC verification",
    category: "business",
    retryable: false,
    action: "Complete KYC verification before proceeding"
  },
  {
    code: "FRAUD_DETECTED",
    status: 403,
    title: "Fraud Detected",
    description: "Transaction flagged by fraud detection system",
    category: "business",
    retryable: false,
    action: "Contact support for manual review"
  },
  {
    code: "PROVIDER_TIMEOUT",
    status: 504,
    title: "Provider Timeout",
    description: "Payment provider did not respond in time",
    category: "integration",
    retryable: true,
    action: "Retry with exponential backoff. Check payment status separately"
  },
  {
    code: "DATABASE_ERROR",
    status: 500,
    title: "Database Error",
    description: "Internal database error occurred",
    category: "server",
    retryable: true,
    action: "Retry after a short delay. If persists, contact support"
  },
  {
    code: "SERVICE_UNAVAILABLE",
    status: 503,
    title: "Service Unavailable",
    description: "Service temporarily unavailable",
    category: "server",
    retryable: true,
    action: "Retry with exponential backoff up to 5 times"
  },
  {
    code: "INVALID_WEBHOOK_SIGNATURE",
    status: 401,
    title: "Invalid Webhook Signature",
    description: "Webhook signature verification failed",
    category: "client",
    retryable: false,
    action: "Verify webhook secret and signature computation"
  }
];

const retryStrategies = [
  {
    name: "Exponential Backoff",
    description: "Retry with increasing delays between attempts",
    code: `async function retryWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (!isRetryableError(error)) throw error;
      
      const delay = Math.min(1000 * Math.pow(2, i), 30000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function isRetryableError(error) {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.status);
}`
  },
  {
    name: "Idempotency Pattern",
    description: "Prevent duplicate processing using idempotency keys",
    code: `// Client generates unique idempotency key
const idempotencyKey = crypto.randomUUID();

const response = await fetch('/api/payments', {
  method: 'POST',
  headers: {
    'Idempotency-Key': idempotencyKey,
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify(paymentData)
});

// Server-side implementation
async function processPayment(req, res) {
  const key = req.headers['idempotency-key'];
  
  // Check if request already processed
  const existing = await db.query(
    'SELECT * FROM idempotent_requests WHERE key = $1',
    [key]
  );
  
  if (existing.rows.length > 0) {
    return res.json(existing.rows[0].response);
  }
  
  // Process new request
  const result = await createPayment(req.body);
  
  // Store result with idempotency key
  await db.query(
    'INSERT INTO idempotent_requests (key, response) VALUES ($1, $2)',
    [key, result]
  );
  
  return res.json(result);
}`
  },
  {
    name: "Circuit Breaker",
    description: "Stop making requests to failing services",
    code: `class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}`
  },
  {
    name: "Dead Letter Queue",
    description: "Handle permanently failed transactions",
    code: `// After max retries, move to DLQ
async function processWithDLQ(transaction) {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await processTransaction(transaction);
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries) {
        // Move to dead letter queue
        await db.query(
          \`INSERT INTO dead_letter_queue 
           (transaction_id, error, attempts, created_at)
           VALUES ($1, $2, $3, NOW())\`,
          [transaction.id, error.message, attempt]
        );
        
        // Alert monitoring system
        await alertMonitoring({
          type: 'DLQ_ENTRY',
          transaction_id: transaction.id,
          error: error.message
        });
        
        throw new Error('Transaction moved to DLQ');
      }
      
      await exponentialBackoff(attempt);
    }
  }
}`
  }
];

export const ErrorHandlingGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredErrors = errorCodes.filter(error => {
    const matchesSearch = 
      error.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || error.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "client": return "bg-blue-500/10 text-blue-500";
      case "server": return "bg-red-500/10 text-red-500";
      case "business": return "bg-yellow-500/10 text-yellow-500";
      case "integration": return "bg-purple-500/10 text-purple-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Handling Guide</CardTitle>
          <CardDescription>
            Comprehensive error codes, retry strategies, and recovery patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="errors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="errors">Error Codes</TabsTrigger>
              <TabsTrigger value="strategies">Retry Strategies</TabsTrigger>
            </TabsList>

            <TabsContent value="errors" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search error codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "client", "server", "business", "integration"].map(cat => (
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

              {/* Error Codes Grid */}
              <div className="grid gap-4">
                {filteredErrors.map((error) => (
                  <Card key={error.code}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono">
                              {error.code}
                            </Badge>
                            <Badge variant="outline">{error.status}</Badge>
                            <Badge className={getCategoryColor(error.category)}>
                              {error.category}
                            </Badge>
                            {error.retryable && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retryable
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{error.title}</CardTitle>
                          <CardDescription>{error.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium mb-1">Recommended Action</p>
                          <p className="text-sm text-muted-foreground">{error.action}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-6">
              {retryStrategies.map((strategy, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      {strategy.name}
                    </CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {strategy.code}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Transaction Rollback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Transaction Rollback Pattern
                  </CardTitle>
                  <CardDescription>
                    Ensure atomicity across multiple operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`async function processPaymentWithRollback(paymentData) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Step 1: Create payment record
    const payment = await client.query(
      'INSERT INTO payments (...) VALUES (...) RETURNING *'
    );
    
    // Step 2: Debit customer wallet
    await client.query(
      'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
      [paymentData.amount, paymentData.customer_id]
    );
    
    // Step 3: Credit merchant wallet
    await client.query(
      'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2',
      [paymentData.amount, paymentData.merchant_id]
    );
    
    // Step 4: Create ledger entries
    await client.query(
      'INSERT INTO ledger_entries (...) VALUES (...)'
    );
    
    // All operations succeeded, commit
    await client.query('COMMIT');
    return payment.rows[0];
    
  } catch (error) {
    // Any failure rolls back all changes
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}`}
                    </pre>
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
