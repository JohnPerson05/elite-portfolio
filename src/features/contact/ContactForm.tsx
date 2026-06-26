"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { FadeUp } from "@/components/motion";
import {
  Button,
  Field,
  Input,
  SectionHeading,
  Textarea,
  useToast,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { submitContact } from "@/actions/contact";
import { HONEYPOT_FIELD, contactSchema } from "@/lib/validation/contact";
import {
  CONTACT_DESCRIPTION,
  CONTACT_EYEBROW,
  CONTACT_GENERIC_ERROR,
  CONTACT_HEADING,
  CONTACT_SUBMIT_LABEL,
  CONTACT_SUBMITTING_LABEL,
  CONTACT_SUCCESS_MESSAGE,
} from "./config";

/** The visible, human-facing fields of the contact form. */
interface ContactValues {
  name: string;
  email: string;
  company: string;
  message: string;
}

/** Per-field error text keyed by field name (first message wins). */
type ContactFieldErrors = Partial<Record<keyof ContactValues, string>>;

const EMPTY_VALUES: ContactValues = {
  name: "",
  email: "",
  company: "",
  message: "",
};

/**
 * Collapse Zod's `flatten().fieldErrors` (arrays per key) into a single message
 * per visible field, ready for the {@link Field} `error` prop. The honeypot is
 * intentionally ignored — humans never fill it, and its failure is handled
 * server-side as spam (Req 8.7).
 */
function toFieldErrors(
  source: Record<string, string[] | undefined> | undefined,
): ContactFieldErrors {
  if (!source) return {};
  const next: ContactFieldErrors = {};
  for (const key of ["name", "email", "company", "message"] as const) {
    const message = source[key]?.[0];
    if (message) {
      next[key] = message;
    }
  }
  return next;
}

export interface ContactFormProps {
  /** Eyebrow label above the heading. */
  eyebrow?: string;
  /** Section heading text. */
  heading?: string;
  /** Supporting copy beneath the heading. */
  description?: string;
  className?: string;
}

/**
 * `ContactForm` — the homepage contact section (Requirement 8).
 *
 * A client component with Name, Email, Company (optional), and Message fields
 * plus a hidden honeypot ({@link HONEYPOT_FIELD}) for anti-abuse (Req 8.1,
 * 8.7). On submit it validates client-side against {@link contactSchema} so
 * invalid input surfaces inline field errors WITHOUT hitting the server persist
 * path (Req 8.3 / Property 4 at the form layer); only valid input calls the
 * {@link submitContact} Server Action.
 *
 * Result handling mirrors the design's contact sequence:
 * - success (`{ success: true }`): show a confirmation + reset the form
 *   (Req 8.4), with a polite success toast.
 * - server failure (`{ success: false, formError }`): show the error message
 *   and PRESERVE the user's entered data (Req 8.5); also surface any
 *   server-returned `fieldErrors` inline.
 *
 * Accessibility: rendered as a labelled `<section>` landmark; every control is
 * wired through {@link Field} (`<label>` + `aria-invalid`/`aria-describedby`),
 * keyboard operable with a visible focus ring. `noValidate` defers validation
 * to Zod so the messaging is consistent across browsers and assistive tech.
 */
export function ContactForm({
  eyebrow = CONTACT_EYEBROW,
  heading = CONTACT_HEADING,
  description = CONTACT_DESCRIPTION,
  className,
}: ContactFormProps) {
  const toast = useToast();
  const headingId = useId();
  const honeypotId = useId();
  const statusId = useId();

  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [succeeded, setSucceeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // Clear stale form-level feedback as soon as the visitor edits anything.
    if (formError) setFormError(undefined);
    if (succeeded) setSucceeded(false);
    setFieldErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name as keyof ContactValues];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);
    setSucceeded(false);

    // Client-side gate (Req 8.3 / Property 4): invalid input is rejected here,
    // so the persist path (submitContact) is never reached.
    const parsed = contactSchema.safeParse({
      name: values.name,
      email: values.email,
      company: values.company,
      message: values.message,
      [HONEYPOT_FIELD]: honeypot,
    });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error.flatten().fieldErrors));
      return;
    }
    setFieldErrors({});

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("company", values.company);
    formData.set("message", values.message);
    formData.set(HONEYPOT_FIELD, honeypot);

    setSubmitting(true);
    try {
      const result = await submitContact(formData);

      if (result.success) {
        // Confirmation + reset (Req 8.4).
        setValues(EMPTY_VALUES);
        setHoneypot("");
        setFieldErrors({});
        setFormError(undefined);
        setSucceeded(true);
        toast.show({ variant: "success", message: CONTACT_SUCCESS_MESSAGE });
        return;
      }

      // Failure: preserve entered data (Req 8.5). Surface any server field
      // errors inline, and a form-level message + toast.
      if (result.fieldErrors) {
        setFieldErrors(toFieldErrors(result.fieldErrors));
      }
      const message = result.formError ?? CONTACT_GENERIC_ERROR;
      setFormError(message);
      toast.show({ variant: "error", message });
    } catch {
      // Network/unexpected client-side failure: keep data, show a message.
      setFormError(CONTACT_GENERIC_ERROR);
      toast.show({ variant: "error", message: CONTACT_GENERIC_ERROR });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby={headingId}
      className={cn("w-full px-space-2 py-section sm:px-space-4", className)}
    >
      <div className="mx-auto flex max-w-content flex-col items-center gap-space-8">
        <FadeUp>
          <SectionHeading
            id={headingId}
            eyebrow={eyebrow}
            heading={heading}
            description={description}
            align="center"
            className="mx-auto"
          />
        </FadeUp>

        <FadeUp className="w-full">
          <form
            noValidate
            aria-describedby={statusId}
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-xl flex-col gap-space-4"
          >
            <Field label="Name" required error={fieldErrors.name}>
              {(control) => (
                <Input
                  {...control}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={handleChange}
                />
              )}
            </Field>

            <Field label="Email" required error={fieldErrors.email}>
              {(control) => (
                <Input
                  {...control}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                />
              )}
            </Field>

            <Field label="Company" error={fieldErrors.company}>
              {(control) => (
                <Input
                  {...control}
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Where you work (optional)"
                  value={values.company}
                  onChange={handleChange}
                />
              )}
            </Field>

            <Field label="Message" required error={fieldErrors.message}>
              {(control) => (
                <Textarea
                  {...control}
                  name="message"
                  rows={5}
                  placeholder="Tell me about the role, project, or idea…"
                  value={values.message}
                  onChange={handleChange}
                />
              )}
            </Field>

            {/*
             * Honeypot (Req 8.7): hidden from humans and assistive tech, and
             * removed from the tab order. Bots that auto-fill every input trip
             * it; the server treats a filled value as spam.
             */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor={honeypotId}>Leave this field empty</label>
              <input
                id={honeypotId}
                type="text"
                name={HONEYPOT_FIELD}
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>

            {/*
             * Form-level feedback live region (Req 8.4 success / 8.5 error),
             * complementing the transient toast. Errors are announced
             * assertively; the success confirmation politely.
             */}
            <div id={statusId} className="min-h-[1.5rem]">
              {formError ? (
                <p
                  role="alert"
                  className="font-sans text-body font-medium text-red-400"
                >
                  {formError}
                </p>
              ) : null}
              {succeeded ? (
                <p
                  role="status"
                  className="font-sans text-body font-medium text-emerald-400"
                >
                  {CONTACT_SUCCESS_MESSAGE}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? CONTACT_SUBMITTING_LABEL : CONTACT_SUBMIT_LABEL}
            </Button>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
