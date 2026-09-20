import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuditLogService,
  type CrudAction,
} from "../audit/audit-log.service";
import { env } from "../config/env";

const METHOD_ACTIONS: Partial<
  Record<string, CrudAction>
> = {
  GET: "READ",
  POST: "CREATE",
  PUT: "UPDATE",
  PATCH: "UPDATE",
  DELETE: "DELETE",
};

const SENSITIVE_FIELDS = new Set([
  "password",
  "passwordhash",
  "token",
  "accesstoken",
  "authorization",
  "secret",
  "jwtsecret",
  "awsaccesskeyid",
  "awssecretaccesskey",
]);

const auditLogService = env.AWS_DYNAMODB_AUDIT_TABLE
  ? new AuditLogService()
  : null;

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    const entries = Object.entries(
      value as Record<string, unknown>
    );

    return Object.fromEntries(
      entries.map(([key, childValue]) => {
        const normalizedKey = key
          .replace(/[^a-z0-9]/gi, "")
          .toLowerCase();

        if (SENSITIVE_FIELDS.has(normalizedKey)) {
          return [key, "[REDACTED]"];
        }

        return [key, sanitize(childValue)];
      })
    );
  }

  return value;
}

function getResource(path: string): string {
  return (
    path
      .split("?")[0]
      .split("/")
      .filter(Boolean)[0] ?? "root"
  );
}

export function auditLogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const action = METHOD_ACTIONS[req.method];

  if (
    !auditLogService ||
    !action ||
    req.path === "/health"
  ) {
    next();
    return;
  }

  const startedAt = Date.now();

  res.on("finish", () => {
    const path = req.originalUrl.split("?")[0];

    void auditLogService
      .record({
        action,
        method: req.method,
        path,
        resource: getResource(path),
        actorId: req.user?.id,
        actorRole: req.user?.role,
        requestData: sanitize({
          params: req.params,
          query: req.query,
          body: req.body,
        }),
        responseStatus: res.statusCode,
        durationMilliseconds:
          Date.now() - startedAt,
        ipAddress: req.ip,
      })
      .catch((error) => {
        console.error(
          "Failed to write the audit log:",
          error
        );
      });
  });

  next();
}