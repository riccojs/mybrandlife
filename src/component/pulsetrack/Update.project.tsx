import { useGetOnePulsetrackQuery } from "../../redux/features/pulsetrack/pulsetrackApi";
import useBodyScroll from "../../hook/userBodyscroll";
import ProjectFrom from "./Project.from";

interface Type {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

function UpdateProject({ isOpen, onClose, id }: Type) {
  useBodyScroll(isOpen);

  const { data, isFetching, isLoading } = useGetOnePulsetrackQuery(id);

  //   decide what to render
  let content;
  if (isFetching || isLoading) {
    content = (
      <div className="flex items-center justify-center min-h-68">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#96c94b] border-solid"></div>
      </div>
    );
  }
  if (!isFetching && !isLoading && data?.pulsetrack) {
    content = (
      <ProjectFrom data={data} id={data?.pulsetrack?.id} onClose={onClose} />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden ${
          isOpen ? "zoom-animation" : ""
        }`}
      >
        <div className="relative w-full max-w-full rounded-xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Update your project
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to update your project.
          </p>
          {content}
        </div>
      </div>
    </div>
  );
}

export default UpdateProject;
