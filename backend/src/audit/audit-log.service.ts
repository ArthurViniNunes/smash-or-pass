import { randomUUID } from "node:crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { env } from "../config/env";

export type CrudAction =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE";

export interface AuditLogInput {
  action: CrudAction;
  method: string;
  path: string;
  resource: string;
  actorId?: string;
  actorRole?: string;
  requestData: unknown;
  responseStatus: number;
  durationMilliseconds: number;
  ipAddress?: string;
}

export class AuditLogService {
  private readonly documentClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    if (!env.AWS_DYNAMODB_AUDIT_TABLE) {
      throw new Error(
        "AWS_DYNAMODB_AUDIT_TABLE is required for audit logging."
      );
    }

    this.tableName = env.AWS_DYNAMODB_AUDIT_TABLE;

    const client = new DynamoDBClient({
      region: env.AWS_REGION,
    });

    this.documentClient = DynamoDBDocumentClient.from(
      client,
      {
        marshallOptions: {
          removeUndefinedValues: true,
        },
      }
    );
  }

  async record(input: AuditLogInput): Promise<void> {
    const timestamp = new Date().toISOString();

    await this.documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          id: randomUUID(),
          ...input,
          timestamp,
          timestampEpoch: Date.now(),
        },
      })
    );
  }
}