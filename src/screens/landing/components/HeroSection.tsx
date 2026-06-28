import { ArrowRight, FileText, UploadCloud } from "lucide-react";
import { LinkButton } from "@/components/shared/Button";
import { ROUTES } from "@/constants/routes";
import { ProductMockup } from "./ProductMockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas px-4 pb-12 pt-14 text-ink sm:px-6 lg:px-8 lg:pb-14 lg:pt-20">
      <div className="relative mx-auto max-w-[88rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.58fr)] lg:items-end">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm text-muted shadow-[0_1px_0_oklch(0.13_0.006_260_/_0.04)]">
              <FileText className="h-4 w-4 text-ink" />
              Source-bound document chat
            </div>
            <h1 className="max-w-6xl text-balance text-6xl font-semibold leading-[0.9] tracking-normal text-ink sm:text-7xl lg:text-[6.8rem]">
              Ask the file. Keep the proof in view.
            </h1>
          </div>
          <div className="max-w-md lg:justify-self-end lg:pb-2">
            <p className="text-pretty text-lg leading-8 text-muted">
              Doc Explain turns long files into focused conversations. If the
              answer is in the document, it shows up clearly. If it is not, the
              chat says so.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col xl:flex-row xl:flex-nowrap">
              <LinkButton
                className="w-full sm:w-auto"
                href={ROUTES.signup}
                showArrow
                size="lg"
                variant="secondary"
              >
                Create account
              </LinkButton>
              <LinkButton
                className="w-full sm:w-auto"
                href={ROUTES.dashboard}
                size="lg"
                variant="secondary"
              >
                <UploadCloud className="h-4 w-4" />
                Open dashboard
              </LinkButton>
            </div>
          </div>
        </div>

        <ProductMockup />

        <div className="mx-auto mt-7 grid max-w-6xl gap-4 border-y border-line py-5 text-sm text-muted sm:grid-cols-3">
          {[
            ["Upload", "Start from a PDF, Word file, image, or note."],
            ["Index live", "See when the document is ready without refreshing."],
            ["Ask again", "Return to the same conversation history."],
          ].map(([title, body]) => (
            <div className="flex items-start gap-3" key={title}>
              <ArrowRight className="h-4 w-4 text-ink/50" />
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-1 leading-6">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
