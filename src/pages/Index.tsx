import { useState } from "react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { NetworkTopology } from "@/components/NetworkTopology";
import { PaymentFlowVisualizer } from "@/components/PaymentFlowVisualizer";
import { PayoutFlowVisualizer } from "@/components/PayoutFlowVisualizer";
import { ReconciliationView } from "@/components/ReconciliationView";
import { DatabaseSchema } from "@/components/DatabaseSchema";
import { ApiDocumentation } from "@/components/ApiDocumentation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-7 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="topology">Network</TabsTrigger>
            <TabsTrigger value="payment-flow">Payments</TabsTrigger>
            <TabsTrigger value="payout-flow">Payouts</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="api-docs">API Docs</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
