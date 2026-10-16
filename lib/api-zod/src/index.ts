import { ClinicalQueryBody as clinicalQuerySchema } from "./generated/api";

// The generator gives the runtime schema and request interface the same name.
// Export both explicitly so consumers retain the value and type APIs.
export const ClinicalQueryBody = clinicalQuerySchema;
export type ClinicalQueryBody = import("./generated/types").ClinicalQueryBody;
export { HealthCheckResponse } from "./generated/api";
export type { ClinicalQueryBodyMode, HealthStatus } from "./generated/types";
