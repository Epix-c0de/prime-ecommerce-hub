import { BlockDefinition } from "../types";

interface RichTextBlockProps {
  content: string;
}

export const RichTextBlockComponent = ({ content }: RichTextBlockProps) => {
  return (
    <section className="prose max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

export const RichTextBlockDefinition: BlockDefinition<RichTextBlockProps> = {
  type: "richText",
  displayName: "Rich Text",
  category: "content",
  description: "Formatted paragraphs, headings, and inline media.",
  schema: {
    type: "object",
    properties: {
      content: { type: "string" },
    },
    required: ["content"],
  },
  defaultProps: {
    content:
      "<h2>Tell your story</h2><p>Add paragraphs, lists, and inline images to describe the section.</p>",
  },
  component: RichTextBlockComponent,
};

