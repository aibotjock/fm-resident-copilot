import assert from "node:assert/strict";
import { batchProcess, batchProcessWithSSE } from "../../lib/integrations-openai-ai-server/src/batch/utils";

const quick={retries:1,minTimeout:1,maxTimeout:1};
let attempts=0;
await assert.rejects(batchProcess([1],async()=>{attempts++;throw new Error("invalid input");},quick),/invalid input/);
assert.equal(attempts,1,"Non-retryable errors must abort immediately");
attempts=0;
assert.deepEqual(await batchProcess([1],async()=>{if(++attempts===1)throw new Error("429 rate limit");return 2;},quick),[2]);
assert.equal(attempts,2);
attempts=0;const events: {type:string;[key:string]:unknown}[]=[];
assert.deepEqual(await batchProcessWithSSE([1],async()=>{if(++attempts===1)throw new Error("429 rate limit");return 3;},e=>events.push(e),quick),[3]);
assert.equal(attempts,2,"SSE retry callback must inspect the nested error, not its context object");
assert.equal(events.at(-1)?.errors,0);
console.log("Batch abort, rate-limit retry, and SSE retry checks passed; no API requests made.");
