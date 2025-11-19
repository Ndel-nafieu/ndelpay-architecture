import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { NetworkTopology } from "@/components/NetworkTopology";
import { PaymentFlowVisualizer } from "@/components/PaymentFlowVisualizer";
import { PayoutFlowVisualizer } from "@/components/PayoutFlowVisualizer";
import { ReconciliationView } from "@/components/ReconciliationView";
import { DatabaseSchema } from "@/components/DatabaseSchema";
import { ApiDocumentation } from "@/components/ApiDocumentation";
import { StateMachineVisualizer } from "@/components/StateMachineVisualizer";
import { SequenceDiagramViewer } from "@/components/SequenceDiagramViewer";
import { ErrorHandlingGuide } from "@/components/ErrorHandlingGuide";
import { SecurityFlowDiagram } from "@/components/SecurityFlowDiagram";
import { EventSystemVisualizer } from "@/components/EventSystemVisualizer";
import { BusinessRulesDashboard } from "@/components/BusinessRulesDashboard";
import { CodeGenerator } from "@/components/CodeGenerator";
import { ApiTesting } from "@/components/ApiTesting";
import { PaymentLifecycleTimeline } from "@/components/PaymentLifecycleTimeline";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { DeploymentGuide } from "@/components/DeploymentGuide";
import { TestingScenarios } from "@/components/TestingScenarios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full max-w-7xl mx-auto grid-cols-7 lg:grid-cols-19 gap-1 mb-8 h-auto">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="topology">Network</TabsTrigger>
            <TabsTrigger value="payment-flow">Payments</TabsTrigger>
            <TabsTrigger value="payout-flow">Payouts</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="api-docs">API Docs</TabsTrigger>
            <TabsTrigger value="state-machine">State Machine</TabsTrigger>
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="business">Business Rules</TabsTrigger>
            <TabsTrigger value="code-gen">Code Generator</TabsTrigger>
            <TabsTrigger value="api-test">API Testing</TabsTrigger>
            <TabsTrigger value="lifecycle">Payment Lifecycle</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          <TabsContent value="architecture">
            <ArchitectureDiagram />
          </TabsContent>
          <TabsContent value="topology">
            <NetworkTopology />
          </TabsContent>
          <TabsContent value="payment-flow">
            <PaymentFlowVisualizer />
          </TabsContent>
          <TabsContent value="payout-flow">
            <PayoutFlowVisualizer />
          </TabsContent>
          <TabsContent value="reconciliation">
            <ReconciliationView />
          </TabsContent>
          <TabsContent value="database">
            <DatabaseSchema />
          </TabsContent>
          <TabsContent value="api-docs">
            <ApiDocumentation />
          </TabsContent>
          <TabsContent value="state-machine">
            <StateMachineVisualizer />
          </TabsContent>
          <TabsContent value="sequences">
            <SequenceDiagramViewer />
          </TabsContent>
          <TabsContent value="errors">
            <ErrorHandlingGuide />
          </TabsContent>
          <TabsContent value="security">
            <SecurityFlowDiagram />
          </TabsContent>
          <TabsContent value="events">
            <EventSystemVisualizer />
          </TabsContent>
          <TabsContent value="business">
            <BusinessRulesDashboard />
          </TabsContent>
          <TabsContent value="code-gen">
            <CodeGenerator />
          </TabsContent>
          <TabsContent value="api-test">
            <ApiTesting />
          </TabsContent>
          <TabsContent value="lifecycle">
            <PaymentLifecycleTimeline />
          </TabsContent>
          <TabsContent value="monitoring">
            <MonitoringDashboard />
          </TabsContent>
          <TabsContent value="deployment">
            <DeploymentGuide />
          </TabsContent>
          <TabsContent value="testing">
            <TestingScenarios />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
