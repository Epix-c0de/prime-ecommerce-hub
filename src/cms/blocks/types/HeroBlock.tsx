import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlockDefinition } from "../types";

interface HeroBlockProps {
  title: string;
  subtitle?: string;
  ctas?: { label: string; href: string; variant?: "default" | "outline" }[];
  media?: { type: "image" | "video"; url: string };
  alignment?: "left" | "center";
  overlay?: boolean;
}

export const HeroBlockComponent = ({
  title,
  subtitle,
  ctas = [],
  media,
  alignment = "left",
  overlay = false,
}: HeroBlockProps) => {
  return (
    <section
      className={cn(
        "relative grid gap-8 rounded-3xl border bg-card/70 p-10 shadow-lg",
        alignment === "center" ? "text-center" : "text-left"
      )}
    >
      {media?.type === "image" && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <img
            src={media.url}
            alt={subtitle ?? title}
            className="h-full w-full object-cover"
          />
          {overlay && <div className="absolute inset-0 bg-black/40" />}
        </div>
      )}
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Featured</p>
        <h1 className="text-4xl font-semibold text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="max-w-2xl text-lg text-white/90">{subtitle}</p>}
        {ctas.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-3",
              alignment === "center" ? "justify-center" : "justify-start"
            )}
          >
            {ctas.map((cta) => (
              <Button
                key={cta.label}
                variant={cta.variant ?? "default"}
                asChild
                className={cta.variant === "outline" ? "bg-white/10 text-white hover:bg-white/20" : ""}
              >
                <a href={cta.href}>{cta.label}</a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const HeroBlockDefinition: BlockDefinition<HeroBlockProps> = {
  type: "hero",
  displayName: "Hero",
  category: "hero",
  description: "Large hero section with background media and CTAs.",
  schema: {
    type: "object",
    properties: {
      title: { type: "string" },
      subtitle: { type: "string" },
      alignment: { type: "string", enum: ["left", "center"] },
      overlay: { type: "boolean" },
      media: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["image", "video"] },
          url: { type: "string" },
        },
      },
      ctas: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            href: { type: "string" },
            variant: { type: "string", enum: ["default", "outline"] },
          },
        },
      },
    },
    required: ["title"],
  },
  defaultProps: {
    title: "Enter your headline",
    subtitle: "Add supporting copy that describes the hero.",
    ctas: [
      { label: "Primary CTA", href: "#", variant: "default" },
      { label: "Secondary", href: "#", variant: "outline" },
    ],
    alignment: "left",
    overlay: true,
  },
  component: HeroBlockComponent,
};

