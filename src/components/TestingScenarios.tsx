import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Zap, Shield, Users, TrendingUp } from "lucide-react";

export const TestingScenarios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Testing Scenarios</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive test cases, edge cases, and testing strategies
        </p>
      </div>

      <Tabs defaultValue="unit" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="unit">Unit Tests</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="e2e">E2E Tests</TabsTrigger>
          <TabsTrigger value="edge">Edge Cases</TabsTrigger>
          <TabsTrigger value="load">Load Testing</TabsTrigger>
          <TabsTrigger value="security">Security Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="unit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unit Test Examples</CardTitle>
              <CardDescription>Testing individual components and functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Payment Validation Tests
                </h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { validatePaymentRequest } from './payment-validator';

describe('Payment Validation', () => {
  test('should accept valid payment request', () => {
    const request = {
      amount: 1000,
      currency: 'USD',
      paymentMethod: 'credit_card',
      cardDetails: {
        number: '4242424242424242',
        expMonth: 12,
        expYear: 2025,
        cvv: '123'
      }
    };
    
    expect(validatePaymentRequest(request)).toEqual({ valid: true });
  });

  test('should reject negative amount', () => {
    const request = { amount: -100, currency: 'USD' };
    const result = validatePaymentRequest(request);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Amount must be positive');
  });

  test('should reject invalid currency code', () => {
    const request = { amount: 1000, currency: 'INVALID' };
    const result = validatePaymentRequest(request);
    
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid currency');
  });

  test('should reject expired card', () => {
    const request = {
      amount: 1000,
      currency: 'USD',
      cardDetails: {
        number: '4242424242424242',
        expMonth: 1,
        expYear: 2020, // Expired
        cvv: '123'
      }
    };
    
    const result = validatePaymentRequest(request);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('expired');
  });

  test('should validate amount precision for different currencies', () => {
    // JPY doesn't use decimal places
    expect(validatePaymentRequest({ 
      amount: 1000, 
      currency: 'JPY' 
    })).toEqual({ valid: true });
    
    // USD requires 2 decimal places
    expect(validatePaymentRequest({ 
      amount: 10.50, 
      currency: 'USD' 
    })).toEqual({ valid: true });
  });
});`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Fee Calculation Tests
                </h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { calculateFees } from './fee-calculator';

describe('Fee Calculation', () => {
  test('should calculate standard processing fee', () => {
    const result = calculateFees({
      amount: 10000, // $100.00
      currency: 'USD',
      merchantTier: 'standard'
    });
    
    expect(result.processingFee).toBe(290); // 2.9%
    expect(result.fixedFee).toBe(30); // $0.30
    expect(result.totalFee).toBe(320);
  });

  test('should apply volume discount for premium merchants', () => {
    const result = calculateFees({
      amount: 10000,
      currency: 'USD',
      merchantTier: 'premium'
    });
    
    expect(result.processingFee).toBe(250); // 2.5%
    expect(result.totalFee).toBe(280);
  });

  test('should handle international card fees', () => {
    const result = calculateFees({
      amount: 10000,
      currency: 'USD',
      merchantTier: 'standard',
      cardCountry: 'GB', // International card
      merchantCountry: 'US'
    });
    
    expect(result.internationalFee).toBe(100); // 1% international fee
    expect(result.totalFee).toBeGreaterThan(320);
  });

  test('should calculate fees for zero decimal currencies', () => {
    const result = calculateFees({
      amount: 10000, // ¥10,000
      currency: 'JPY',
      merchantTier: 'standard'
    });
    
    // Should handle JPY correctly (no decimal places)
    expect(result.totalFee).toBe(320);
  });
});`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  State Machine Tests
                </h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { PaymentStateMachine } from './state-machine';

describe('Payment State Machine', () => {
  let stateMachine;

  beforeEach(() => {
    stateMachine = new PaymentStateMachine();
  });

  test('should transition from pending to processing', () => {
    stateMachine.setState('pending');
    stateMachine.transition('process');
    
    expect(stateMachine.currentState).toBe('processing');
  });

  test('should not allow invalid transitions', () => {
    stateMachine.setState('pending');
    
    expect(() => {
      stateMachine.transition('refund');
    }).toThrow('Invalid transition');
  });

  test('should execute callbacks on state change', () => {
    const callback = jest.fn();
    stateMachine.on('succeeded', callback);
    
    stateMachine.setState('processing');
    stateMachine.transition('complete');
    
    expect(callback).toHaveBeenCalledWith({
      from: 'processing',
      to: 'succeeded'
    });
  });
});`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Test Examples</CardTitle>
              <CardDescription>Testing interactions between components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Payment API Integration</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import request from 'supertest';
import app from '../app';
import { setupTestDb, teardownTestDb } from './test-helpers';

describe('Payment API Integration', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  describe('POST /api/v1/payments', () => {
    test('should create payment and return payment object', async () => {
      const response = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          amount: 5000,
          currency: 'USD',
          source: 'tok_visa',
          description: 'Test payment'
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^pay_/),
        amount: 5000,
        currency: 'USD',
        status: 'pending'
      });
    });

    test('should reject payment with invalid API key', async () => {
      const response = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', 'Bearer invalid_key')
        .send({
          amount: 5000,
          currency: 'USD'
        });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('invalid_api_key');
    });

    test('should validate amount limits based on merchant tier', async () => {
      // Standard merchant with $10,000 limit
      const response = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', 'Bearer test_sk_standard')
        .send({
          amount: 1500000, // $15,000
          currency: 'USD'
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('amount_exceeds_limit');
    });

    test('should trigger webhook on payment success', async () => {
      const webhookSpy = jest.spyOn(webhookService, 'send');

      await request(app)
        .post('/api/v1/payments')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          amount: 5000,
          currency: 'USD',
          source: 'tok_visa'
        });

      // Wait for async webhook
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(webhookSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'payment.succeeded',
          data: expect.objectContaining({
            amount: 5000
          })
        })
      );
    });
  });

  describe('POST /api/v1/refunds', () => {
    test('should refund a payment', async () => {
      // Create payment first
      const payment = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          amount: 5000,
          currency: 'USD',
          source: 'tok_visa'
        });

      // Refund it
      const response = await request(app)
        .post('/api/v1/refunds')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          paymentId: payment.body.id,
          amount: 5000
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^ref_/),
        amount: 5000,
        status: 'pending'
      });

      // Verify payment status updated
      const updatedPayment = await request(app)
        .get(\`/api/v1/payments/\${payment.body.id}\`)
        .set('Authorization', 'Bearer test_sk_...');

      expect(updatedPayment.body.refunded).toBe(true);
    });

    test('should handle partial refunds', async () => {
      const payment = await createTestPayment(10000);

      const refund1 = await request(app)
        .post('/api/v1/refunds')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          paymentId: payment.id,
          amount: 3000
        });

      expect(refund1.status).toBe(201);

      const refund2 = await request(app)
        .post('/api/v1/refunds')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          paymentId: payment.id,
          amount: 2000
        });

      expect(refund2.status).toBe(201);

      // Verify payment shows partial refund
      const updatedPayment = await getPayment(payment.id);
      expect(updatedPayment.amountRefunded).toBe(5000);
      expect(updatedPayment.refunded).toBe(false);
    });
  });
});`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Database Transaction Tests</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`describe('Database Transaction Handling', () => {
  test('should rollback on payment processing failure', async () => {
    const initialBalance = await getUserBalance('user_123');

    try {
      await processPayment({
        userId: 'user_123',
        amount: 5000,
        // This will fail
        source: 'tok_chargeDeclined'
      });
    } catch (error) {
      // Expected to fail
    }

    const finalBalance = await getUserBalance('user_123');
    expect(finalBalance).toBe(initialBalance);
  });

  test('should handle concurrent payment attempts', async () => {
    const paymentPromises = Array(10).fill(null).map(() =>
      request(app)
        .post('/api/v1/payments')
        .set('Authorization', 'Bearer test_sk_...')
        .send({
          userId: 'user_123',
          amount: 1000,
          currency: 'USD'
        })
    );

    const results = await Promise.allSettled(paymentPromises);
    const successful = results.filter(r => r.status === 'fulfilled');

    expect(successful.length).toBeGreaterThan(0);
    // Verify no race conditions in database
  });
});`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="e2e" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>End-to-End Test Examples</CardTitle>
              <CardDescription>Full user journey testing with Playwright/Cypress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Complete Payment Flow</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test('user can complete a payment', async ({ page }) => {
    // Navigate to checkout
    await page.goto('https://example.com/checkout');

    // Fill in payment details
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvv"]', '123');
    await page.fill('[data-testid="billing-zip"]', '12345');

    // Submit payment
    await page.click('[data-testid="submit-payment"]');

    // Wait for processing
    await page.waitForSelector('[data-testid="payment-processing"]');

    // Verify success
    await expect(page.locator('[data-testid="payment-success"]'))
      .toBeVisible({ timeout: 10000 });

    // Verify receipt displayed
    await expect(page.locator('[data-testid="receipt"]'))
      .toContainText('Payment successful');

    // Check payment ID is shown
    const paymentId = await page.locator('[data-testid="payment-id"]')
      .textContent();
    expect(paymentId).toMatch(/^pay_[a-zA-Z0-9]+$/);
  });

  test('shows validation errors for invalid card', async ({ page }) => {
    await page.goto('https://example.com/checkout');

    await page.fill('[data-testid="card-number"]', '4000000000000002'); // Declined
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvv"]', '123');

    await page.click('[data-testid="submit-payment"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Your card was declined');
  });

  test('handles network errors gracefully', async ({ page, context }) => {
    // Simulate network failure
    await context.route('**/api/v1/payments', route => route.abort());

    await page.goto('https://example.com/checkout');
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvv"]', '123');

    await page.click('[data-testid="submit-payment"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Network error');

    // Verify retry button is shown
    await expect(page.locator('[data-testid="retry-button"]'))
      .toBeVisible();
  });
});

test.describe('Refund Flow', () => {
  test('merchant can refund a payment', async ({ page }) => {
    await page.goto('https://dashboard.example.com/login');
    await page.fill('[name="email"]', 'merchant@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');

    // Navigate to payments
    await page.click('[data-testid="nav-payments"]');

    // Find a payment to refund
    await page.click('[data-testid="payment-item"]:first-child');

    // Initiate refund
    await page.click('[data-testid="refund-button"]');
    await page.fill('[data-testid="refund-amount"]', '50.00');
    await page.fill('[data-testid="refund-reason"]', 'Customer request');
    await page.click('[data-testid="confirm-refund"]');

    // Verify refund success
    await expect(page.locator('[data-testid="refund-success"]'))
      .toBeVisible();

    // Verify payment status updated
    await expect(page.locator('[data-testid="payment-status"]'))
      .toContainText('Partially Refunded');
  });
});`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edge Cases & Boundary Conditions</CardTitle>
              <CardDescription>Testing unusual scenarios and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Amount Edge Cases
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Zero amount</p>
                      <p className="text-muted-foreground">Test: amount = 0</p>
                      <Badge variant="outline" className="mt-1">Should reject</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Minimum amount</p>
                      <p className="text-muted-foreground">Test: amount = 1 (smallest unit)</p>
                      <Badge variant="outline" className="mt-1">Should accept</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Maximum amount</p>
                      <p className="text-muted-foreground">Test: amount = 999999999</p>
                      <Badge variant="outline" className="mt-1">Should check limits</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Floating point precision</p>
                      <p className="text-muted-foreground">Test: amount = 10.005</p>
                      <Badge variant="outline" className="mt-1">Should round correctly</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Date & Time Edge Cases
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Card expiring this month</p>
                      <p className="text-muted-foreground">Test: Current month/year</p>
                      <Badge variant="outline" className="mt-1">Should accept</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Expired yesterday</p>
                      <p className="text-muted-foreground">Test: Previous month</p>
                      <Badge variant="outline" className="mt-1">Should reject</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Year 2038 problem</p>
                      <p className="text-muted-foreground">Test: expYear = 2038+</p>
                      <Badge variant="outline" className="mt-1">Should handle</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Daylight saving time</p>
                      <p className="text-muted-foreground">Test: DST transition</p>
                      <Badge variant="outline" className="mt-1">Should not affect</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    String & Input Edge Cases
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Empty strings</p>
                      <p className="text-muted-foreground">Test: description = ""</p>
                      <Badge variant="outline" className="mt-1">Should validate</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Very long strings</p>
                      <p className="text-muted-foreground">Test: 10,000+ characters</p>
                      <Badge variant="outline" className="mt-1">Should truncate/reject</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Special characters</p>
                      <p className="text-muted-foreground">Test: Unicode, emojis, SQL</p>
                      <Badge variant="outline" className="mt-1">Should sanitize</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Null/undefined values</p>
                      <p className="text-muted-foreground">Test: Missing required fields</p>
                      <Badge variant="outline" className="mt-1">Should reject</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Concurrency Edge Cases
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Double submission</p>
                      <p className="text-muted-foreground">Test: Duplicate payment requests</p>
                      <Badge variant="outline" className="mt-1">Idempotency key</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Race conditions</p>
                      <p className="text-muted-foreground">Test: Simultaneous refunds</p>
                      <Badge variant="outline" className="mt-1">Database locks</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Webhook ordering</p>
                      <p className="text-muted-foreground">Test: Out-of-order events</p>
                      <Badge variant="outline" className="mt-1">Event versioning</Badge>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Timeout scenarios</p>
                      <p className="text-muted-foreground">Test: Long-running requests</p>
                      <Badge variant="outline" className="mt-1">Timeout handlers</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Always test edge cases that could lead to financial discrepancies, security issues, or data corruption.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Case Examples for Edge Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`describe('Edge Case Tests', () => {
  test('handles duplicate payment with same idempotency key', async () => {
    const idempotencyKey = 'test_key_123';
    
    const payment1 = await createPayment({
      amount: 5000,
      currency: 'USD',
      idempotencyKey
    });

    // Attempt duplicate payment
    const payment2 = await createPayment({
      amount: 5000,
      currency: 'USD',
      idempotencyKey
    });

    expect(payment2.id).toBe(payment1.id); // Should return same payment
  });

  test('prevents over-refunding', async () => {
    const payment = await createPayment({ amount: 10000 });

    await createRefund({ paymentId: payment.id, amount: 6000 });

    // Attempt to refund more than remaining
    await expect(
      createRefund({ paymentId: payment.id, amount: 5000 })
    ).rejects.toThrow('Refund amount exceeds available balance');
  });

  test('handles currency rounding correctly', async () => {
    // Test currency with no decimal places (JPY)
    const jpyPayment = await createPayment({
      amount: 1000.50, // Should round to 1001
      currency: 'JPY'
    });
    expect(jpyPayment.amount).toBe(1001);

    // Test currency with 3 decimal places (KWD)
    const kwdPayment = await createPayment({
      amount: 10.5555, // Should round to 10.556
      currency: 'KWD'
    });
    expect(kwdPayment.amount).toBe(10.556);
  });

  test('handles very large transaction volumes', async () => {
    const promises = Array(1000).fill(null).map((_, i) =>
      createPayment({
        amount: 1000,
        currency: 'USD',
        idempotencyKey: \`key_\${i}\`
      })
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled');

    expect(successful.length).toBe(1000);
  });
});`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="load" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Load Testing Strategy</CardTitle>
              <CardDescription>Performance testing under various load conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Load Testing Scenarios
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <Badge className="mb-2">Baseline</Badge>
                    <h5 className="font-medium mb-1">Normal Load</h5>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>• 100 concurrent users</p>
                      <p>• 1,000 requests/min</p>
                      <p>• Duration: 10 minutes</p>
                      <p>• Goal: Baseline metrics</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Badge className="mb-2" variant="secondary">Stress</Badge>
                    <h5 className="font-medium mb-1">Peak Load</h5>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>• 1,000 concurrent users</p>
                      <p>• 10,000 requests/min</p>
                      <p>• Duration: 30 minutes</p>
                      <p>• Goal: Find breaking point</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Badge className="mb-2" variant="secondary">Spike</Badge>
                    <h5 className="font-medium mb-1">Sudden Traffic Surge</h5>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>• 0 to 5,000 users instantly</p>
                      <p>• 50,000 requests/min</p>
                      <p>• Duration: 5 minutes</p>
                      <p>• Goal: Test auto-scaling</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Badge className="mb-2" variant="secondary">Soak</Badge>
                    <h5 className="font-medium mb-1">Sustained Load</h5>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>• 500 concurrent users</p>
                      <p>• 5,000 requests/min</p>
                      <p>• Duration: 4 hours</p>
                      <p>• Goal: Find memory leaks</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">K6 Load Test Example</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Steady
    { duration: '2m', target: 200 },   // Spike
    { duration: '5m', target: 200 },   // High load
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    errors: ['rate<0.05'],             // Error rate under 5%
  },
};

export default function () {
  // Create payment
  const payload = JSON.stringify({
    amount: 5000,
    currency: 'USD',
    source: 'tok_visa',
    description: 'Load test payment',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk_test_...',
      'Idempotency-Key': \`\${__VU}-\${__ITER}\`,
    },
  };

  const res = http.post(
    'https://api.example.com/v1/payments',
    payload,
    params
  );

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response has payment id': (r) => r.json('id') !== undefined,
    'response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Performance Metrics to Track</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { metric: 'Response Time', target: 'P95 < 500ms', critical: 'P99 < 1000ms' },
                    { metric: 'Throughput', target: '1000 req/s', critical: '500 req/s' },
                    { metric: 'Error Rate', target: '< 1%', critical: '< 5%' },
                    { metric: 'CPU Usage', target: '< 70%', critical: '< 85%' },
                    { metric: 'Memory Usage', target: '< 75%', critical: '< 90%' },
                    { metric: 'Database Connections', target: '< 60% pool', critical: '< 85% pool' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 border rounded-lg text-sm">
                      <p className="font-medium mb-1">{item.metric}</p>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Target: {item.target}</p>
                        <p className="text-red-600">Critical: {item.critical}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Testing</CardTitle>
              <CardDescription>Vulnerability assessment and penetration testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Security Test Categories
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      category: 'Authentication & Authorization',
                      tests: [
                        'API key validation and revocation',
                        'JWT token expiration and refresh',
                        'Rate limiting per API key',
                        'RBAC permission checks',
                        'Session hijacking prevention'
                      ]
                    },
                    {
                      category: 'Input Validation',
                      tests: [
                        'SQL injection attempts',
                        'XSS payload injection',
                        'Path traversal attacks',
                        'Command injection',
                        'XML external entity (XXE) attacks'
                      ]
                    },
                    {
                      category: 'Business Logic',
                      tests: [
                        'Race condition exploitation',
                        'Amount manipulation',
                        'Refund amount bypass',
                        'Fee calculation tampering',
                        'State machine exploitation'
                      ]
                    },
                    {
                      category: 'Data Protection',
                      tests: [
                        'PCI DSS compliance checks',
                        'Encryption at rest verification',
                        'TLS configuration audit',
                        'Sensitive data in logs',
                        'PII exposure in APIs'
                      ]
                    }
                  ].map((section, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">{section.category}</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {section.tests.map((test, testIdx) => (
                          <li key={testIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Security Test Examples</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`describe('Security Tests', () => {
  test('prevents SQL injection in payment search', async () => {
    const maliciousQuery = "' OR '1'='1";
    
    const response = await request(app)
      .get(\`/api/v1/payments?search=\${maliciousQuery}\`)
      .set('Authorization', 'Bearer test_sk_...');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(0); // Should return no results
  });

  test('rejects requests with invalid signatures', async () => {
    const payload = { amount: 5000 };
    const invalidSignature = 'invalid_signature';

    const response = await request(app)
      .post('/api/v1/webhooks')
      .set('X-Signature', invalidSignature)
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('invalid_signature');
  });

  test('enforces rate limiting', async () => {
    const requests = Array(150).fill(null).map(() =>
      request(app)
        .get('/api/v1/payments')
        .set('Authorization', 'Bearer test_sk_...')
    );

    const results = await Promise.allSettled(requests);
    const rateLimited = results.filter(
      r => r.value?.status === 429
    );

    expect(rateLimited.length).toBeGreaterThan(0);
  });

  test('prevents amount manipulation', async () => {
    const response = await request(app)
      .post('/api/v1/payments')
      .set('Authorization', 'Bearer test_sk_...')
      .send({
        amount: -1000, // Negative amount
        currency: 'USD'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('invalid_amount');
  });

  test('does not expose sensitive data in error messages', async () => {
    const response = await request(app)
      .post('/api/v1/payments')
      .set('Authorization', 'Bearer invalid_key')
      .send({ amount: 5000 });

    expect(response.body.error.message).not.toContain('database');
    expect(response.body.error.message).not.toContain('SQL');
    expect(response.body.error.message).not.toContain('stack trace');
  });
});`}
                </pre>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Regular security audits and penetration testing should be performed by qualified security professionals.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
