interface Types {
  type: string;
  value: string;
  placeholder: string;
  name: string;
  autoComplete: string;
  required: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputComponent({
  type,
  value,
  handleChange,
  placeholder,
  name,
  autoComplete,
  required,
}: Types) {
  return (
    <input
      type={`${type}`}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      name={name}
      required={required}
      autoComplete={autoComplete}
      className="bg-[#F3F3F3] border border-gray-300 focus:outline focus:outline-[#96c94b] focus:border py-3 px-3 w-full rounded-xl text-normal"
    />
  );
}

export default InputComponent;
