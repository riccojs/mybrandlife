interface Types {
  placeholder: string;
  name: string;
  autoComplete: string;
  color: string;
  required: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

function SearchComponent({
  handleChange,
  placeholder,
  name,
  autoComplete,
  required,
  color,
  value,
}: Types) {
  return (
    <div
      tabIndex={0}
      style={{ backgroundColor: `${color}` }}
      className="border border-gray-300 focus-within:border-[#96c94b] focus-within:border p-3 flex gap-2 items-center justify-between w-full text-center rounded-xl text-normal"
    >
      <i className="fa-solid fa-magnifying-glass"></i>
      <input
        type="search"
        name={name}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
        className="text-normal text-base w-full outline-none"
      />
    </div>
  );
}

export default SearchComponent;
