import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import type { SingleValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

type AddressType = "PRIMARY" | "SHIPPING";

type Props = {
  type: AddressType;
  value?: {
    country?: string;
    state?: string;
    city?: string;
  };
  disabled?: boolean;
  onChange: (data: { country?: string; state?: string; city?: string }) => void;
};

export default function LocationSelect({ onChange, value, disabled }: Props) {
  const [country, setCountry] = useState<OptionType | null>(null);
  const [state, setState] = useState<OptionType | null>(null);
  const [city, setCity] = useState<OptionType | null>(null);

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        value: c.isoCode,
        label: c.name,
      })),
    [],
  );

  useEffect(() => {
    if (!value) return;

    const selectedCountry =
      countryOptions.find((c) => c.label === value.country) ?? null;

    setCountry(selectedCountry);

    if (!selectedCountry) {
      setState(null);
      setCity(null);
      return;
    }

    const states = State.getStatesOfCountry(selectedCountry.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));

    const selectedState = states.find((s) => s.label === value.state) ?? null;

    setState(selectedState);

    if (!selectedState) {
      setCity(null);
      return;
    }

    const cities = City.getCitiesOfState(
      selectedCountry.value,
      selectedState.value,
    ).map((c) => ({
      value: c.name,
      label: c.name,
    }));

    const selectedCity = cities.find((c) => c.label === value.city) ?? null;

    setCity(selectedCity);
  }, [value, countryOptions]);

  const stateOptions = useMemo(() => {
    if (!country) return [];
    return State.getStatesOfCountry(country.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [country]);

  const cityOptions = useMemo(() => {
    if (!country || !state) return [];
    return City.getCitiesOfState(country.value, state.value).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [country, state]);

  return (
    <div className="flex flex-col gap-2">
      <Select<OptionType>
        options={countryOptions}
        isDisabled={disabled}
        value={country}
        onChange={(v: SingleValue<OptionType>) => {
          setCountry(v);
          setState(null);
          setCity(null);
          onChange({
            country: v?.label || "",
            state: "",
            city: "",
          });
        }}
        placeholder="Select Your Country"
        styles={{
          control: (base) => ({
            ...base,
            height: 50,
            borderRadius: 10,
            borderColor: "#d1d5db",
            boxShadow: "none",
            backgroundColor: "#F1F1F1",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 8,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#111827",
          }),
        }}
      />
      <Select<OptionType>
        options={stateOptions}
        value={state}
        isDisabled={!country || disabled}
        onChange={(v: SingleValue<OptionType>) => {
          setState(v);
          setCity(null);
          onChange({
            state: v?.label || "",
            city: "",
          });
        }}
        placeholder="Select Your State"
        styles={{
          control: (base) => ({
            ...base,
            height: 50,
            borderRadius: 10,
            borderColor: "#d1d5db",
            boxShadow: "none",
            backgroundColor: "#F1F1F1",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 8,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#111827",
          }),
        }}
      />
      <Select<OptionType>
        options={cityOptions}
        value={city}
        onChange={(v: SingleValue<OptionType>) => {
          setCity(v);
          onChange({
            city: v?.label || "",
          });
        }}
        isDisabled={!state || disabled}
        placeholder="Select Your City"
        styles={{
          control: (base) => ({
            ...base,
            height: 50,
            borderRadius: 10,
            borderColor: "#d1d5db",
            boxShadow: "none",
            backgroundColor: "#F1F1F1",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 8,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
            color: "#111827",
          }),
        }}
      />
    </div>
  );
}
