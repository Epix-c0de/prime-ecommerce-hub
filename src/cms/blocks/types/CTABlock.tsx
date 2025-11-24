import { BlockDefinition } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTABlockProps {
  label: string;
  description?: string;
  actions?: { label: string; href: string; variant?: "default" | "outline" }[];
  align?: "left" | "center";
}

const CTABlockComponent = ({ label, description, actions = [], align = "center" }: CTABlockProps) => {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-card/60 p-8 shadow-md",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      <h3 className="text-2xl font-semibold">{label}</h3>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      {actions.length > 0 && (
        <div
          className={cn(
            "mt-5 flex flex-wrap gap-3",
            align === "center" ? "justify-center" : "justify-start"
          )}
        >
          {actions.map((action) => (
            <Button key={action.label} asChild variant={action.variant ?? "default"}>
              <a href={action.href}>{action.label}</a>
            </Button>
          ))}
        </div>
      )}
    </section>
  );
};

export const CTABlockDefinition: BlockDefinition<CTABlockProps> = {
  type: "cta",
  displayName: "CTA Strip",
  category: "cta",
  description: "Call-to-action section with buttons.",
  schema: {
    type: "object",
    properties: {
      label: { type: "string" },
      description: { type: "string" },
      align: { type: "string", enum: ["left", "center"] },
      actions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            label: { type: "string" },
            href: { type: "string" },
            variant: { type: "string", enum: ["default", "outline"] },
          },
          required: ["label", "href"],
        },
      },
    },
    required: ["label"],
  },
  defaultProps: {
    label: "Ready to launch?",
    description: "Bring personalized shopping to your customers today.",
    actions: [
      { label: "Book a demo", href: "/demo" },
      { label: "Talk to sales", href: "/contact", variant: "outline" },
    ],
    align: "center",
  },
  component: CTABlockComponent,
};

