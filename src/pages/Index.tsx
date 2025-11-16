import { useState } from "react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { NetworkTopology } from "@/components/NetworkTopology";
import { PaymentFlowVisualizer } from "@/components/PaymentFlowVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="topology">Network Topology</TabsTrigger>
            <TabsTrigger value="payment-flow">Payment Flow</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
