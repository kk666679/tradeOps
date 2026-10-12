import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"

type TaskStatus = "pending" | "running" | "done" | "failed"

interface TwinTaskItem {
  id: string
  label: string
  status: TaskStatus
  detail?: string
}

interface TwinTaskProps {
  tasks: TwinTaskItem[]
  className?: string
}

const STATUS_ICON: Record<TaskStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-slate-500" />,
  running: <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />,
  done: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  failed: <XCircle className="h-4 w-4 text-red-400" />,
}

export function TwinTask({ tasks, className }: TwinTaskProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start gap-3 text-xs">
          <span className="mt-0.5 flex-shrink-0">{STATUS_ICON[task.status]}</span>
          <div>
            <p className={cn(
              "font-medium",
              task.status === "done" && "text-slate-400 line-through",
              task.status === "failed" && "text-red-400",
              task.status === "running" && "text-blue-300",
              task.status === "pending" && "text-slate-300",
            )}>
              {task.label}
            </p>
            {task.detail && <p className="text-slate-500">{task.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
