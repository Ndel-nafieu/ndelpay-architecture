import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Server, Cloud, Database, Lock, Settings, Zap } from "lucide-react";

export const DeploymentGuide = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Deployment Guide</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive guide for deploying the payment system to production
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="rollback">Rollback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Architecture</CardTitle>
              <CardDescription>High-level overview of the production environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">API Layer</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    RESTful API servers behind load balancer with auto-scaling enabled
                  </p>
                  <Badge variant="outline">Node.js / Go</Badge>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Database</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PostgreSQL cluster with read replicas and automated backups
                  </p>
                  <Badge variant="outline">PostgreSQL 15</Badge>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Cache Layer</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Redis cluster for session management and rate limiting
                  </p>
                  <Badge variant="outline">Redis 7.x</Badge>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Queue System</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Message queue for asynchronous webhook delivery and processing
                  </p>
                  <Badge variant="outline">RabbitMQ / SQS</Badge>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Security</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    WAF, DDoS protection, and secrets management via vault
                  </p>
                  <Badge variant="outline">AWS WAF / Vault</Badge>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Monitoring</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Real-time metrics, logs aggregation, and alerting system
                  </p>
                  <Badge variant="outline">Datadog / ELK</Badge>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Always deploy to staging environment first and run comprehensive tests before promoting to production.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'All tests passing in CI/CD pipeline',
                  'Database migrations reviewed and tested',
                  'Environment variables configured in secrets manager',
                  'SSL certificates validated and not expiring soon',
                  'Load balancer health checks configured',
                  'Monitoring and alerting rules in place',
                  'Backup and disaster recovery plan documented',
                  'Security scan completed with no critical issues',
                  'API rate limits and quotas configured',
                  'Documentation updated with API changes',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prerequisites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Compute Resources</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>API Servers:</strong> 3+ instances, 4 vCPU, 8GB RAM minimum</p>
                    <p className="text-sm"><strong>Worker Nodes:</strong> 2+ instances, 2 vCPU, 4GB RAM minimum</p>
                    <p className="text-sm"><strong>Auto-scaling:</strong> Min 3, Max 20 instances based on CPU/memory</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Database</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Primary:</strong> PostgreSQL 15+, db.r5.2xlarge or equivalent</p>
                    <p className="text-sm"><strong>Replicas:</strong> 2+ read replicas for load distribution</p>
                    <p className="text-sm"><strong>Storage:</strong> 500GB SSD with auto-scaling enabled</p>
                    <p className="text-sm"><strong>Backups:</strong> Automated daily backups with 30-day retention</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Cache & Queue</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Redis:</strong> Cluster mode with 6+ nodes, 16GB memory per node</p>
                    <p className="text-sm"><strong>Message Queue:</strong> RabbitMQ cluster or AWS SQS/SNS</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Accounts & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { service: 'Cloud Provider (AWS/GCP/Azure)', status: 'Required', purpose: 'Infrastructure hosting' },
                  { service: 'Domain & DNS Provider', status: 'Required', purpose: 'Domain management and routing' },
                  { service: 'SSL Certificate Authority', status: 'Required', purpose: 'HTTPS encryption (Let\'s Encrypt or ACM)' },
                  { service: 'Secrets Manager', status: 'Required', purpose: 'Secure credential storage' },
                  { service: 'Monitoring Service', status: 'Required', purpose: 'Application and infrastructure monitoring' },
                  { service: 'Log Aggregation', status: 'Recommended', purpose: 'Centralized logging (ELK, Datadog, etc.)' },
                  { service: 'CDN Provider', status: 'Recommended', purpose: 'Static asset delivery' },
                  { service: 'Email Service (SendGrid/SES)', status: 'Recommended', purpose: 'Transactional emails' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.service}</p>
                      <p className="text-sm text-muted-foreground">{item.purpose}</p>
                    </div>
                    <Badge variant={item.status === 'Required' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Tools Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Install CLI Tools</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Install required tools
npm install -g pm2          # Process manager
npm install -g sequelize-cli # Database migrations

# Cloud provider CLI
aws configure               # AWS CLI
gcloud init                 # Google Cloud
az login                    # Azure

# Container tools (if using Docker/Kubernetes)
docker --version
kubectl version --client`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Configure Git Hooks</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Install husky for pre-commit hooks
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
npx husky add .husky/pre-push "npm run lint"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Deployment Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-lg">Prepare Release</h3>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Create release branch
git checkout -b release/v1.2.0
git push origin release/v1.2.0

# Tag the release
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# Generate changelog
npm run changelog`}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-lg">Build & Test</h3>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Install dependencies
npm ci

# Run all tests
npm run test
npm run test:integration
npm run test:e2e

# Build production bundle
npm run build

# Security audit
npm audit --production`}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-lg">Database Migration</h3>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Backup database first
pg_dump -h production-db.example.com -U admin -d payments > backup_$(date +%Y%m%d).sql

# Run migrations on staging
NODE_ENV=staging npx sequelize-cli db:migrate

# Verify migrations
NODE_ENV=staging npm run db:verify

# Run migrations on production
NODE_ENV=production npx sequelize-cli db:migrate`}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-lg">Deploy Application</h3>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Deploy to staging first
npm run deploy:staging

# Smoke tests on staging
npm run test:smoke -- --env=staging

# Deploy to production with blue-green deployment
npm run deploy:production

# Or using Docker
docker build -t payment-api:v1.2.0 .
docker push registry.example.com/payment-api:v1.2.0

# Update Kubernetes deployment
kubectl set image deployment/payment-api payment-api=registry.example.com/payment-api:v1.2.0
kubectl rollout status deployment/payment-api`}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <h3 className="font-semibold text-lg">Verify Deployment</h3>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Health check
curl https://api.example.com/health

# Run smoke tests
npm run test:smoke -- --env=production

# Monitor logs for errors
tail -f /var/log/payment-api/error.log

# Check metrics dashboard
# Verify error rates, response times, throughput`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CI/CD Pipeline Configuration</CardTitle>
              <CardDescription>GitHub Actions example</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Run database migrations
        run: npx sequelize-cli db:migrate
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          
      - name: Deploy to production
        run: npm run deploy:production
        env:
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          
      - name: Verify deployment
        run: npm run test:smoke -- --env=production`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Required configuration for production</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Application Settings</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.example.com
FRONTEND_URL=https://app.example.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://app.example.com,https://admin.example.com`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Database Configuration</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
DATABASE_SSL=true

# Read Replicas
DATABASE_READ_REPLICA_1=postgresql://...
DATABASE_READ_REPLICA_2=postgresql://...`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cache & Queue</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`REDIS_URL=redis://redis-cluster.example.com:6379
REDIS_PASSWORD=<secure-password>
REDIS_TLS=true

RABBITMQ_URL=amqps://user:pass@mq.example.com:5671
QUEUE_NAME=payment_processing`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Security & Authentication</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`JWT_SECRET=<256-bit-secret>
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

API_KEY_SALT_ROUNDS=12
WEBHOOK_SECRET=<secure-webhook-secret>

# Encryption
ENCRYPTION_KEY=<32-byte-key>
ENCRYPTION_ALGORITHM=aes-256-gcm`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">External Services</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Payment Gateway
PAYMENT_GATEWAY_API_KEY=<secret-key>
PAYMENT_GATEWAY_API_URL=https://gateway.example.com

# Email Service
SENDGRID_API_KEY=<api-key>
EMAIL_FROM=noreply@example.com

# Monitoring
DATADOG_API_KEY=<api-key>
SENTRY_DSN=https://<key>@sentry.io/<project>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nginx Configuration</CardTitle>
              <CardDescription>Reverse proxy and load balancing</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`upstream payment_api {
    least_conn;
    server 10.0.1.10:3000 weight=3;
    server 10.0.1.11:3000 weight=3;
    server 10.0.1.12:3000 weight=2;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/ssl/certs/api.example.com.crt;
    ssl_certificate_key /etc/ssl/private/api.example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req zone=api_limit burst=200 nodelay;

    location / {
        proxy_pass http://payment_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://payment_api/health;
    }
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Key Metrics to Monitor</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">Application Metrics</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Request rate (req/sec)</li>
                      <li>• Response time (p50, p95, p99)</li>
                      <li>• Error rate (%)</li>
                      <li>• Success rate (%)</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">Infrastructure Metrics</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• CPU utilization (%)</li>
                      <li>• Memory usage (MB)</li>
                      <li>• Disk I/O (IOPS)</li>
                      <li>• Network throughput (Mbps)</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">Database Metrics</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Query response time</li>
                      <li>• Connection pool usage</li>
                      <li>• Slow queries count</li>
                      <li>• Replication lag (ms)</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">Business Metrics</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Transaction volume</li>
                      <li>• Revenue processed</li>
                      <li>• Unique users</li>
                      <li>• Webhook delivery success rate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Alerting Rules</h4>
                <div className="space-y-2">
                  {[
                    { metric: 'Error Rate > 5%', severity: 'Critical', action: 'Page on-call engineer' },
                    { metric: 'Response Time P95 > 1000ms', severity: 'High', action: 'Send Slack alert' },
                    { metric: 'CPU Usage > 80%', severity: 'Medium', action: 'Trigger auto-scaling' },
                    { metric: 'Database Connections > 90%', severity: 'High', action: 'Send email alert' },
                    { metric: 'Failed Webhook Deliveries > 10%', severity: 'Medium', action: 'Send Slack alert' },
                  ].map((alert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{alert.metric}</p>
                        <p className="text-xs text-muted-foreground">{alert.action}</p>
                      </div>
                      <Badge variant={
                        alert.severity === 'Critical' ? 'destructive' :
                        alert.severity === 'High' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logging Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'payment-api',
    environment: process.env.NODE_ENV 
  },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    // Write all logs to file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Log structure
logger.info('Payment processed', {
  transactionId: 'txn_123',
  amount: 1000,
  currency: 'USD',
  userId: 'user_456',
  duration: 145
});`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rollback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rollback Procedures</CardTitle>
              <CardDescription>Steps to revert a failed deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Always assess the situation before initiating a rollback. Document the reason and steps taken.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3">When to Rollback</h4>
                <div className="space-y-2">
                  {[
                    'Error rate exceeds 5% for more than 5 minutes',
                    'Critical functionality is broken',
                    'Database migration failed and cannot be fixed quickly',
                    'Security vulnerability discovered in new code',
                    'Performance degradation affecting users (>30% slower)',
                  ].map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-1" />
                      <span className="text-sm">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Rollback Steps</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# 1. Revert application code
kubectl rollout undo deployment/payment-api
# or
git revert HEAD
npm run deploy:production

# 2. Rollback database migrations (if needed)
npx sequelize-cli db:migrate:undo

# 3. Clear cache if necessary
redis-cli FLUSHALL

# 4. Verify rollback
curl https://api.example.com/health
npm run test:smoke -- --env=production

# 5. Monitor for 15 minutes
# Check error rates, response times, logs`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Post-Rollback Actions</h4>
                <div className="space-y-2">
                  {[
                    'Document the incident in the incident log',
                    'Notify stakeholders about the rollback',
                    'Analyze root cause of the failure',
                    'Update deployment checklist if needed',
                    'Schedule a retrospective meeting',
                    'Fix the issues in a new branch',
                    'Add tests to prevent similar issues',
                  ].map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blue-Green Deployment</CardTitle>
              <CardDescription>Zero-downtime deployment strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Blue-green deployment maintains two identical production environments, allowing instant rollback by switching traffic routing.
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`# Deploy to green environment
kubectl apply -f deployment-green.yaml

# Wait for green to be ready
kubectl wait --for=condition=available deployment/payment-api-green

# Run smoke tests on green
npm run test:smoke -- --host=green.internal.example.com

# Switch traffic to green
kubectl patch service payment-api -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for 10 minutes
# If issues found, switch back to blue
kubectl patch service payment-api -p '{"spec":{"selector":{"version":"blue"}}}'

# If successful, keep green as active
# Blue becomes the new standby environment`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
