import type { GuidelineCard } from "@/components/GuidelineDeck";

export const SCREENING_TOPICS = ["Cancer", "Cardiometabolic & bone", "Pregnancy & safety"] as const;

function uspstf(path: string) {
  return { organization: "USPSTF", url: `https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/${path}` };
}

export const SCREENING_CARDS: readonly GuidelineCard[] = [
  {
    id: "crc-ages",
    topic: "Cancer",
    title: "Colorectal cancer screening ages",
    front: "What are the USPSTF grades by age for average-risk colorectal cancer screening?",
    back: "For asymptomatic adults at average risk, screening is Grade B at 45–49 and Grade A at 50–75. At 76–85, offer screening selectively based on health, prior screening, and preferences (Grade C). Screening stops after age 85.",
    source: uspstf("colorectal-cancer-screening"), locator: "2021 final statement, recommendation summary and practice considerations", checkedOn: "2026-11-12",
  },
  {
    id: "crc-tests",
    topic: "Cancer",
    title: "Colorectal screening tests and intervals",
    front: "What are the usual intervals for FIT, stool DNA-FIT, and colonoscopy in average-risk colorectal screening?",
    back: "Annual FIT, stool DNA-FIT every 1–3 years, or colonoscopy every 10 years are among the USPSTF options. An abnormal stool test requires follow-up colonoscopy to complete the screening process.",
    source: uspstf("colorectal-cancer-screening"), locator: "2021 final statement, Table 1 and practice considerations", checkedOn: "2026-11-12",
  },
  {
    id: "breast-mammography",
    topic: "Cancer",
    title: "Breast cancer screening",
    front: "What mammography interval and age range does the 2024 USPSTF recommendation specify?",
    back: "Biennial mammography at ages 40–74 (Grade B). Evidence is insufficient for screening at 75 or older or for supplemental ultrasound or MRI after a negative mammogram in people with dense breasts (I statements). High-risk genetic syndromes, prior high-dose chest radiation at a young age, and prior breast cancer or high-risk breast lesions are outside this statement's scope.",
    source: uspstf("breast-cancer-screening"), locator: "2024 final statement, recommendation and patient population", checkedOn: "2026-11-12",
  },
  {
    id: "cervical-average-risk",
    topic: "Cancer",
    title: "Cervical cancer screening",
    front: "What intervals appear in the final USPSTF cervical cancer screening recommendation for average-risk people with a cervix?",
    back: "Ages 21–29: cytology every 3 years. Ages 30–65: cytology every 3 years, primary high-risk HPV testing every 5 years, or cotesting every 5 years (Grade A). Separate guidance applies to higher-risk histories. The USPSTF update is still in draft as of the source check.",
    source: uspstf("cervical-cancer-screening"), locator: "2018 final statement, recommendation summary", checkedOn: "2026-11-12",
  },
  {
    id: "lung-ldct",
    topic: "Cancer",
    title: "Lung cancer screening",
    front: "Who qualifies for annual low-dose CT under the USPSTF lung cancer recommendation?",
    back: "Adults ages 50–80 with at least 20 pack-years who currently smoke or quit within the past 15 years (Grade B). Stop after 15 years without smoking or if health substantially limits life expectancy or ability or willingness to have curative lung surgery.",
    source: uspstf("lung-cancer-screening"), locator: "2021 final statement, recommendation summary", checkedOn: "2026-11-12",
  },
  {
    id: "prostate-psa",
    topic: "Cancer",
    title: "Prostate cancer screening",
    front: "What are the USPSTF PSA screening recommendations for men ages 55–69 and 70 or older?",
    back: "At 55–69, decide individually after discussing benefits and harms (Grade C). At 70 or older, the USPSTF recommends against PSA-based screening (Grade D).",
    source: uspstf("prostate-cancer-screening"), locator: "2018 final statement, recommendation summary", checkedOn: "2026-11-12",
  },
  {
    id: "osteoporosis-dxa",
    topic: "Cardiometabolic & bone",
    title: "Osteoporosis screening",
    front: "Who is eligible for osteoporosis screening under the 2025 USPSTF recommendation?",
    back: "Screen women 65 or older with DXA. For postmenopausal women younger than 65, identify risk factors, estimate risk with a clinical assessment tool, and screen those at increased risk (both Grade B). Evidence is insufficient for men (I statement). The statement excludes known osteoporosis, prior fragility fractures, and secondary osteoporosis.",
    source: uspstf("osteoporosis-screening"), locator: "2025 final statement, recommendation and implementation", checkedOn: "2026-11-12",
  },
  {
    id: "diabetes-screen",
    topic: "Cardiometabolic & bone",
    title: "Prediabetes and type 2 diabetes screening",
    front: "What is the main USPSTF population for prediabetes and type 2 diabetes screening?",
    back: "Screen asymptomatic, nonpregnant adults ages 35–70 with overweight or obesity (Grade B). Earlier screening can be considered in populations with disproportionately high diabetes prevalence, and a lower BMI threshold may be appropriate in Asian American adults.",
    source: uspstf("screening-for-prediabetes-and-type-2-diabetes"), locator: "2021 final statement, recommendation and practice considerations", checkedOn: "2026-11-12",
  },
  {
    id: "hypertension-screen-confirm",
    topic: "Cardiometabolic & bone",
    title: "Hypertension screening and confirmation",
    front: "What is the USPSTF sequence for hypertension screening and diagnostic confirmation in adults?",
    back: "Use office blood pressure measurement to screen adults 18 or older without known hypertension. Obtain out-of-office measurements for diagnostic confirmation before starting treatment (Grade A).",
    source: uspstf("hypertension-in-adults-screening/"), locator: "2021 final statement, recommendation summary", checkedOn: "2026-11-12",
  },
  {
    id: "aaa-ultrasound",
    topic: "Cardiometabolic & bone",
    title: "Abdominal aortic aneurysm screening",
    front: "How do smoking history and sex change the USPSTF recommendation for AAA ultrasound?",
    back: "Men ages 65–75 who ever smoked: one ultrasound (Grade B). For men the same age who never smoked, offer selectively (Grade C). Women who never smoked and have no family history: no routine screening (Grade D). In women ages 65–75 who ever smoked or have a family history, evidence is insufficient (I statement).",
    source: uspstf("abdominal-aortic-aneurysm-screening"), locator: "2019 final statement, recommendation summary", checkedOn: "2026-11-12",
  },
  {
    id: "syphilis-pregnancy-screen",
    topic: "Pregnancy & safety",
    title: "Syphilis screening in pregnancy",
    front: "When and for whom does the USPSTF recommend syphilis screening during pregnancy?",
    back: "Screen everyone who is pregnant as early as possible regardless of risk factors (Grade A). If missed early, screen at the first opportunity, including at presentation for delivery. The USPSTF statement concerns early universal screening. Consult the separately issued guidance for repeat screening.",
    source: uspstf("syphilis-infection-in-pregnancy-screening"), locator: "2025 final statement, clinician summary", checkedOn: "2026-11-12",
  },
  {
    id: "ipv-screen",
    topic: "Pregnancy & safety",
    title: "Intimate partner violence screening",
    front: "Who should be screened for intimate partner violence under the 2025 USPSTF statement?",
    back: "Screen women of reproductive age, including during pregnancy and postpartum (Grade B). After a positive screen, evaluate and provide or refer to appropriate multicomponent interventions with ongoing support.",
    source: uspstf("intimate-partner-violence-and-abuse-of-elderly-and-vulnerable-adults-screening"), locator: "2025 final statement, clinician summary", checkedOn: "2026-11-12",
  },
];
