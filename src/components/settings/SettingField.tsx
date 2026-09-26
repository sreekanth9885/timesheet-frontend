interface Props {
  label: string;
  help: string;
  placeholder: string;
  value: string;
  fullWidth?: boolean;
  onChange: (value: string) => void;
}

export function SettingField({
  label,
  help,
  placeholder,
  value,
  fullWidth,
  onChange,
}: Props) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          fullWidth ? "max-w-[250px] w-full" : "w-full"
        }`}
      />
      <div className="text-xs text-gray-500 mt-1">{help}</div>
    </div>
  );
}
