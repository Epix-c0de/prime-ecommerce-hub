import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FooterConfig, FooterBackgroundType, FooterAnimationStyle, FooterSection, defaultFooterConfig } from "@/config/footerConfig";
import { useConfig } from "@/contexts/ConfigContext";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const animationOptions: { label: string; value: FooterAnimationStyle }[] = [
  { label: "None", value: "none" },
  { label: "Soft Pulse", value: "pulse" },
  { label: "Floating Panels", value: "float" },
  { label: "Gradient Shift", value: "gradient" },
];

const backgroundOptions: { label: string; value: FooterBackgroundType }[] = [
  { label: "Solid Color", value: "solid" },
  { label: "Gradient", value: "gradient" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

export const FooterDesigner = () => {
  const { footerConfig, updateFooterConfig } = useConfig();
  const [draft, setDraft] = useState<FooterConfig>(footerConfig);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(footerConfig);
  }, [footerConfig]);

  const handleChange = <K extends keyof FooterConfig>(key: K, value: FooterConfig[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSectionUpdate = (sectionId: string, update: Partial<FooterSection>) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, ...update } : section
      ),
    }));
  };

  const handleSectionLinkChange = (
    sectionId: string,
    index: number,
    field: "label" | "href",
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const links = section.links.map((link, linkIndex) =>
          linkIndex === index ? { ...link, [field]: value } : link
        );
        return { ...section, links };
      }),
    }));
  };

  const addSectionLink = (sectionId: string) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, links: [...section.links, { label: "New Link", href: "/" }] }
          : section
      ),
    }));
  };

  const removeSectionLink = (sectionId: string, index: number) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const links = section.links.filter((_, i) => i !== index);
        return { ...section, links };
      }),
    }));
  };

  const handleSocialLinkChange = (index: number, field: "label" | "href", value: string) => {
    setDraft((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addSocialLink = () => {
    setDraft((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: "New Channel", href: "https://example.com" }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, linkIndex) => linkIndex !== index),
    }));
  };

  const handleMediaUpload = (type: "image" | "video", file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (type === "image") {
          setDraft((prev) => ({ ...prev, backgroundType: "image", backgroundImage: reader.result as string }));
        } else {
          setDraft((prev) => ({ ...prev, backgroundType: "video", backgroundVideo: reader.result as string }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateFooterConfig(draft);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Footer customization saved");
    }, 400);
  };

  const handleReset = () => {
    setDraft(defaultFooterConfig);
    updateFooterConfig(defaultFooterConfig);
    toast.success("Footer reset to default");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Footer Animator</h2>
          <p className="text-muted-foreground">
            Build cinematic footers with live colors, typography, motion, and media.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Background & Colors</CardTitle>
            <CardDescription>Control brand colors, gradients, and media layers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Background Type</Label>
                <Select
                  value={draft.backgroundType}
                  onValueChange={(value: FooterBackgroundType) =>
                    handleChange("backgroundType", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Accent Color</Label>
                <Input
                  type="color"
                  value={draft.accentColor}
                  onChange={(e) => handleChange("accentColor", e.target.value)}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
            </div>

            {draft.backgroundType === "solid" && (
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={draft.backgroundColor}
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
            )}

            {draft.backgroundType === "gradient" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Gradient Start</Label>
                  <Input
                    type="color"
                    value={draft.gradientColors[0]}
                    onChange={(e) =>
                      handleChange("gradientColors", [e.target.value, draft.gradientColors[1]])
                    }
                    className="mt-1 h-10 cursor-pointer"
                  />
                </div>
                <div>
                  <Label>Gradient End</Label>
                  <Input
                    type="color"
                    value={draft.gradientColors[1]}
                    onChange={(e) =>
                      handleChange("gradientColors", [draft.gradientColors[0], e.target.value])
                    }
                    className="mt-1 h-10 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {draft.backgroundType === "image" && (
              <div className="space-y-2">
                <Label>Background Image</Label>
                <Input
                  placeholder="https://cdn.primehub/footer-bg.jpg"
                  value={draft.backgroundImage ?? ""}
                  onChange={(e) => handleChange("backgroundImage", e.target.value)}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMediaUpload("image", e.target.files?.[0])}
                />
              </div>
            )}

            {draft.backgroundType === "video" && (
              <div className="space-y-2">
                <Label>Background Video URL</Label>
                <Input
                  placeholder="https://cdn.primehub/footer.mp4"
                  value={draft.backgroundVideo ?? ""}
                  onChange={(e) => handleChange("backgroundVideo", e.target.value)}
                />
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleMediaUpload("video", e.target.files?.[0])}
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={draft.textColor}
                  onChange={(e) => handleChange("textColor", e.target.value)}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
              <div>
                <Label>Overlay Color</Label>
                <Input
                  type="color"
                  value={draft.overlayColor}
                  onChange={(e) => handleChange("overlayColor", e.target.value)}
                  className="mt-1 h-10 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label className="flex justify-between text-sm">
                Overlay Intensity
                <span className="text-muted-foreground">
                  {(draft.overlayOpacity * 100).toFixed(0)}%
                </span>
              </Label>
              <Slider
                className="mt-3"
                max={100}
                value={[draft.overlayOpacity * 100]}
                onValueChange={(value) => handleChange("overlayOpacity", value[0] / 100)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Typography & Motion</CardTitle>
            <CardDescription>Stagger fonts, marquee text, and hero animations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Heading Font</Label>
                <Input
                  value={draft.headingFont}
                  onChange={(e) => handleChange("headingFont", e.target.value)}
                  placeholder="Space Grotesk, sans-serif"
                />
              </div>
              <div>
                <Label>Body Font</Label>
                <Input
                  value={draft.bodyFont}
                  onChange={(e) => handleChange("bodyFont", e.target.value)}
                  placeholder="Inter, sans-serif"
                />
              </div>
            </div>

            <div>
              <Label>Animation Style</Label>
              <Select
                value={draft.animationStyle}
                onValueChange={(value: FooterAnimationStyle) => handleChange("animationStyle", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {animationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Marquee Spotlight</Label>
                <p className="text-xs text-muted-foreground">Slide breaking news across the footer.</p>
              </div>
              <Switch
                checked={draft.enableMarquee}
                onCheckedChange={(checked) => handleChange("enableMarquee", checked)}
              />
            </div>

            {draft.enableMarquee && (
              <div>
                <Label>Marquee Text</Label>
                <Textarea
                  className="mt-1"
                  value={draft.marqueeText}
                  onChange={(e) => handleChange("marqueeText", e.target.value)}
                  placeholder="Prime Enterprises Kimahuri — New drops every Friday..."
                />
              </div>
            )}

            <div>
              <Label>Footer Note</Label>
              <Input
                className="mt-1"
                value={draft.footerNote}
                onChange={(e) => handleChange("footerNote", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Builder</CardTitle>
          <CardDescription>Control section titles, links, and descriptions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {draft.sections.map((section) => (
              <div key={section.id} className="rounded-xl border p-4">
                <div className="space-y-3">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      className="mt-1"
                      value={section.title}
                      onChange={(e) => handleSectionUpdate(section.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Textarea
                      className="mt-1"
                      value={section.description ?? ""}
                      onChange={(e) =>
                        handleSectionUpdate(section.id, { description: e.target.value })
                      }
                      placeholder="Short helper copy"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Links
                  </Label>
                  {section.links.map((link, index) => (
                    <div key={`${section.id}-link-${index}`} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            handleSectionLinkChange(section.id, index, "label", e.target.value)
                          }
                          placeholder="Link label"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSectionLink(section.id, index)}
                          disabled={section.links.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        className="mt-2"
                        value={link.href}
                        onChange={(e) =>
                          handleSectionLinkChange(section.id, index, "href", e.target.value)
                        }
                        placeholder="https://"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => addSectionLink(section.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Social Buttons</CardTitle>
                <CardDescription>Control the quick links at the base of the footer.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={addSocialLink}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {draft.socialLinks.map((link, index) => (
                <div key={`social-${index}`} className="rounded-lg border p-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) => handleSocialLinkChange(index, "label", e.target.value)}
                      placeholder="Channel Name"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      disabled={draft.socialLinks.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={link.href}
                    onChange={(e) => handleSocialLinkChange(index, "href", e.target.value)}
                    placeholder="https://"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterDesigner;

