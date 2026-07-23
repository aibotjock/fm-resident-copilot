/**
 * Curated guideline chunks for RAG — the complete ABFM Board exam blueprint
 * knowledge base, organized into per-domain seed files under ./seed/.
 * Bump INGEST_VERSION whenever seed content changes to trigger re-ingestion.
 */
export { type GuidelineChunk } from "./seed/types.js";
import { type GuidelineChunk } from "./seed/types.js";

import { CARDIOVASCULAR } from "./seed/cardiovascular.js";
import { RESPIRATORY } from "./seed/respiratory.js";
import { MUSCULOSKELETAL } from "./seed/musculoskeletal.js";
import { ENDOCRINE } from "./seed/endocrine.js";
import { GASTROENTEROLOGY } from "./seed/gastroenterology.js";
import { BEHAVIORAL } from "./seed/behavioral.js";
import { MATERNITY } from "./seed/maternity.js";
import { WOMENS_HEALTH } from "./seed/womens-health.js";
import { MENS_HEALTH } from "./seed/mens-health.js";
import { RENAL } from "./seed/renal.js";
import { NEUROLOGY } from "./seed/neurology.js";
import { DERMATOLOGY } from "./seed/dermatology.js";
import { HEMATOLOGY_ONCOLOGY } from "./seed/hematology-oncology.js";
import { INFECTIOUS_DISEASE } from "./seed/infectious-disease.js";
import { PREVENTIVE_CHUNKS } from "./seed/preventive.js";
import { PEDIATRICS_CHUNKS } from "./seed/pediatrics.js";
import { GERIATRICS_CHUNKS } from "./seed/geriatrics.js";
import { ENT_OPHTHO_CHUNKS } from "./seed/ent-ophtho.js";
import { EMERGENT_CHUNKS } from "./seed/emergent.js";
import { SPORTS_MEDICINE } from "./seed/sports-medicine.js";
import { PRACTICE_BASED } from "./seed/practice-based.js";
import { EXTRAS } from "./seed/extras.js";

export const INGEST_VERSION = "v9";

export const SEED_CHUNKS: GuidelineChunk[] = [
  ...CARDIOVASCULAR,
  ...RESPIRATORY,
  ...MUSCULOSKELETAL,
  ...SPORTS_MEDICINE,
  ...ENDOCRINE,
  ...GASTROENTEROLOGY,
  ...BEHAVIORAL,
  ...MATERNITY,
  ...WOMENS_HEALTH,
  ...MENS_HEALTH,
  ...RENAL,
  ...NEUROLOGY,
  ...DERMATOLOGY,
  ...HEMATOLOGY_ONCOLOGY,
  ...INFECTIOUS_DISEASE,
  ...PREVENTIVE_CHUNKS,
  ...PEDIATRICS_CHUNKS,
  ...GERIATRICS_CHUNKS,
  ...ENT_OPHTHO_CHUNKS,
  ...EMERGENT_CHUNKS,
  ...PRACTICE_BASED,
  ...EXTRAS,
];
