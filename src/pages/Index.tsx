import { useState } from "react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { NetworkTopology } from "@/components/NetworkTopology";
import { PaymentFlowVisualizer } from "@/components/PaymentFlowVisualizer";
import { PayoutFlowVisualizer } from "@/components/PayoutFlowVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="topology">Network Topology</TabsTrigger>
            <TabsTrigger value="payment-flow">Payment Flow</TabsTrigger>
            <TabsTrigger value="payout-flow">Payout Flow</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
