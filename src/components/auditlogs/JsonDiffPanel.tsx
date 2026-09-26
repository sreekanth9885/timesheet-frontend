import { parseMaybeJson } from "../../utils/auditLogHelpers";

interface Props {
  oldValues: unknown;
  newValues: unknown;
}

export function JsonDiffPanel({ oldValues, newValues }: Props) {
  const oldVal = parseMaybeJson(oldValues);
  const newVal = parseMaybeJson(newValues);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-xs font-bold mb-1.5 text-red-500">
          PREVIOUS STATE (OLD)
        </div>
        <div className="bg-slate-800 text-red-400 p-3.5 rounded-md font-mono text-[11px] max-h-[200px] overflow-y-auto">
          <pre className="m-0 font-inherit">
            {JSON.stringify(oldVal, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold mb-1.5 text-green-500">
          MUTATED STATE (NEW)
        </div>
        <div className="bg-slate-800 text-green-400 p-3.5 rounded-md font-mono text-[11px] max-h-[200px] overflow-y-auto">
          <pre className="m-0 font-inherit">
            {JSON.stringify(newVal, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
