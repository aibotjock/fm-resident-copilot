export const ACGME_FAMILY_MEDICINE = {
  revision: "October 2019",
  worksheetVersion: "2.2",
  checkedOn: "November 12, 2026",
  milestones: "https://www.acgme.org/globalassets/pdfs/milestones/familymedicinemilestones.pdf",
  supplementalGuide: "https://www.acgme.org/globalassets/pdfs/milestones/familymedicinesupplementalguide.pdf",
} as const;

interface Milestone {
  code: string;
  title: string;
  summary: string;
  prompt: string;
  pdfPage: number;
  guidePage: number;
}

interface MilestoneDomain {
  code: string;
  name: string;
  items: readonly Milestone[];
}

export const FAMILY_MEDICINE_MILESTONES: readonly MilestoneDomain[] = [
  {
    code: "PC",
    name: "Patient Care",
    items: [
      {
        code: "PC1",
        title: "Acute illness",
        summary: "Recognize urgent presentations, prioritize the workup, and coordinate stabilization and care as complexity increases.",
        prompt: "In a simulated night-float case, which findings made the situation urgent, and how did you communicate the priorities to the team?",
        pdfPage: 8,
        guidePage: 4,
      },
      {
        code: "PC2",
        title: "Chronic illness",
        summary: "Build longitudinal plans that account for comorbidities, competing priorities, and the patient's own goals and ability to manage their condition.",
        prompt: "Describe a fictional continuity visit in which two chronic conditions competed for attention. How did you agree on a manageable goal?",
        pdfPage: 9,
        guidePage: 6,
      },
      {
        code: "PC3",
        title: "Prevention and wellness",
        summary: "Compare prevention recommendations, work through barriers to screening, and include health promotion across visit types.",
        prompt: "How would you explain two differing screening recommendations in a practice case while making the options and tradeoffs clear?",
        pdfPage: 10,
        guidePage: 8,
      },
      {
        code: "PC4",
        title: "Care when the diagnosis is unclear",
        summary: "Maintain continuity during diagnostic uncertainty, explain follow-up and warning signs, and choose tests or consultations that could change the plan.",
        prompt: "For a simulated patient with persistent, unexplained fatigue, how would you state what remains uncertain and who will follow up?",
        pdfPage: 11,
        guidePage: 10,
      },
      {
        code: "PC5",
        title: "Procedural care",
        summary: "Match procedural options to patient needs, explain what to expect, and develop skills and referral judgment within the scope of training.",
        prompt: "In a procedure simulation, what would you ask an observer to assess about your counseling or handling of a complication?",
        pdfPage: 12,
        guidePage: 12,
      },
    ],
  },
  {
    code: "MK",
    name: "Medical Knowledge",
    items: [
      {
        code: "MK1",
        title: "Knowledge across the lifespan",
        summary: "Connect pathophysiology, management knowledge, and behavioral strategies for conditions encountered across the lifespan.",
        prompt: "Choose a board-study topic. How does its mechanism explain a common presentation, and how could age or behavior change the discussion?",
        pdfPage: 13,
        guidePage: 14,
      },
      {
        code: "MK2",
        title: "Clinical reasoning and decisions",
        summary: "Organize a patient story into a useful synthesis, rank plausible diagnoses, interpret diagnostic information, and reappraise assumptions.",
        prompt: "Summarize a complex practice case in one sentence. Which finding most changes your ranked differential, and what could make your initial conclusion wrong?",
        pdfPage: 14,
        guidePage: 16,
      },
    ],
  },
  {
    code: "SBP",
    name: "Systems-Based Practice",
    items: [
      {
        code: "SBP1",
        title: "Safety and improvement",
        summary: "Identify and report safety events, analyze their system causes, practice disclosure, and participate in quality-improvement work.",
        prompt: "For a simulated near miss, name one system contributor, one change to test, and one measure you could use to evaluate it.",
        pdfPage: 15,
        guidePage: 18,
      },
      {
        code: "SBP2",
        title: "Navigating care systems",
        summary: "Coordinate care and transitions with other professionals while recognizing barriers and adapting to the needs of the community served.",
        prompt: "In a discharge exercise, how would you assign ownership of pending results and account for a barrier to follow-up?",
        pdfPage: 16,
        guidePage: 20,
      },
      {
        code: "SBP3",
        title: "The physician's role in the health system",
        summary: "Understand how delivery and payment structures affect access, costs, and practice, and how physicians can help improve the system.",
        prompt: "Choose one fictional access barrier related to insurance, payment, or delivery of care. Who in the system could address it?",
        pdfPage: 17,
        guidePage: 23,
      },
      {
        code: "SBP4",
        title: "Advocacy",
        summary: "Identify needs affecting patient populations and use appropriate channels to advocate for those populations and for family medicine.",
        prompt: "Identify one community concern, a potential partner, and one feasible advocacy step you could discuss with a mentor.",
        pdfPage: 18,
        guidePage: 26,
      },
    ],
  },
  {
    code: "PBLI",
    name: "Practice-Based Learning and Improvement",
    items: [
      {
        code: "PBLI1",
        title: "Using evidence",
        summary: "Frame an answerable question, locate and appraise the evidence, and consider how it fits the person's circumstances and preferences.",
        prompt: "Take one screening question. What population did the guideline address, and what limits its applicability to your hypothetical case?",
        pdfPage: 19,
        guidePage: 28,
      },
      {
        code: "PBLI2",
        title: "Reflection and growth",
        summary: "Seek feedback, identify a gap between intended and observed performance, and use that gap to revise a learning plan.",
        prompt: "Turn one piece of feedback into a specific practice goal. What observation would show improvement at your next check-in?",
        pdfPage: 20,
        guidePage: 30,
      },
    ],
  },
  {
    code: "PROF",
    name: "Professionalism",
    items: [
      {
        code: "PROF1",
        title: "Professional conduct and ethics",
        summary: "Recognize professional and ethical issues, use appropriate resources, and respond to lapses or conflicts with sound judgment.",
        prompt: "In a hypothetical confidentiality conflict, what values are in tension and what resource would you consult?",
        pdfPage: 21,
        guidePage: 33,
      },
      {
        code: "PROF2",
        title: "Reliability and follow-through",
        summary: "Own tasks and omissions, complete responsibilities reliably, and anticipate obstacles when the workload becomes complex.",
        prompt: "In a busy-service exercise, how would you make ownership and deadlines clear for unfinished tasks?",
        pdfPage: 22,
        guidePage: 35,
      },
      {
        code: "PROF3",
        title: "Self-awareness and asking for help",
        summary: "Recognize personal and professional limits, reflect on well-being, and seek appropriate support.",
        prompt: "What signal would tell you to seek supervision or support in a simulated high-workload situation, and whom would you contact?",
        pdfPage: 23,
        guidePage: 37,
      },
    ],
  },
  {
    code: "ICS",
    name: "Interpersonal and Communication Skills",
    items: [
      {
        code: "ICS1",
        title: "Communicating with patients and families",
        summary: "Build rapport, identify and address communication barriers, and make room for patient and family preferences in discussions.",
        prompt: "For a simulated difficult conversation, what would you say to check understanding and invite the family's questions?",
        pdfPage: 24,
        guidePage: 39,
      },
      {
        code: "ICS2",
        title: "Communicating with the care team",
        summary: "Communicate effectively with team members and consultants, clarify requests, and work through disagreement respectfully.",
        prompt: "Give a short simulated consult or handoff with a clear question, key findings, and explicit ownership of the next step.",
        pdfPage: 25,
        guidePage: 42,
      },
      {
        code: "ICS3",
        title: "Documentation and system communication",
        summary: "Use documentation and communication channels responsibly, with attention to clarity, timeliness, and privacy.",
        prompt: "Rewrite a fictional handoff note so the next reader can quickly identify the assessment, open questions, and follow-up owner.",
        pdfPage: 26,
        guidePage: 44,
      },
    ],
  },
];
