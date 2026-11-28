import { useRef } from "react";
import { FileText, FolderPlus, Info, Upload, X } from "lucide-react";
import { ASSET_CATEGORIES, formatBytes, uid } from "../../../utils/onboard.data";
import type { StepProps } from "../../../utils/onboard.types";
import { Callout, ChoiceCard, FormField, SubHeading, TextArea } from "../Onboard.ui";

function StepAssets({ data, update, errors }: StepProps) {
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const addFiles = (category: string, files: FileList | null) => {
    if (!files?.length) return;
    const added = Array.from(files).map((f) => ({ id: uid(), category, name: f.name, size: f.size }));
    update({ assetFiles: [...data.assetFiles, ...added] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SubHeading title="Asset workspace" description="Where your brand files will live during setup." />
        <div role="radiogroup" aria-label="Asset workspace">
          <ChoiceCard
            selected={data.createWorkspace}
            onClick={() => update({ createWorkspace: !data.createWorkspace })}
            icon={<FolderPlus className="size-4 text-[#4331d2]" />}
            title="Create a workspace"
            description="BPS creates a workspace for your brand assets during setup and adds the files you upload here."
          />
        </div>
        {errors.createWorkspace && <p role="alert" className="text-xs text-[#E53F41]">{errors.createWorkspace}</p>}
      </div>

      <div className="space-y-3">
        <SubHeading title="Upload brand assets" description="Optional now — you can add more files after your workspace is ready." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ASSET_CATEGORIES.map((cat) => {
            const files = data.assetFiles.filter((f) => f.category === cat.id);
            return (
              <div key={cat.id} className="flex flex-col rounded-xl border border-[#E4E8F3] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold text-[#171a29]">{cat.label}</span>
                  <span className="rounded-full bg-[#F5F7FE] px-2 py-0.5 text-[11px] font-semibold text-[#5e6375]">{files.length}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {files.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 rounded-md bg-[#F8FAFF] px-2 py-1.5 text-[12px] text-[#3b4460]">
                      <FileText className="size-3.5 shrink-0 text-[#4331d2]" />
                      <span className="min-w-0 flex-1 truncate" title={f.name}>{f.name}</span>
                      <span className="shrink-0 text-[#9aa1b5]">{formatBytes(f.size)}</span>
                      <button type="button" aria-label={`Remove ${f.name}`} onClick={() => update({ assetFiles: data.assetFiles.filter((x) => x.id !== f.id) })} className="shrink-0 cursor-pointer text-[#9aa1b5] hover:text-[#E53F41]">
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <input ref={(el) => { inputs.current[cat.id] = el; }} type="file" multiple accept={cat.accept} className="hidden" aria-label={`Upload ${cat.label}`} onChange={(e) => { addFiles(cat.id, e.target.files); e.target.value = ""; }} />
                <button type="button" onClick={() => inputs.current[cat.id]?.click()} className="mt-2 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#4331d2]/40 text-[13px] font-semibold text-[#4331d2] hover:bg-[#F3F1FF]">
                  <Upload className="size-4" /> Add files
                </button>
              </div>
            );
          })}
        </div>
        <Callout icon={<Info className="size-4" />}>
          <strong>Demo mode:</strong> only file names are recorded. In production, files are added to your workspace.
        </Callout>
      </div>

      <FormField label="Notes about your assets" htmlFor="assetNotes" hint="Optional">
        <TextArea id="assetNotes" className="min-h-20" value={data.assetNotes} placeholder="Logo usage rules, brand colors, fonts, photos coming soon…" onChange={(e) => update({ assetNotes: e.target.value })} />
      </FormField>
    </div>
  );
}

export default StepAssets;
