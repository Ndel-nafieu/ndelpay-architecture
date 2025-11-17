import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Key, Link2, Table2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  isRequired: boolean;
  isIndexed?: boolean;
}

interface TableSchema {
  name: string;
  description: string;
  columns: Column[];
  relationships: string[];
  indexes: string[];
}

const TABLES: TableSchema[] = [
  {
    name: "users",
    description: "User accounts and authentication",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "email", type: "VARCHAR(255)", isRequired: true, isIndexed: true },
      { name: "phone", type: "VARCHAR(20)", isRequired: false, isIndexed: true },
      { name: "kyc_status", type: "ENUM", isRequired: true },
      { name: "created_at", type: "TIMESTAMP", isRequired: true },
      { name: "updated_at", type: "TIMESTAMP", isRequired: true }
    ],
    relationships: ["wallets", "kyc_documents", "payment_methods"],
    indexes: ["idx_email", "idx_phone", "idx_kyc_status"]
  },
  {
    name: "wallets",
    description: "User wallet balances and currency",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "user_id", type: "UUID", isForeign: true, isRequired: true, isIndexed: true },
      { name: "currency", type: "VARCHAR(3)", isRequired: true },
      { name: "balance", type: "DECIMAL(19,4)", isRequired: true },
      { name: "available_balance", type: "DECIMAL(19,4)", isRequired: true },
      { name: "status", type: "ENUM", isRequired: true },
      { name: "created_at", type: "TIMESTAMP", isRequired: true }
    ],
    relationships: ["users", "transactions"],
    indexes: ["idx_user_id", "idx_currency", "idx_status"]
  },
  {
    name: "transactions",
    description: "Payment and payout transaction records",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "wallet_id", type: "UUID", isForeign: true, isRequired: true, isIndexed: true },
      { name: "type", type: "ENUM", isRequired: true },
      { name: "amount", type: "DECIMAL(19,4)", isRequired: true },
      { name: "currency", type: "VARCHAR(3)", isRequired: true },
      { name: "status", type: "ENUM", isRequired: true, isIndexed: true },
      { name: "reference", type: "VARCHAR(100)", isRequired: true, isIndexed: true },
      { name: "metadata", type: "JSONB", isRequired: false },
      { name: "created_at", type: "TIMESTAMP", isRequired: true, isIndexed: true }
    ],
    relationships: ["wallets", "settlement_batches"],
    indexes: ["idx_wallet_id", "idx_status", "idx_reference", "idx_created_at", "idx_type"]
  },
  {
    name: "payment_methods",
    description: "User payment method details",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "user_id", type: "UUID", isForeign: true, isRequired: true, isIndexed: true },
      { name: "type", type: "ENUM", isRequired: true },
      { name: "provider", type: "VARCHAR(50)", isRequired: true },
      { name: "token", type: "VARCHAR(255)", isRequired: true },
      { name: "is_default", type: "BOOLEAN", isRequired: true },
      { name: "metadata", type: "JSONB", isRequired: false },
      { name: "created_at", type: "TIMESTAMP", isRequired: true }
    ],
    relationships: ["users"],
    indexes: ["idx_user_id", "idx_type", "idx_provider"]
  },
  {
    name: "kyc_documents",
    description: "KYC verification documents",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "user_id", type: "UUID", isForeign: true, isRequired: true, isIndexed: true },
      { name: "document_type", type: "ENUM", isRequired: true },
      { name: "document_url", type: "TEXT", isRequired: true },
      { name: "verification_status", type: "ENUM", isRequired: true, isIndexed: true },
      { name: "verified_at", type: "TIMESTAMP", isRequired: false },
      { name: "created_at", type: "TIMESTAMP", isRequired: true }
    ],
    relationships: ["users"],
    indexes: ["idx_user_id", "idx_verification_status"]
  },
  {
    name: "settlement_batches",
    description: "Settlement batch processing",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "batch_number", type: "VARCHAR(50)", isRequired: true, isIndexed: true },
      { name: "total_amount", type: "DECIMAL(19,4)", isRequired: true },
      { name: "currency", type: "VARCHAR(3)", isRequired: true },
      { name: "status", type: "ENUM", isRequired: true, isIndexed: true },
      { name: "settled_at", type: "TIMESTAMP", isRequired: false },
      { name: "created_at", type: "TIMESTAMP", isRequired: true, isIndexed: true }
    ],
    relationships: ["transactions", "settlement_transactions"],
    indexes: ["idx_batch_number", "idx_status", "idx_created_at"]
  },
  {
    name: "settlement_transactions",
    description: "Individual settlement transaction records",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "batch_id", type: "UUID", isForeign: true, isRequired: true, isIndexed: true },
      { name: "transaction_id", type: "UUID", isForeign: true, isRequired: true, isIndexed: true },
      { name: "amount", type: "DECIMAL(19,4)", isRequired: true },
      { name: "fee", type: "DECIMAL(19,4)", isRequired: true },
      { name: "net_amount", type: "DECIMAL(19,4)", isRequired: true },
      { name: "created_at", type: "TIMESTAMP", isRequired: true }
    ],
    relationships: ["settlement_batches", "transactions"],
    indexes: ["idx_batch_id", "idx_transaction_id"]
  },
  {
    name: "audit_logs",
    description: "System audit trail",
    columns: [
      { name: "id", type: "UUID", isPrimary: true, isRequired: true },
      { name: "user_id", type: "UUID", isForeign: true, isRequired: false, isIndexed: true },
      { name: "action", type: "VARCHAR(100)", isRequired: true, isIndexed: true },
      { name: "entity_type", type: "VARCHAR(50)", isRequired: true },
      { name: "entity_id", type: "UUID", isRequired: true, isIndexed: true },
      { name: "changes", type: "JSONB", isRequired: false },
      { name: "ip_address", type: "INET", isRequired: true },
      { name: "created_at", type: "TIMESTAMP", isRequired: true, isIndexed: true }
    ],
    relationships: ["users"],
    indexes: ["idx_user_id", "idx_action", "idx_entity_id", "idx_created_at"]
  }
];

const TableBox = ({ table, onClick }: { table: TableSchema; onClick: () => void }) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-card border-border"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Table2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{table.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {table.columns.length} columns
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {table.relationships.length} relations
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {table.indexes.length} indexes
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ConnectionLine = () => (
  <div className="flex items-center justify-center my-2">
    <div className="w-px h-8 bg-border" />
  </div>
);

export const DatabaseSchema = () => {
  const [selectedTable, setSelectedTable] = useState<TableSchema | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Database Schema</h1>
        </div>
        <p className="text-muted-foreground">
          NdelPay platform database architecture and table relationships
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {TABLES.map((table) => (
          <TableBox
            key={table.name}
            table={table}
            onClick={() => setSelectedTable(table)}
          />
        ))}
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Entity Relationship Diagram</h2>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex gap-4 flex-wrap justify-center">
            <Badge variant="outline" className="text-sm">users</Badge>
          </div>
          <ConnectionLine />
          <div className="flex gap-4 flex-wrap justify-center">
            <Badge variant="outline" className="text-sm">wallets</Badge>
            <Badge variant="outline" className="text-sm">payment_methods</Badge>
            <Badge variant="outline" className="text-sm">kyc_documents</Badge>
          </div>
          <ConnectionLine />
          <div className="flex gap-4 flex-wrap justify-center">
            <Badge variant="outline" className="text-sm">transactions</Badge>
          </div>
          <ConnectionLine />
          <div className="flex gap-4 flex-wrap justify-center">
            <Badge variant="outline" className="text-sm">settlement_batches</Badge>
          </div>
          <ConnectionLine />
          <div className="flex gap-4 flex-wrap justify-center">
            <Badge variant="outline" className="text-sm">settlement_transactions</Badge>
          </div>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="text-sm">audit_logs</Badge>
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Table2 className="w-5 h-5" />
              {selectedTable?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedTable && (
            <Tabs defaultValue="columns" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="columns">Columns</TabsTrigger>
                <TabsTrigger value="relationships">Relationships</TabsTrigger>
                <TabsTrigger value="indexes">Indexes</TabsTrigger>
              </TabsList>

              <TabsContent value="columns" className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedTable.description}</p>
                <div className="space-y-2">
                  {selectedTable.columns.map((column) => (
                    <div
                      key={column.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-3">
                        {column.isPrimary && (
                          <Key className="w-4 h-4 text-primary" />
                        )}
                        {column.isForeign && (
                          <Link2 className="w-4 h-4 text-secondary" />
                        )}
                        <div>
                          <div className="font-medium text-foreground">{column.name}</div>
                          <div className="text-xs text-muted-foreground">{column.type}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {column.isPrimary && (
                          <Badge variant="default" className="text-xs">PRIMARY</Badge>
                        )}
                        {column.isForeign && (
                          <Badge variant="secondary" className="text-xs">FOREIGN</Badge>
                        )}
                        {column.isRequired && (
                          <Badge variant="outline" className="text-xs">REQUIRED</Badge>
                        )}
                        {column.isIndexed && (
                          <Badge variant="outline" className="text-xs">INDEXED</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="relationships" className="space-y-4">
                <h3 className="font-semibold text-foreground">Related Tables</h3>
                <div className="space-y-2">
                  {selectedTable.relationships.map((relation) => (
                    <div
                      key={relation}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <Link2 className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{relation}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        Foreign Key
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="indexes" className="space-y-4">
                <h3 className="font-semibold text-foreground">Database Indexes</h3>
                <div className="space-y-2">
                  {selectedTable.indexes.map((index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <Database className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{index}</span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        B-Tree
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
