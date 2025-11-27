export type TaskStatus = "todo" | "in-progress" | "done"

export type Difficulty = "easy" | "medium" | "hard"

export type StudyTask = {
  id: string
  title: string
  subject: string
  estimatedMinutes: number
  status: TaskStatus
  createdAt: string
  difficulty: Difficulty
}

export type CreateTaskInput = Omit<StudyTask, "id" | "status" | "createdAt"> & { difficulty?: Difficulty }

export type FilterType = "all" | TaskStatus
export type SortDirection = "asc" | "desc"
