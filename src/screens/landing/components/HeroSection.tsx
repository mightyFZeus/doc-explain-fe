import { FileText, MessagesSquare, UploadCloud } from "lucide-react";
import { LinkButton } from "@/components/shared/Button";
import { ROUTES } from "@/constants/routes";
import { ProductMockup } from "./ProductMockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink px-4 pb-10 pt-14 text-inverse sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(oklch(0.985_0.004_260_/_0.22)_1px,transparent_1px),linear-gradient(90deg,oklch(0.985_0.004_260_/_0.22)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end xl:grid-cols-[minmax(0,1fr)_470px]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-inverse/20 bg-inverse/10 px-4 py-2 text-sm text-inverse/75">
              <FileText className="h-4 w-4 text-inverse" />
              Grounded answers from the document in front of you
            </div>
            <h1 className="max-w-5xl text-balance text-6xl font-semibold leading-[0.9] tracking-normal text-inverse sm:text-7xl lg:text-8xl">
              Ask the file. Keep the source.
            </h1>
          </div>
          <div className="max-w-md lg:justify-self-end">
            <p className="text-pretty text-lg leading-8 text-inverse/72">
              Doc Explain turns long PDFs, contracts, notes, and images into a
              focused workspace where every answer stays tied to the uploaded
              document.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col xl:flex-row xl:flex-nowrap">
              <LinkButton
                className="w-full sm:w-auto"
                href={ROUTES.signup}
                showArrow
                size="lg"
                variant="inverse"
              >
                Start with a document
              </LinkButton>
              <LinkButton
                className="w-full border-inverse/25 text-inverse hover:bg-inverse/10 sm:w-auto"
                href={ROUTES.dashboard}
                size="lg"
                variant="ghost"
              >
                <UploadCloud className="h-4 w-4" />
                Open dashboard
              </LinkButton>
            </div>
          </div>
        </div>

        <ProductMockup />

        <div className="mt-8 grid gap-3 text-sm text-inverse/68 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-inverse/20" />
            Upload
          </div>
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-inverse/20" />
            Classify
          </div>
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4 text-inverse/80" />
            Continue the conversation
          </div>
        </div>
      </div>
    </section>
  );
}
