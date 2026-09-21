import toast from "react-hot-toast";

import type { TaskStatus } from "../../types/taskTypes";
import { useUpdateTaskStatusMutation } from "../../services/tasksApi";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

interface Props {
  taskId: number;
  value: TaskStatus;
  disabled?: boolean;
}

export function TaskStatusSelect({ taskId, value, disabled }: Props) {
  const [updateStatus, { isLoading }] = useUpdateTaskStatusMutation();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateStatus({
        id: taskId,
        status: e.target.value as TaskStatus,
      }).unwrap();
      toast.success("Task status updated!");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Status update failed";
      toast.error(msg);
    }
  };

  return (
    <select
      className="border border-gray-200 rounded-md px-2 py-1 text-xs w-[130px] bg-white disabled:opacity-50"
      value={value}
      onChange={handleChange}
      disabled={disabled || isLoading}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
