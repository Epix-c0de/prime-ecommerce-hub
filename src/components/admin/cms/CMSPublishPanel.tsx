import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCMS } from "@/cms/state/CmsContext";
import type { Page } from "@/cms/types/page";

interface CMSPublishPanelProps {
  page: Page;
}

export const CMSPublishPanel = ({ page }: CMSPublishPanelProps) => {
  const { updateStatus } = useCMS();
  const [scheduleDate, setScheduleDate] = useState("");

  const handlePublish = async () => {
    await updateStatus(page.id, "published");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4">
        <h4 className="font-semibold">Current status</h4>
        <p className="text-sm text-muted-foreground">
          {page.status} • last updated {new Date(page.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="schedule">Schedule publish (optional)</Label>
        <Input
          id="schedule"
          type="datetime-local"
          value={scheduleDate}
          onChange={(event) => setScheduleDate(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Scheduling will mark the page as scheduled. A worker job will publish at the chosen time when backend
          sync is available.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handlePublish}>Publish now</Button>
        <Button variant="secondary">Save draft</Button>
      </div>
    </div>
  );
};

