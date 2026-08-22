interface Types {
  value: string;
  placeholder: string;
  name: string;
  autoComplete: string;
  required: boolean;
  rows: number;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextareaComponent({
  handleChange,
  value,
  name,
  autoComplete,
  required,
  placeholder,
  rows,
}: Types) {
  return (
    <textarea
      rows={rows}
      name={name}
      autoComplete={autoComplete}
      value={value}
      required={required}
      onChange={handleChange}
      placeholder={placeholder}
      className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
    ></textarea>
  );
}

export default TextareaComponent;
