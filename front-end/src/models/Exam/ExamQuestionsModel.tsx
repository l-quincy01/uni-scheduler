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
