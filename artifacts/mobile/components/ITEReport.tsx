import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, Linking } from "react-native";
import { ITEScore, ABFM_ITE_SECTIONS } from "../types";
import {
  ITE_ACTIVITY_DOMAINS,
  reportValue,
  compareITE,
  ITEBenchmark,
  ScoreMetric,
} from "../utils/ite";
const inputStyle = {
  backgroundColor: "#F1F5F9",
  color: "#0F172A",
  padding: 10,
  borderRadius: 8,
  marginVertical: 4,
};
const textStyle = { color: "#334155", marginVertical: 4 };
export function ITEReportForm({
  onSave,
}: {
  onSave: (v: Omit<ITEScore, "id" | "createdAt">) => Promise<void>;
}) {
  const [year, setYear] = useState("2025"),
    [pgy, setPgy] = useState<1 | 2 | 3>(1),
    [format, setFormat] = useState<"activity_2025" | "legacy">("activity_2025"),
    [metric, setMetric] = useState<ScoreMetric>("scaled"),
    [values, setValues] = useState<Record<string, string>>({}),
    [overall, setOverall] = useState(""),
    [percent, setPercent] = useState<Record<string, string>>({}),
    [kind, setKind] = useState<NonNullable<ITEScore["percentageKind"]>>(
      "report_percentage_unspecified",
    ),
    [means, setMeans] = useState<Record<string, string>>({}),
    [source, setSource] = useState(""),
    [sourceLabel, setSourceLabel] = useState(""),
    [extra, setExtra] = useState("");
  const fields: string[] = [
    ...new Set([
      ...(format === "activity_2025"
        ? ITE_ACTIVITY_DOMAINS
        : ABFM_ITE_SECTIONS),
      ...extra
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    ]),
  ];
  const choice = (label: string, selected: boolean, fn: () => void) => (
    <Pressable
      key={label}
      onPress={fn}
      style={{
        padding: 10,
        backgroundColor: selected ? "#BFDBFE" : "#E2E8F0",
        borderRadius: 6,
        margin: 3,
      }}
    >
      <Text style={{ color: "#0F172A" }}>{label}</Text>
    </Pressable>
  );
  async function save() {
    try {
      if (
        !/^\d{4}$/.test(year) ||
        Number(year) < 2000 ||
        Number(year) > new Date().getFullYear()
      )
        throw Error("Enter the exam calendar year, not PGY.");
      const scores: Record<string, number> = {},
        percentages: Record<string, number> = {};
      for (const f of fields) {
        const v = reportValue(values[f] || "", metric);
        if (v !== undefined) scores[f] = v;
        const pct = reportValue(percent[f] || "", "percent_correct");
        if (pct !== undefined) percentages[f] = pct;
      }
      const overallScore = reportValue(overall, metric);
      if (
        !Object.keys(scores).length &&
        overallScore === undefined &&
        !Object.keys(percentages).length
      )
        throw Error("Enter at least one reported value.");
      const benchmarks: ITEBenchmark[] = [];
      for (const level of [1, 2, 3]) {
        const mean = reportValue(means[level] || "", metric);
        if (mean !== undefined) {
          const b = {
            examYear: Number(year),
            pgy: level,
            metric,
            domain: "Overall",
            mean,
            sourceUrl: source,
            sourceLabel,
          };
          compareITE(
            overallScore ?? mean,
            { examYear: Number(year), pgy, metric, domain: "Overall" },
            b,
            true,
          );
          benchmarks.push(b);
        }
      }
      await onSave({
        year: pgy,
        takenDate: year,
        examYear: Number(year),
        format,
        scoreMetric: metric,
        scores,
        overallScore,
        domainPercentages: percentages,
        percentageKind: kind,
        benchmarks,
      });
    } catch (e) {
      Alert.alert("Check score entry", (e as Error).message);
    }
  }
  return (
    <View
      style={{
        gap: 8,
        backgroundColor: "#F8FAFC",
        padding: 12,
        borderRadius: 10,
      }}
    >
      <Text
        onPress={() =>
          Linking.openURL(
            "https://www.theabfm.org/become-certified/in-training-exam/",
          )
        }
        style={{ color: "#1D4ED8" }}
      >
        Open official ABFM ITE reports and resources
      </Text>
      <Text style={textStyle}>
        Copy values exactly from the report. Scaled scores, percent correct and
        percentiles are distinct. No national norms are prefilled.
      </Text>
      <Text style={textStyle}>Exam calendar year</Text>
      <TextInput
        accessibilityLabel="Exam calendar year"
        style={inputStyle}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      <Text style={textStyle}>Training level when you took that exam</Text>
      <View style={{ flexDirection: "row" }}>
        {([1, 2, 3] as const).map((n) =>
          choice(`PGY-${n}`, pgy === n, () => setPgy(n)),
        )}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {choice("2025 activity domains", format === "activity_2025", () =>
          setFormat("activity_2025"),
        )}
        {choice("Legacy topic report", format === "legacy", () =>
          setFormat("legacy"),
        )}
      </View>
      <Text style={textStyle}>Metric for the main score column</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {(["scaled", "percent_correct", "percentile"] as const).map((m) =>
          choice(m.replaceAll("_", " "), metric === m, () => {
            setMetric(m);
            setValues({});
            setOverall("");
            setMeans({});
          }),
        )}
      </View>
      <Text style={textStyle}>Overall score (optional)</Text>
      <TextInput
        style={inputStyle}
        accessibilityLabel="Overall reported score"
        value={overall}
        onChangeText={setOverall}
        keyboardType="decimal-pad"
      />
      <Text style={textStyle}>
        Optional percentage column: choose the report's actual label. Leave
        unspecified when unclear.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {(
          [
            "report_percentage_unspecified",
            "percent_correct",
            "percentile",
          ] as const
        ).map((m) =>
          choice(m.replaceAll("_", " "), kind === m, () => setKind(m)),
        )}
      </View>
      {fields.map((f) => (
        <View key={f}>
          <Text style={textStyle}>{f}</Text>
          <TextInput
            style={inputStyle}
            accessibilityLabel={`${f} score`}
            placeholder={`${metric.replaceAll("_", " ")} — optional`}
            value={values[f] || ""}
            onChangeText={(v) => setValues({ ...values, [f]: v })}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={inputStyle}
            accessibilityLabel={`${f} reported percentage`}
            placeholder="Reported percentage — optional"
            value={percent[f] || ""}
            onChangeText={(v) => setPercent({ ...percent, [f]: v })}
            keyboardType="decimal-pad"
          />
        </View>
      ))}
      <Text style={textStyle}>
        Additional report category names, one per line (kept as reported, never
        remapped)
      </Text>
      <TextInput
        style={inputStyle}
        multiline
        value={extra}
        onChangeText={setExtra}
      />
      <Text style={textStyle}>
        Optional national overall means for this same exam year and score
        metric, from an official ABFM report. Other PGY levels are contextual
        comparisons, not your same-level rank.
      </Text>
      {[1, 2, 3].map((n) => (
        <TextInput
          key={n}
          style={inputStyle}
          accessibilityLabel={`PGY-${n} national overall mean`}
          placeholder={`PGY-${n} mean — leave blank if unavailable`}
          value={means[n] || ""}
          onChangeText={(v) => setMeans({ ...means, [n]: v })}
          keyboardType="decimal-pad"
        />
      ))}
      <TextInput
        style={inputStyle}
        accessibilityLabel="Benchmark official source URL"
        placeholder="Official ABFM source URL"
        value={source}
        onChangeText={setSource}
        autoCapitalize="none"
      />
      <TextInput
        style={inputStyle}
        placeholder="Source title and table/page"
        value={sourceLabel}
        onChangeText={setSourceLabel}
      />
      <Pressable
        onPress={save}
        style={{ padding: 14, backgroundColor: "#1D4ED8", borderRadius: 8 }}
      >
        <Text style={{ color: "white" }}>Save report</Text>
      </Pressable>
    </View>
  );
}
export function ITEReportView({ report: r }: { report: ITEScore }) {
  const metric = r.scoreMetric || "percentile";
  return (
    <View style={{ backgroundColor: "#F8FAFC", padding: 10, borderRadius: 8 }}>
      <Text style={textStyle}>
        {r.examYear || r.takenDate} · PGY-{r.year} ·{" "}
        {r.format || "legacy topic entry"} · {metric.replaceAll("_", " ")}
      </Text>
      {r.overallScore !== undefined && (
        <Text style={textStyle}>Overall: {r.overallScore}</Text>
      )}
      {Object.entries(r.scores).map(([k, v]) => (
        <Text key={k} style={textStyle}>
          {k}: {v}
          {metric === "percent_correct"
            ? "%"
            : metric === "percentile"
              ? " percentile"
              : " scaled"}
          {r.domainPercentages?.[k] !== undefined
            ? ` · ${r.domainPercentages[k]}% (${r.percentageKind || "label unspecified"})`
            : ""}
        </Text>
      ))}
      {Object.entries(r.domainPercentages || {})
        .filter(([k]) => r.scores[k] === undefined)
        .map(([k, v]) => (
          <Text key={k} style={textStyle}>
            {k}: {v}% ({r.percentageKind || "label unspecified"})
          </Text>
        ))}
      {r.overallScore !== undefined &&
        (r.benchmarks || []).map((b) => {
          try {
            const c = compareITE(
              r.overallScore!,
              { examYear: r.examYear!, pgy: r.year, metric, domain: "Overall" },
              b,
              true,
            );
            return (
              <Text key={b.pgy} style={textStyle}>
                {c.sameLevel ? "Same-level comparison" : "Other-level context"}:{" "}
                {b.examYear} PGY-{b.pgy} mean {b.mean}; your difference{" "}
                {c.difference >= 0 ? "+" : ""}
                {c.difference.toFixed(1)}. Source: {b.sourceLabel} (
                {b.sourceUrl}). User-transcribed; not independently verified.
              </Text>
            );
          } catch {
            return (
              <Text key={b.pgy} style={textStyle}>
                Comparison unavailable: incompatible or invalid benchmark.
              </Text>
            );
          }
        })}
      {!r.benchmarks?.length && (
        <Text style={textStyle}>
          National comparison unavailable until official year/PGY/metric-matched
          data are supplied. Practice accuracy is not an ITE percentile or
          predicted score.
        </Text>
      )}
    </View>
  );
}
