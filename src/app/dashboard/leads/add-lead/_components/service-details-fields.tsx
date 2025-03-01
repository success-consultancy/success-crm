import React from "react";
import { FormField } from "@/components/ui/form";
import { LeadSchemaType } from "@/schemas/lead-schema";
import { useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TinyEditor from "@/components/common/text-editor";
import SelectCommon from "@/components/common/select-common";

const ServiceDetailsStep = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<LeadSchemaType>();
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="serviceType"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Service Type"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Location"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="source"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Source"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
      </div>
      <div className="flex items-center gap-5">
        <FormField
          control={control}
          name="assignedTo"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Assigned to"
              placeholder="Select a assignee"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <SelectCommon
              options={[
                { value: "Light", label: "Light" },
                { value: "Dark", label: "Dark" },
              ]}
              value={field.value}
              label="Status"
              onSelect={(val) => field.onChange(val)}
            />
          )}
        />
      </div>
      <div className="w-full space-y-5" suppressHydrationWarning>
        <Label className="text-b3-b font-semibold">Note</Label>

        <TinyEditor />
      </div>
    </div>
  );
};

export default ServiceDetailsStep;

