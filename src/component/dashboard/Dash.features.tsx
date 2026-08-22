import { useAuth } from "../../hook/useAuth";
import domainFeatures from "../../utils/domain.features";

interface AuthType {
  user: ItemType | null;
}

interface ItemType {
  planKey: string;
}

function DashFeatures() {
  const { user } = useAuth() as AuthType;
  const { planKey } = user || {};

  const features =
    planKey && planKey in domainFeatures
      ? domainFeatures[planKey as keyof typeof domainFeatures]
      : [];

  return (
    <div className="border border-gray-200 p-8 rounded-md bg-white">
      <div className="flex gap-2 flex-col">
        <h3 className="text-3xl font-medium text-black">
          Your selected plan includes the following features:
        </h3>

        <ul className="mt-4 flex flex-col gap-2">
          {features.map((item: { label: string }, index: number) => (
            <li key={index} className="flex items-start gap-2 text-black">
              <i className="fa-solid fa-check text-[#22c55e] mt-1"></i>
              <span className="text-md font-normal">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashFeatures;
