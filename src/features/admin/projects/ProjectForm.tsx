"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { Button, Field, Input, SectionHeading, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ActionResult, FieldErrors, ProjectView } from "@/types";
import { createProject, updateProject } from "@/actions/projects";
import {
  ADMIN_PROJECTS_HREF,
  PROJECT_CREATE_SUBMIT,
  PROJECT_EDIT_HEADING,
  PROJECT_FORM_EYEBROW,
  PROJECT_GENERIC_ERROR,
  PROJECT_NEW_HEADING,
  PROJECT_SUBMITTING_LABEL,
  PROJECT_UPDATE_SUBMIT,
} from "./config";

/** The editable fields, all held as strings for controlled inputs. */
interface ProjectFormValues {
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  /** Comma-separated technologies; split into an array on submit. */
  technologies: string;
  thumbnailUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: string;
}

/** Per-field error text keyed by field name (first message wins). */
type ProjectFieldErrors = Partial<Record<keyof ProjectFormValues, string>>;

const EMPTY_VALUES: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  problem: "",
  solution: "",
  impact: "",
  technologies: "",
  thumbnailUrl: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  order: "0",
};

/** Build initial form values from an existing project (edit mode). */
function valuesFromProject(project: ProjectView): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    problem: project.problem,
    solution: project.solution,
    impact: project.impact,
    technologies: project.technologies.join(", "),
    thumbnailUrl: project.thumbnailUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    featured: project.featured,
    order: String(project.order),
  };
}

/** Collapse Zod's `flatten().fieldErrors` into one message per visible field. */
function toFieldErrors(source: FieldErrors | undefined): ProjectFieldErrors {
  if (!source) return {};
  const next: ProjectFieldErrors = {};
  for (const key of [
    "title",
    "slug",
    "summary",
    "problem",
    "solution",
    "impact",
    "technologies",
    "thumbnailUrl",
    "githubUrl",
    "liveUrl",
    "order",
  ] as const) {
    const message = source[key]?.[0];
    if (message) next[key] = message;
  }
  return next;
}

/** Parse the comma-separated technologies string into a trimmed array. */
function parseTechnologies(input: string): string[] {
  return input
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export interface ProjectFormProps {
  /** When provided, the form edits this project; otherwise it creates one. */
  project?: ProjectView;
  className?: string;
}

/**
 * `ProjectForm` — create/edit a project in the admin CMS (Requirement 10.1,
 * 10.2, 10.4).
 *
 * A client island that calls {@link createProject} or {@link updateProject}.
 * The server action re-validates with `projectSchema` and re-checks the session
 * (Property 7), so this form mirrors the contact/login pattern: it surfaces the
 * action's structured `fieldErrors` inline (Req 10.4) and a `formError` at the
 * form level, and navigates back to the list on success.
 */
export function ProjectForm({ project, className }: ProjectFormProps) {
  const router = useRouter();
  const headingId = useId();
  const statusId = useId();
  const isEdit = project != null;

  const [values, setValues] = useState<ProjectFormValues>(
    isEdit ? valuesFromProject(project) : EMPTY_VALUES,
  );
  const [fieldErrors, setFieldErrors] = useState<ProjectFieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    const nextValue =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
    if (formError) setFormError(undefined);
    setFieldErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name as keyof ProjectFormValues];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);
    setFieldErrors({});

    const parsedOrder = Number.parseInt(values.order, 10);
    const input = {
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      problem: values.problem,
      solution: values.solution,
      impact: values.impact,
      technologies: parseTechnologies(values.technologies),
      thumbnailUrl: values.thumbnailUrl,
      githubUrl: values.githubUrl,
      liveUrl: values.liveUrl,
      featured: values.featured,
      order: Number.isNaN(parsedOrder) ? values.order : parsedOrder,
    } as Parameters<typeof createProject>[0];

    setSubmitting(true);
    try {
      const result: ActionResult<{ id: string }> = isEdit
        ? await updateProject(project.id, input)
        : await createProject(input);

      if (result.success) {
        router.push(ADMIN_PROJECTS_HREF);
        router.refresh();
        return;
      }

      if (result.fieldErrors) {
        setFieldErrors(toFieldErrors(result.fieldErrors));
      }
      if (result.formError || !result.fieldErrors) {
        setFormError(result.formError ?? PROJECT_GENERIC_ERROR);
      }
      setSubmitting(false);
    } catch {
      setFormError(PROJECT_GENERIC_ERROR);
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex w-full flex-col gap-space-6", className)}
    >
      <SectionHeading
        id={headingId}
        level={1}
        eyebrow={PROJECT_FORM_EYEBROW}
        heading={isEdit ? PROJECT_EDIT_HEADING : PROJECT_NEW_HEADING}
      />

      <form
        noValidate
        aria-describedby={statusId}
        onSubmit={handleSubmit}
        className="flex w-full max-w-2xl flex-col gap-space-4"
      >
        <Field label="Title" required error={fieldErrors.title}>
          {(control) => (
            <Input
              {...control}
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field
          label="Slug"
          required
          error={fieldErrors.slug}
          description="URL-safe identifier (lowercase, hyphens)."
        >
          {(control) => (
            <Input
              {...control}
              name="slug"
              type="text"
              placeholder="my-project"
              value={values.slug}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="Summary" required error={fieldErrors.summary}>
          {(control) => (
            <Textarea
              {...control}
              name="summary"
              rows={2}
              value={values.summary}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="Problem" required error={fieldErrors.problem}>
          {(control) => (
            <Textarea
              {...control}
              name="problem"
              rows={3}
              value={values.problem}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="Solution" required error={fieldErrors.solution}>
          {(control) => (
            <Textarea
              {...control}
              name="solution"
              rows={3}
              value={values.solution}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="Impact" required error={fieldErrors.impact}>
          {(control) => (
            <Textarea
              {...control}
              name="impact"
              rows={2}
              value={values.impact}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field
          label="Technologies"
          required
          error={fieldErrors.technologies}
          description="Comma-separated (e.g. Next.js, PostgreSQL, AWS)."
        >
          {(control) => (
            <Input
              {...control}
              name="technologies"
              type="text"
              placeholder="Next.js, PostgreSQL"
              value={values.technologies}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="Thumbnail URL" error={fieldErrors.thumbnailUrl}>
          {(control) => (
            <Input
              {...control}
              name="thumbnailUrl"
              type="url"
              placeholder="https://…"
              value={values.thumbnailUrl}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="GitHub URL" error={fieldErrors.githubUrl}>
          {(control) => (
            <Input
              {...control}
              name="githubUrl"
              type="url"
              placeholder="https://github.com/…"
              value={values.githubUrl}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field label="Live demo URL" error={fieldErrors.liveUrl}>
          {(control) => (
            <Input
              {...control}
              name="liveUrl"
              type="url"
              placeholder="https://…"
              value={values.liveUrl}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field
          label="Order"
          error={fieldErrors.order}
          description="Lower numbers appear first among featured projects."
        >
          {(control) => (
            <Input
              {...control}
              name="order"
              type="number"
              min={0}
              value={values.order}
              onChange={handleChange}
            />
          )}
        </Field>

        <label className="flex items-center gap-space-2 font-sans text-body text-text">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured}
            onChange={handleChange}
            className="h-5 w-5 rounded border-hairline bg-bg-secondary accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          Featured on homepage
        </label>

        <div id={statusId} className="min-h-[1.5rem]">
          {formError ? (
            <p
              role="alert"
              className="font-sans text-body font-medium text-red-400"
            >
              {formError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-space-2">
          <Button type="submit" variant="primary" size="lg" disabled={submitting}>
            {submitting
              ? PROJECT_SUBMITTING_LABEL
              : isEdit
                ? PROJECT_UPDATE_SUBMIT
                : PROJECT_CREATE_SUBMIT}
          </Button>
          <Button href={ADMIN_PROJECTS_HREF} variant="ghost" size="lg">
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}
