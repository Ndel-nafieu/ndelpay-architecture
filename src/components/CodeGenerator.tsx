import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Language = "nodejs" | "python" | "php" | "go";
type Feature = "payment" | "webhook" | "refund" | "payout";

const codeTemplates = {
  nodejs: {
    payment: `const axios = require('axios');

async function createPayment() {
  try {
    const response = await axios.post(
      'https://api.ndelpay.com/v1/payments',
      {
        amount: 10000,
        currency: 'NGN',
        customer: {
          email: 'customer@example.com',
          name: 'John Doe'
        },
        metadata: {
          order_id: 'ORD-123'
        }
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.NDELPAY_SECRET_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Payment created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error.response?.data || error.message);
    throw error;
  }
}

createPayment();`,
    webhook: `const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expected = 'sha256=' + hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

app.post('/webhooks/ndelpay', (req, res) => {
  const signature = req.headers['x-ndelpay-signature'];
  const payload = req.body;
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Handle different event types
  switch (payload.event) {
    case 'payment.completed':
      console.log('Payment completed:', payload.data);
      // Update order status, send confirmation email, etc.
      break;
    case 'payment.failed':
      console.log('Payment failed:', payload.data);
      // Handle failed payment
      break;
    default:
      console.log('Unhandled event:', payload.event);
  }
  
  res.status(200).send('OK');
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));`,
    refund: `const axios = require('axios');

async function createRefund(paymentId, amount, reason) {
  try {
    const response = await axios.post(
      \`https://api.ndelpay.com/v1/payments/\${paymentId}/refund\`,
      {
        amount: amount,
        reason: reason
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.NDELPAY_SECRET_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Refund created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating refund:', error.response?.data || error.message);
    throw error;
  }
}

createRefund('pay_abc123', 5000, 'Customer requested refund');`,
    payout: `const axios = require('axios');

async function createPayout() {
  try {
    const response = await axios.post(
      'https://api.ndelpay.com/v1/payouts',
      {
        amount: 50000,
        currency: 'NGN',
        recipient: {
          account_number: '1234567890',
          account_name: 'John Doe',
          bank_code: '044'
        },
        narration: 'Payment for services'
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.NDELPAY_SECRET_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Payout created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating payout:', error.response?.data || error.message);
    throw error;
  }
}

createPayout();`
  },
  python: {
    payment: `import requests
import os

def create_payment():
    url = "https://api.ndelpay.com/v1/payments"
    headers = {
        "Authorization": f"Bearer {os.environ['NDELPAY_SECRET_KEY']}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "amount": 10000,
        "currency": "NGN",
        "customer": {
            "email": "customer@example.com",
            "name": "John Doe"
        },
        "metadata": {
            "order_id": "ORD-123"
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print("Payment created:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating payment: {e}")
        raise

if __name__ == "__main__":
    create_payment()`,
    webhook: `from flask import Flask, request, jsonify
import hmac
import hashlib
import os
import json

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected = 'sha256=' + hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected)

@app.route('/webhooks/ndelpay', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('x-ndelpay-signature')
    payload = request.json
    
    if not verify_webhook_signature(payload, signature, os.environ['WEBHOOK_SECRET']):
        return jsonify({"error": "Invalid signature"}), 401
    
    # Handle different event types
    event = payload.get('event')
    
    if event == 'payment.completed':
        print("Payment completed:", payload.get('data'))
        # Update order status, send confirmation email, etc.
    elif event == 'payment.failed':
        print("Payment failed:", payload.get('data'))
        # Handle failed payment
    else:
        print("Unhandled event:", event)
    
    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(port=3000)`,
    refund: `import requests
import os

def create_refund(payment_id, amount, reason):
    url = f"https://api.ndelpay.com/v1/payments/{payment_id}/refund"
    headers = {
        "Authorization": f"Bearer {os.environ['NDELPAY_SECRET_KEY']}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "amount": amount,
        "reason": reason
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print("Refund created:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating refund: {e}")
        raise

if __name__ == "__main__":
    create_refund("pay_abc123", 5000, "Customer requested refund")`,
    payout: `import requests
import os

def create_payout():
    url = "https://api.ndelpay.com/v1/payouts"
    headers = {
        "Authorization": f"Bearer {os.environ['NDELPAY_SECRET_KEY']}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "amount": 50000,
        "currency": "NGN",
        "recipient": {
            "account_number": "1234567890",
            "account_name": "John Doe",
            "bank_code": "044"
        },
        "narration": "Payment for services"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print("Payout created:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating payout: {e}")
        raise

if __name__ == "__main__":
    create_payout()`
  },
  php: {
    payment: `<?php

function createPayment() {
    $url = "https://api.ndelpay.com/v1/payments";
    $secretKey = getenv('NDELPAY_SECRET_KEY');
    
    $data = [
        'amount' => 10000,
        'currency' => 'NGN',
        'customer' => [
            'email' => 'customer@example.com',
            'name' => 'John Doe'
        ],
        'metadata' => [
            'order_id' => 'ORD-123'
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $secretKey,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "Payment created: " . $response . "\\n";
        return json_decode($response, true);
    } else {
        echo "Error creating payment: " . $response . "\\n";
        throw new Exception("Payment creation failed");
    }
}

createPayment();

?>`,
    webhook: `<?php

function verifyWebhookSignature($payload, $signature, $secret) {
    $expected = 'sha256=' . hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($signature, $expected);
}

// Get raw POST data
$payload = json_decode(file_get_contents('php://input'), true);
$signature = $_SERVER['HTTP_X_NDELPAY_SIGNATURE'] ?? '';
$secret = getenv('WEBHOOK_SECRET');

if (!verifyWebhookSignature($payload, $signature, $secret)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid signature']);
    exit;
}

// Handle different event types
$event = $payload['event'] ?? '';

switch ($event) {
    case 'payment.completed':
        error_log('Payment completed: ' . json_encode($payload['data']));
        // Update order status, send confirmation email, etc.
        break;
    case 'payment.failed':
        error_log('Payment failed: ' . json_encode($payload['data']));
        // Handle failed payment
        break;
    default:
        error_log('Unhandled event: ' . $event);
}

http_response_code(200);
echo json_encode(['status' => 'success']);

?>`,
    refund: `<?php

function createRefund($paymentId, $amount, $reason) {
    $url = "https://api.ndelpay.com/v1/payments/{$paymentId}/refund";
    $secretKey = getenv('NDELPAY_SECRET_KEY');
    
    $data = [
        'amount' => $amount,
        'reason' => $reason
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $secretKey,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "Refund created: " . $response . "\\n";
        return json_decode($response, true);
    } else {
        echo "Error creating refund: " . $response . "\\n";
        throw new Exception("Refund creation failed");
    }
}

createRefund('pay_abc123', 5000, 'Customer requested refund');

?>`,
    payout: `<?php

function createPayout() {
    $url = "https://api.ndelpay.com/v1/payouts";
    $secretKey = getenv('NDELPAY_SECRET_KEY');
    
    $data = [
        'amount' => 50000,
        'currency' => 'NGN',
        'recipient' => [
            'account_number' => '1234567890',
            'account_name' => 'John Doe',
            'bank_code' => '044'
        ],
        'narration' => 'Payment for services'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $secretKey,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "Payout created: " . $response . "\\n";
        return json_decode($response, true);
    } else {
        echo "Error creating payout: " . $response . "\\n";
        throw new Exception("Payout creation failed");
    }
}

createPayout();

?>`
  },
  go: {
    payment: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

type Payment struct {
    Amount   int                    \`json:"amount"\`
    Currency string                 \`json:"currency"\`
    Customer map[string]interface{} \`json:"customer"\`
    Metadata map[string]interface{} \`json:"metadata"\`
}

func createPayment() error {
    url := "https://api.ndelpay.com/v1/payments"
    secretKey := os.Getenv("NDELPAY_SECRET_KEY")
    
    payment := Payment{
        Amount:   10000,
        Currency: "NGN",
        Customer: map[string]interface{}{
            "email": "customer@example.com",
            "name":  "John Doe",
        },
        Metadata: map[string]interface{}{
            "order_id": "ORD-123",
        },
    }
    
    jsonData, err := json.Marshal(payment)
    if err != nil {
        return fmt.Errorf("error marshaling payment: %w", err)
    }
    
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return fmt.Errorf("error creating request: %w", err)
    }
    
    req.Header.Set("Authorization", "Bearer "+secretKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return fmt.Errorf("error sending request: %w", err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    
    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        fmt.Println("Payment created:", string(body))
        return nil
    }
    
    return fmt.Errorf("error creating payment: %s", string(body))
}

func main() {
    if err := createPayment(); err != nil {
        fmt.Println(err)
    }
}`,
    webhook: `package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
)

type WebhookPayload struct {
    Event string                 \`json:"event"\`
    Data  map[string]interface{} \`json:"data"\`
}

func verifySignature(payload []byte, signature, secret string) bool {
    h := hmac.New(sha256.New, []byte(secret))
    h.Write(payload)
    expected := "sha256=" + hex.EncodeToString(h.Sum(nil))
    return hmac.Equal([]byte(signature), []byte(expected))
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Error reading body", http.StatusBadRequest)
        return
    }
    defer r.Body.Close()
    
    signature := r.Header.Get("x-ndelpay-signature")
    secret := os.Getenv("WEBHOOK_SECRET")
    
    if !verifySignature(body, signature, secret) {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }
    
    var payload WebhookPayload
    if err := json.Unmarshal(body, &payload); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    switch payload.Event {
    case "payment.completed":
        log.Println("Payment completed:", payload.Data)
        // Update order status, send confirmation email, etc.
    case "payment.failed":
        log.Println("Payment failed:", payload.Data)
        // Handle failed payment
    default:
        log.Println("Unhandled event:", payload.Event)
    }
    
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}

func main() {
    http.HandleFunc("/webhooks/ndelpay", handleWebhook)
    log.Println("Webhook server running on port 3000")
    log.Fatal(http.ListenAndServe(":3000", nil))
}`,
    refund: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

type Refund struct {
    Amount int    \`json:"amount"\`
    Reason string \`json:"reason"\`
}

func createRefund(paymentID string, amount int, reason string) error {
    url := fmt.Sprintf("https://api.ndelpay.com/v1/payments/%s/refund", paymentID)
    secretKey := os.Getenv("NDELPAY_SECRET_KEY")
    
    refund := Refund{
        Amount: amount,
        Reason: reason,
    }
    
    jsonData, err := json.Marshal(refund)
    if err != nil {
        return fmt.Errorf("error marshaling refund: %w", err)
    }
    
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return fmt.Errorf("error creating request: %w", err)
    }
    
    req.Header.Set("Authorization", "Bearer "+secretKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return fmt.Errorf("error sending request: %w", err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    
    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        fmt.Println("Refund created:", string(body))
        return nil
    }
    
    return fmt.Errorf("error creating refund: %s", string(body))
}

func main() {
    if err := createRefund("pay_abc123", 5000, "Customer requested refund"); err != nil {
        fmt.Println(err)
    }
}`,
    payout: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

type Payout struct {
    Amount    int                    \`json:"amount"\`
    Currency  string                 \`json:"currency"\`
    Recipient map[string]interface{} \`json:"recipient"\`
    Narration string                 \`json:"narration"\`
}

func createPayout() error {
    url := "https://api.ndelpay.com/v1/payouts"
    secretKey := os.Getenv("NDELPAY_SECRET_KEY")
    
    payout := Payout{
        Amount:   50000,
        Currency: "NGN",
        Recipient: map[string]interface{}{
            "account_number": "1234567890",
            "account_name":   "John Doe",
            "bank_code":      "044",
        },
        Narration: "Payment for services",
    }
    
    jsonData, err := json.Marshal(payout)
    if err != nil {
        return fmt.Errorf("error marshaling payout: %w", err)
    }
    
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        return fmt.Errorf("error creating request: %w", err)
    }
    
    req.Header.Set("Authorization", "Bearer "+secretKey)
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return fmt.Errorf("error sending request: %w", err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    
    if resp.StatusCode >= 200 && resp.StatusCode < 300 {
        fmt.Println("Payout created:", string(body))
        return nil
    }
    
    return fmt.Errorf("error creating payout: %s", string(body))
}

func main() {
    if err := createPayout(); err != nil {
        fmt.Println(err)
    }
}`
  }
};

const installInstructions = {
  nodejs: {
    payment: "npm install axios",
    webhook: "npm install express",
    refund: "npm install axios",
    payout: "npm install axios"
  },
  python: {
    payment: "pip install requests",
    webhook: "pip install flask",
    refund: "pip install requests",
    payout: "pip install requests"
  },
  php: {
    payment: "No additional packages required (uses curl)",
    webhook: "No additional packages required",
    refund: "No additional packages required (uses curl)",
    payout: "No additional packages required (uses curl)"
  },
  go: {
    payment: "No additional packages required (uses standard library)",
    webhook: "No additional packages required (uses standard library)",
    refund: "No additional packages required (uses standard library)",
    payout: "No additional packages required (uses standard library)"
  }
};

export const CodeGenerator = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("nodejs");
  const [selectedFeature, setSelectedFeature] = useState<Feature>("payment");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getCode = () => {
    return codeTemplates[selectedLanguage][selectedFeature];
  };

  const getInstallCommand = () => {
    return installInstructions[selectedLanguage][selectedFeature];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied successfully"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageName = (lang: Language) => {
    const names = {
      nodejs: "Node.js",
      python: "Python",
      php: "PHP",
      go: "Go"
    };
    return names[lang];
  };

  const getFeatureName = (feature: Feature) => {
    const names = {
      payment: "Create Payment",
      webhook: "Webhook Handler",
      refund: "Process Refund",
      payout: "Create Payout"
    };
    return names[feature];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Integration Code Generator
          </CardTitle>
          <CardDescription>
            Generate boilerplate integration code for different programming languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div>
            <h4 className="font-semibold mb-3">Select Language</h4>
            <div className="flex flex-wrap gap-2">
              {(["nodejs", "python", "php", "go"] as Language[]).map((lang) => (
                <Badge
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {getLanguageName(lang)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Feature Selection */}
          <div>
            <h4 className="font-semibold mb-3">Select Feature</h4>
            <div className="flex flex-wrap gap-2">
              {(["payment", "webhook", "refund", "payout"] as Feature[]).map((feature) => (
                <Badge
                  key={feature}
                  variant={selectedFeature === feature ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setSelectedFeature(feature)}
                >
                  {getFeatureName(feature)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Installation Instructions */}
          <div>
            <h4 className="font-semibold mb-2">Installation</h4>
            <div className="bg-muted/50 p-3 rounded-lg">
              <code className="text-sm">{getInstallCommand()}</code>
            </div>
          </div>

          {/* Generated Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Generated Code</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                <code>{getCode()}</code>
              </pre>
            </div>
          </div>

          {/* Environment Variables */}
          <div>
            <h4 className="font-semibold mb-2">Required Environment Variables</h4>
            <div className="space-y-2">
              <div className="bg-muted/50 p-3 rounded-lg">
                <code className="text-sm">NDELPAY_SECRET_KEY=your_secret_key_here</code>
              </div>
              {selectedFeature === "webhook" && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <code className="text-sm">WEBHOOK_SECRET=your_webhook_secret_here</code>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
