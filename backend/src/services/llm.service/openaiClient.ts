import { OpenAI } from "openai";
import fs from "fs";

const openai = new OpenAI({});

/**
 * Generate a study schedule with events & exams.
 */

export async function generateSchedule(
  scheduleTitle: string,
  selectedModules: any[]
) {
  const scheduleSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      schedules: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            timezone: { type: "string", enum: ["Africa/Johannesburg"] },
            events: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  color: {
                    type: "string",
                    enum: [
                      "blue",
                      "green",
                      "red",
                      "yellow",
                      "purple",
                      "orange",
                    ],
                  },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                },
                required: [
                  "title",
                  "description",
                  "color",
                  "startDate",
                  "endDate",
                ],
              },
            },
            exams: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  color: {
                    type: "string",
                    enum: [
                      "blue",
                      "green",
                      "red",
                      "yellow",
                      "purple",
                      "orange",
                    ],
                  },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                },
                required: [
                  "title",
                  "description",
                  "color",
                  "startDate",
                  "endDate",
                ],
              },
            },
          },
          required: ["title", "timezone", "events", "exams"],
        },
      },
    },
    required: ["schedules"],
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `LLM Prompt: Exam Study Schedule Generator. You are an intelligent scheduling assistant that creates exam study schedules for students.
1. Rules for generating study events (events):
- Each module must have at least 2 and at most 5 study sessions.
- Spread study sessions evenly between today’s date and 2 days before the exam date.
- Study sessions must not overlap in time, but can occur on the same day.
- Use reasonable 2-hour blocks (e.g., 09:00–11:00, 14:00–16:00).
- Assign each module a unique color from the allowed set.
- Construct the title as follows: "Study:" Module Title "(Session N)"

2. Rules for exams (exams):
- Include all exams from selectedModules.
- Use the exact date and time provided in the input, converted into ISO 8601 format with timezone (+02:00).
- Color must match the study events for that module.
- For exams always keep the description as "Exam"
`,
      },
      {
        role: "user",
        content: `Input:\n${JSON.stringify({
          scheduleTitle,
          selectedModules,
        })}`,
      },
    ],
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "study_schedule_schema",
        schema: scheduleSchema,
        strict: true,
      },
    },
  });

  const raw = completion?.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

export async function generateExam(files: Express.Multer.File[]) {
  const uploadedFileRefs: any[] = [];
  for (const f of files || []) {
    const uploaded = await openai.files.create({
      file: fs.createReadStream(f.path),
      purpose: "user_data",
    });
    uploadedFileRefs.push({
      type: "file",
      file: { file_id: uploaded.id },
    });
  }

  const examPrompt = `
You are an expert exam setter for university students.
You are given either course/lecture notes or exam past papers as context
to generate relevant exam questions.

STRICTLY use this JSON schema:

export type Questions =
  | MCQQuestion
  | Question
  | CompoundQuestion
  | CompoundGroupedQuestions
  | GroupedQuestions;

export interface MCQQuestion {
  type: "mcq";
  details: {
    question: string;
    choices: string[];
    answerIndex: number;
    mark_allocation: number;
  };
}

export interface Question {
  type: "question";
  details: {
    question: string;
    model_answer?: string;
    mark_allocation: number;
  };
}

export interface CompoundQuestion {
  type: "compoundQuestion";
  details: {
    main_question: string;
    sub_questions: string[];
    model_answer?: string;
    mark_allocation: number;
  };
}

export interface CompoundGroupedQuestions {
  type: "compoundGroupedQuestions";
  details: {
    main_question?: string;
    topic?: string;
    groupedQuestions: {
      question: string;
      model_answer?: string;
      mark_allocation: number;
    }[];
  };
}

export interface GroupedQuestions {
  type: "GroupedQuestions";
  details: {
    topic: string;
    groupedQuestions: {
      question: string;
      model_answer?: string;
      mark_allocation: number;
    }[];
  };
}

Requirements:
- Follow the style, structure, and tone of the past paper closely
- Also create new questions based on the lecture notes to make the exam comprehensive.
- Mix question types (MCQs, short-answer, compound, grouped) across the exam.
- Assign realistic mark_allocation values.
- Output must be a valid JSON array of Questions.
- Do not include any explanatory text outside the JSON.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "user",
        content: [...uploadedFileRefs, { type: "text", text: examPrompt }],
      },
    ],
    temperature: 1,
  });

  return JSON.parse(completion.choices[0].message.content);
}
