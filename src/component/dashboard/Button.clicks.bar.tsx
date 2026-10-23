import { motion } from "framer-motion";
import { useSearchParams } from "react-router";
import { colors } from "../../utils/link.colors";
import { useGetPlusibleDataQuery } from "../../redux/features/partner/partnerApi";
import SelectComponent from "../ui/Select.component";
import ButtonClicksLoader from "../loader/Button.click.loader";

interface Props {
  lander: string;
}

function ButtonClicksBar({ lander }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get("button_period") || "";
  const { data, isLoading, isFetching } = useGetPlusibleDataQuery({
    landername: lander,
    period: period || "7d",
  });

  const buttonClicks = data?.events?.buttonClicks || [];

  const maxEvents = Math.max(
    ...buttonClicks.map((item: { events: number }) => item.events),
    100,
  );
  const calculateWidth = (events: number) => (events / maxEvents) * 100;

  const totalClicks = buttonClicks.reduce(
    (sum: number, item: { events: number }) => sum + item.events,
    0,
  );

  // decide what to render
  let content;
  if (isLoading || isFetching) {
    content = <ButtonClicksLoader />;
  }
  if (!isLoading && !isFetching) {
    content = buttonClicks?.map(
      (item: { events: number; buttonName: string }, index: number) => {
        const colorObj = colors.find((c) => c.label === item.buttonName);
        const barColor = colorObj?.color;
        return (
          <div key={index} className="flex gap-5 items-center">
            <h3 className="min-w-fit">{item.buttonName}</h3>
            <div className="bg-gray-200 w-full h-5 rounded-full relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculateWidth(item.events)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  backgroundColor: barColor,
                }}
                className="absolute top-0 left-0 h-full rounded-full"
              ></motion.div>
              <p className="text-black absolute top-0.75 h-full right-2 text-xs">
                {item.events} Clicks
              </p>
            </div>
          </div>
        );
      },
    );
  }

  return (
    <section className="mt-3 md:mt-5">
      <div className="bg-white p-5 md:p-10 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-5 border-b border-gray-200 pb-5">
          <p className="text-gray-500 mb-4 text-sm md:text-base">
            Last {period === "" ? "7d" : period} Button Clicks Overview
          </p>
          <div className="w-full md:w-40 md:min-w-40">
            <SelectComponent
              value={period}
              label="Period"
              handleChange={(value: string) => {
                if (value) {
                  searchParams.set("button_period", value);
                } else {
                  searchParams.delete("button_period");
                }
                setSearchParams(searchParams);
              }}
              datas={[
                { key: "7 Days", value: "7d" },
                { key: "30 Days", value: "30d" },
              ]}
              color="#F3F3F3"
            />
          </div>
        </div>
        <h2 className="text-black text-lg md:text-3xl font-medium">
          Total Clicks: {totalClicks}
        </h2>
        <div className="mt-10 flex flex-col gap-5">{content}</div>
      </div>
    </section>
  );
}

export default ButtonClicksBar;
