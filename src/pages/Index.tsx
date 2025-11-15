import { useState } from "react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { NetworkTopology } from "@/components/NetworkTopology";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="topology">Network Topology</TabsTrigger>
          </TabsList>
          <TabsContent value="architecture">
            <ArchitectureDiagram />
          </TabsContent>
          <TabsContent value="topology">
            <NetworkTopology />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
