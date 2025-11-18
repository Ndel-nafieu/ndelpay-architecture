import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Lock, FileKey } from "lucide-react";

export const SecurityFlowDiagram = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Flow Diagram</CardTitle>
          <CardDescription>
            Authentication, authorization, and encryption patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jwt" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jwt">JWT Lifecycle</TabsTrigger>
              <TabsTrigger value="apikey">API Keys</TabsTrigger>
              <TabsTrigger value="rbac">RBAC</TabsTrigger>
              <TabsTrigger value="encryption">Encryption</TabsTrigger>
            </TabsList>

            <TabsContent value="jwt" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    JWT Token Lifecycle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`flowchart TD
    A[User Login] --> B[Validate Credentials]
    B --> C{Valid?}
    C -->|No| D[Return 401]
    C -->|Yes| E[Generate Access Token]
    E --> F[Generate Refresh Token]
    F --> G[Store Refresh Token in DB]
    G --> H[Return Tokens to Client]
    
    I[Client Request] --> J[Validate Access Token]
    J --> K{Valid?}
    K -->|Yes| L[Process Request]
    K -->|No - Expired| M[Check Refresh Token]
    K -->|No - Invalid| N[Return 401]
    
    M --> O{Refresh Valid?}
    O -->|Yes| P[Generate New Access Token]
    O -->|No| Q[Return 401]
    P --> R[Rotate Refresh Token]
    R --> S[Update DB]
    S --> T[Return New Tokens]`}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Token Structure</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`// Access Token (15 minutes expiry)
{
  "sub": "user_id_123",
  "email": "user@example.com",
  "role": "merchant",
  "iat": 1705320000,
  "exp": 1705320900
}

// Refresh Token (7 days expiry)
{
  "sub": "user_id_123",
  "token_id": "refresh_abc123",
  "iat": 1705320000,
  "exp": 1705924800
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Token Generation</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  const tokenId = crypto.randomUUID();
  
  return {
    token: jwt.sign(
      {
        sub: user.id,
        token_id: tokenId
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    ),
    tokenId
  };
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Security Best Practices</h4>
                      <div className="space-y-2">
                        <Badge variant="outline" className="w-full justify-start">
                          ✓ Short-lived access tokens (15 minutes)
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start">
                          ✓ Refresh token rotation on use
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start">
                          ✓ Store refresh tokens in database
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start">
                          ✓ Invalidate refresh tokens on logout
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start">
                          ✓ Use separate secrets for access and refresh tokens
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apikey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileKey className="h-5 w-5" />
                    API Key Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`flowchart TD
    A[Create API Key] --> B[Generate Random Key]
    B --> C[Hash Key with bcrypt]
    C --> D[Store Hash in DB]
    D --> E[Return Plain Key to User]
    E --> F[User Stores Key Securely]
    
    G[API Request] --> H[Extract API Key from Header]
    H --> I[Hash Provided Key]
    I --> J[Compare with DB Hash]
    J --> K{Match?}
    K -->|Yes| L[Load Permissions]
    K -->|No| M[Return 401]
    L --> N[Validate Permissions]
    N --> O[Process Request]`}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">API Key Structure</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`// Plain key (shown only once)
sk_live_abc123def456ghi789jkl012mno345

// Database record
{
  "id": "key_123",
  "user_id": "user_456",
  "key_hash": "$2b$10$...",  // bcrypt hash
  "prefix": "sk_live_abc",   // for identification
  "name": "Production API",
  "permissions": ["payments:read", "payments:write"],
  "last_used_at": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "expires_at": "2025-01-01T00:00:00Z"
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Generation & Validation</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function createApiKey(userId, name, permissions) {
  // Generate random key
  const key = 'sk_live_' + crypto.randomBytes(32).toString('hex');
  
  // Hash the key
  const keyHash = await bcrypt.hash(key, 10);
  
  // Store in database
  await db.query(
    \`INSERT INTO api_keys 
     (user_id, key_hash, prefix, name, permissions)
     VALUES ($1, $2, $3, $4, $5)\`,
    [userId, keyHash, key.substring(0, 15), name, permissions]
  );
  
  // Return plain key (only time it's shown)
  return key;
}

async function validateApiKey(providedKey) {
  const prefix = providedKey.substring(0, 15);
  
  // Find key by prefix
  const result = await db.query(
    'SELECT * FROM api_keys WHERE prefix = $1',
    [prefix]
  );
  
  if (result.rows.length === 0) return null;
  
  const apiKey = result.rows[0];
  
  // Verify hash
  const valid = await bcrypt.compare(providedKey, apiKey.key_hash);
  if (!valid) return null;
  
  // Update last used
  await db.query(
    'UPDATE api_keys SET last_used_at = NOW() WHERE id = $1',
    [apiKey.id]
  );
  
  return apiKey;
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rbac" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Role-Based Access Control (RBAC)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`-- Database Schema
CREATE TYPE app_role AS ENUM ('admin', 'merchant', 'customer');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Row Level Security Policy
CREATE POLICY "Admins can view all payments"
ON payments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));`}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Permission Matrix</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Resource</th>
                              <th className="text-center p-2">Customer</th>
                              <th className="text-center p-2">Merchant</th>
                              <th className="text-center p-2">Admin</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2">Payments (own)</td>
                              <td className="text-center">Read</td>
                              <td className="text-center">Read/Write</td>
                              <td className="text-center">Full</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Payments (all)</td>
                              <td className="text-center">-</td>
                              <td className="text-center">-</td>
                              <td className="text-center">Full</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Wallets (own)</td>
                              <td className="text-center">Read</td>
                              <td className="text-center">Read</td>
                              <td className="text-center">Full</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Wallets (all)</td>
                              <td className="text-center">-</td>
                              <td className="text-center">-</td>
                              <td className="text-center">Full</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">API Keys</td>
                              <td className="text-center">-</td>
                              <td className="text-center">Read/Write</td>
                              <td className="text-center">Full</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">Webhooks</td>
                              <td className="text-center">-</td>
                              <td className="text-center">Read/Write</td>
                              <td className="text-center">Full</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Middleware Implementation</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`function requireRole(roles) {
  return async (req, res, next) => {
    const userId = req.user.id;
    
    const result = await db.query(
      'SELECT role FROM user_roles WHERE user_id = $1',
      [userId]
    );
    
    const userRoles = result.rows.map(r => r.role);
    const hasRequiredRole = roles.some(r => userRoles.includes(r));
    
    if (!hasRequiredRole) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Insufficient permissions'
      });
    }
    
    req.userRoles = userRoles;
    next();
  };
}

// Usage
app.get('/admin/payments', 
  authenticateJWT,
  requireRole(['admin']),
  getAllPayments
);

app.post('/payments',
  authenticateJWT,
  requireRole(['merchant', 'admin']),
  createPayment
);`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="encryption" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Encryption & Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Encryption Points</h4>
                    <div className="space-y-2">
                      <Badge variant="outline" className="w-full justify-start">
                        🔒 API Keys - Hashed with bcrypt (cost factor 10)
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        🔒 Passwords - Hashed with bcrypt (cost factor 12)
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        🔒 PII Data - Encrypted at rest using AES-256
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        🔒 Payment Data - PCI DSS compliant encryption
                      </Badge>
                      <Badge variant="outline" className="w-full justify-start">
                        🔒 TLS 1.3 - All data in transit
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Webhook Signature Verification</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`const crypto = require('crypto');

// Server: Generate signature
function generateWebhookSignature(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return 'sha256=' + hmac.digest('hex');
}

// Client: Verify signature
function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = generateWebhookSignature(payload, secret);
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Webhook handler
app.post('/webhooks/ndelpay', (req, res) => {
  const signature = req.headers['x-ndelpay-signature'];
  const payload = req.body;
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!verifyWebhookSignature(payload, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  processWebhook(payload);
  res.status(200).send('OK');
});`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Sensitive Data Encryption</h4>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
{`const crypto = require('crypto');

class DataEncryption {
  constructor(encryptionKey) {
    this.key = Buffer.from(encryptionKey, 'hex');
    this.algorithm = 'aes-256-gcm';
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encrypted, iv, authTag) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Usage
const encryption = new DataEncryption(process.env.ENCRYPTION_KEY);

// Encrypt sensitive data before storing
const encrypted = encryption.encrypt(user.ssn);
await db.query(
  'INSERT INTO users (ssn_encrypted, ssn_iv, ssn_tag) VALUES ($1, $2, $3)',
  [encrypted.encrypted, encrypted.iv, encrypted.authTag]
);

// Decrypt when needed
const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
const ssn = encryption.decrypt(
  result.rows[0].ssn_encrypted,
  result.rows[0].ssn_iv,
  result.rows[0].ssn_tag
);`}
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
