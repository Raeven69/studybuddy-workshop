export type TaskStatus = "todo" | "in-progress" | "done";

export type Difficulty = "easy" | "medium" | "hard";

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  status: TaskStatus;
  createdAt: string;
  difficulty: Difficulty;
}

export interface CreateTaskInput {
  title: string;
  subject: string;
  estimatedMinutes: number;
  difficulty?: Difficulty;
}
