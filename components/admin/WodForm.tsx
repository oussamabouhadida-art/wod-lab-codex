"use client";

import * as Tabs from "@radix-ui/react-tabs";
import slugify from "slugify";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { componentOptions, objectiveOptions, WodObjective, wodTypeOptions, WodType, Wod } from "@/lib/utils/wod-types";
import { upsertWod } from "@/lib/actions/wod.actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function WodForm({ locale, wod }: { locale: string; wod?: Wod }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState("content");

  const [form, setForm] = useState({
    title_en: wod?.title_en ?? "",
    title_fr: wod?.title_fr ?? "",
    title_es: wod?.title_es ?? "",
    description_en: wod?.description_en ?? "",
    description_fr: wod?.description_fr ?? "",
    description_es: wod?.description_es ?? "",
    content_en: wod?.content_en ?? "",
    content_fr: wod?.content_fr ?? "",
    content_es: wod?.content_es ?? "",
    wod_type: (wod?.wod_type ?? "for_time") as WodType,
    objective: (wod?.objective ?? "strength") as WodObjective,
    components: [] as string[],
    is_published: wod?.is_published ?? false,
    published_at: wod?.published_at ? wod.published_at.slice(0, 16) : "",
  });

  function submit(isPublished: boolean) {
    startTransition(async () => {
      const baseTitle = form.title_en || "untitled-wod";
      const slug = slugify(baseTitle, { lower: true, strict: true });

      await upsertWod({
        id: wod?.id,
        slug,
        title_en: form.title_en,
        title_fr: form.title_fr,
        title_es: form.title_es,
        description_en: form.description_en,
        description_fr: form.description_fr,
        description_es: form.description_es,
        content_en: form.content_en,
        content_fr: form.content_fr,
        content_es: form.content_es,
        wod_type: form.wod_type,
        objective: form.objective,
        components: form.components,
        is_published: isPublished,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : undefined,
      });

      router.push(`/${locale}/admin`);
    });
  }

  return (
    <Tabs.Root value={active} onValueChange={setActive} className="space-y-4">
      <Tabs.List className="grid grid-cols-2 gap-2 rounded-[4px] border border-divider bg-surface-1 p-2 sm:grid-cols-5">
        <Tabs.Trigger className="rounded bg-surface-2 px-2 py-1 text-xs" value="content">Content</Tabs.Trigger>
        <Tabs.Trigger className="rounded bg-surface-2 px-2 py-1 text-xs" value="classification">Classification</Tabs.Trigger>
        <Tabs.Trigger className="rounded bg-surface-2 px-2 py-1 text-xs" value="images">Images</Tabs.Trigger>
        <Tabs.Trigger className="rounded bg-surface-2 px-2 py-1 text-xs" value="performance">Performance</Tabs.Trigger>
        <Tabs.Trigger className="rounded bg-surface-2 px-2 py-1 text-xs" value="publish">Publish</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="content" className="space-y-3">
        <Input placeholder="Title EN" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <Input placeholder="Title FR" value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} />
        <Input placeholder="Title ES" value={form.title_es} onChange={(e) => setForm({ ...form, title_es: e.target.value })} />
        <Textarea rows={4} placeholder="Description EN" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
        <Textarea rows={6} placeholder="Content EN" value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} />
        <Textarea rows={6} placeholder="Content FR" value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} />
        <Textarea rows={6} placeholder="Content ES" value={form.content_es} onChange={(e) => setForm({ ...form, content_es: e.target.value })} />
      </Tabs.Content>

      <Tabs.Content value="classification" className="space-y-3">
        <Select
          value={form.wod_type}
          onValueChange={(wod_type) => setForm({ ...form, wod_type: wod_type as WodType })}
          placeholder="Type"
          options={wodTypeOptions.map((v) => ({ label: v, value: v }))}
        />
        <Select
          value={form.objective}
          onValueChange={(objective) => setForm({ ...form, objective: objective as WodObjective })}
          placeholder="Objective"
          options={objectiveOptions.map((v) => ({ label: v, value: v }))}
        />
        <div className="grid grid-cols-3 gap-2">
          {componentOptions.map((item) => {
            const checked = form.components.includes(item);
            return (
              <label key={item} className="flex items-center gap-2 rounded-[4px] border border-divider bg-surface-2 p-2 text-xs uppercase">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      components: e.target.checked ? [...form.components, item] : form.components.filter((c) => c !== item),
                    })
                  }
                />
                {item}
              </label>
            );
          })}
        </div>
      </Tabs.Content>

      <Tabs.Content value="images">
        <ImageUploader wodId={wod?.id} />
      </Tabs.Content>

      <Tabs.Content value="performance" className="rounded-[4px] border border-divider bg-surface-1 p-4 text-sm text-muted">
        KPI fields are available in DB and can be added quickly from this form in the next pass.
      </Tabs.Content>

      <Tabs.Content value="publish" className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published
        </label>
        <Input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
      </Tabs.Content>

      <div className="flex gap-2 pt-3">
        <Button variant="muted" disabled={pending} onClick={() => submit(false)}>Save as Draft</Button>
        <Button disabled={pending} onClick={() => submit(true)}>Publish</Button>
      </div>
    </Tabs.Root>
  );
}
