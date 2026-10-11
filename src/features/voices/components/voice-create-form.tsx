"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AudioLines,
  FolderOpen,
  X,
  FileAudio,
  Upload,
  Mic,
  Play,
  Pause,
  Check,
  ChevronsUpDown,
  Globe,
  RefreshCw,
} from "lucide-react";
import locales from "locale-codes";

import { cn, formatFileSize } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useTRPC } from "@/trpc/client";
import { Spinner } from "@/components/ui/spinner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  VOICE_CATEGORIES,
  VOICE_CATEGORY_LABELS,
  type VoiceCategory,
} from "@/features/voices/data/voice-categories";
import { VoiceRecorder } from "./voice-recorder";

const LANGUAGE_OPTIONS = Array.from(
  new Map(
    locales.all
      .filter((l) => l.tag && l.tag.includes("-") && l.name)
      .map((l) => {
        const label = l.location ? `${l.name} (${l.location})` : l.name;
        return [
          l.tag,
          {
            value: l.tag,
            label,
            searchValue: `${label} ${l.tag} ${l.name}`,
          },
        ];
      }),
  ).values(),
);

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_AUDIO_FORMATS = "MP3, WAV, OGG, AAC, or WebM";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const voiceCreateFormSchema = z.object({
  name: z.string().trim().min(1, "Voice name is required"),
  file: z
    .custom<File>((f) => f instanceof File, "An audio file is required")
    .refine((f) => f && f.size > 0, "Audio file cannot be empty")
    .refine((f) => f && f.size <= MAX_FILE_SIZE, "File size must be less than 20MB"),
  category: z.custom<VoiceCategory>(
    (val) => typeof val === "string" && val.length > 0,
    "A category is required",
  ),
  language: z.string().min(1, "A language is required"),
  description: z.string(),
  authorizationConfirmed: z.literal(true, {
    error: "Please confirm that you have permission to create this voice clone",
  }),
});

async function parseErrorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json();
    return body?.error ?? fallback;
  } catch {
    return response.statusText || fallback;
  }
}

function FileDropzone({
  file,
  onFileChange,
  isInvalid,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isInvalid?: boolean;
}) {
  const { isPlaying, togglePlay } = useAudioPlayback(file);
  const [prevFile, setPrevFile] = useState<File | null>(file);
  const [duration, setDuration] = useState<number | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  if (file !== prevFile) {
    setPrevFile(file);
    setDuration(null);
  }

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);
    const handleMetadata = () => setDuration(audio.duration);
    audio.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.src = "";
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/ogg": [".ogg"],
      "audio/aac": [".aac"],
      "audio/webm": [".webm"],
      "audio/x-m4a": [".m4a"],
      "audio/mp4": [".m4a", ".mp4"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setDropError(null);
      if (rejectedFiles && rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        if (error?.code === "file-too-large") {
          setDropError(
            `File exceeds 20 MB size limit (${formatFileSize(rejectedFiles[0].file.size)})`,
          );
        } else if (error?.code === "file-invalid-type") {
          setDropError(
            "Unsupported audio format. Please upload MP3, WAV, OGG, AAC, or WebM.",
          );
        } else {
          setDropError(error?.message || "Invalid audio file");
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
  });

  if (file) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex w-full items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FileAudio className="size-4.5" />
          </div>

          <div className="grid min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-900">{file.name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              {duration !== null && !isNaN(duration) && (
                <>
                  <span>&middot;</span>
                  <span>{formatDuration(duration)}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause audio preview" : "Play audio preview"}
              title={isPlaying ? "Pause audio preview" : "Play audio preview"}
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              onClick={() => replaceInputRef.current?.click()}
              title="Replace audio"
              aria-label="Replace audio"
            >
              <RefreshCw className="mr-1 size-3" />
              Replace
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              onClick={() => {
                setDropError(null);
                onFileChange(null);
              }}
              aria-label="Remove audio"
              title="Remove audio"
            >
              <X className="size-3.5" />
            </Button>
          </div>

          <input
            ref={replaceInputRef}
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/webm,audio/x-m4a,audio/mp4"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                if (selected.size > MAX_FILE_SIZE) {
                  setDropError(
                    `File exceeds 20 MB size limit (${formatFileSize(selected.size)})`,
                  );
                  return;
                }
                setDropError(null);
                onFileChange(selected);
              }
            }}
          />
        </div>

        {duration !== null && !isNaN(duration) && duration < 10 && (
          <p className="text-[11px] font-medium text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-200/60">
            ⚠️ Audio is under 10 seconds. Voice cloning requires at least 10s of audio.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed px-4 py-5 transition-colors",
          isDragReject || isInvalid
            ? "border-destructive bg-destructive/5"
            : isDragActive
              ? "border-brand bg-brand/5"
              : "border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/60",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex size-9 items-center justify-center rounded-lg bg-white border border-slate-200/70 shadow-2xs">
          <AudioLines className="size-4.5 text-slate-600" />
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          {ACCEPTED_AUDIO_FORMATS} · max 20 MB · min 10s
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-3 rounded-lg border-slate-200 text-xs font-medium mt-0.5 shadow-none hover:bg-white"
        >
          <FolderOpen className="mr-1.5 size-3 text-slate-500" />
          Choose audio
        </Button>
      </div>

      {dropError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{dropError}</span>
        </div>
      )}
    </div>
  );
}

function LanguageCombobox({
  value,
  onChange,
  isInvalid,
}: {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLabel =
    LANGUAGE_OPTIONS.find((l) => l.value === value)?.label ?? "";

  const filteredLanguages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LANGUAGE_OPTIONS;
    return LANGUAGE_OPTIONS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.value.toLowerCase().includes(q) ||
        l.searchValue.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSearch("");
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={isInvalid}
          className={cn(
            "h-9 w-full justify-between font-normal rounded-xl border-slate-200 bg-white px-3 text-xs shadow-none hover:bg-slate-50",
            !value && "text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{value ? selectedLabel : "Language..."}</span>
          </div>
          <ChevronsUpDown className="size-3.5 shrink-0 opacity-50 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className="w-(--radix-popover-trigger-width) p-0"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false} className="flex max-h-56 flex-col">
          <CommandInput
            placeholder="Search language..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList className="max-h-44 overflow-y-auto overscroll-contain">
            {filteredLanguages.length === 0 ? (
              <CommandEmpty>No language found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredLanguages.map((lang) => (
                  <CommandItem
                    key={lang.value}
                    value={lang.value}
                    onSelect={() => {
                      onChange(lang.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <span className="truncate text-xs">{lang.label}</span>
                    <Check
                      className={cn(
                        "ml-auto size-3.5",
                        value === lang.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface VoiceCreateFormProps {
  scrollable?: boolean;
  footer?: (submit: React.ReactNode) => React.ReactNode;
  onError?: (message: string) => void;
  onSuccess?: () => void;
}

export function VoiceCreateForm({
  scrollable,
  footer,
  onError,
  onSuccess,
}: VoiceCreateFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({
      name,
      file,
      category,
      language,
      description,
      authorizationConfirmed,
    }: {
      name: string;
      file: File;
      category: VoiceCategory;
      language: string;
      description?: string;
      authorizationConfirmed: boolean;
    }) => {
      const params = new URLSearchParams({
        name,
        category,
        language,
        authorizationConfirmed: String(authorizationConfirmed),
      });
      if (description) {
        params.set("description", description);
      }

      const response = await fetch(`/api/voices/create?${params.toString()}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!response.ok) {
        throw new Error(
          await parseErrorMessage(response, "Failed to create voice"),
        );
      }

      return response.json();
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      file: null as File | null,
      category: "GENERAL" as VoiceCategory,
      language: "en-US",
      description: "",
      authorizationConfirmed: false,
    },
    validators: {
      onSubmit: voiceCreateFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (createMutation.isPending) return;

      try {
        await createMutation.mutateAsync({
          name: value.name.trim(),
          file: value.file!,
          category: value.category,
          language: value.language,
          description: value.description.trim() || undefined,
          authorizationConfirmed: value.authorizationConfirmed,
        });

        toast.success("Voice created successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.voices.getAll.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.billing.getStatus.queryKey(),
        });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: trpc.billing.getStatus.queryKey(),
          });
        }, 1500);
        form.reset();
        onSuccess?.();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create voice";

        if (onError) {
          onError(message);
        } else {
          toast.error(message);
        }
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className={cn(
        "flex flex-col",
        scrollable ? "min-h-0 flex-1" : "gap-3.5",
      )}
    >
      <div
        className={cn(
          scrollable
            ? "no-scrollbar flex flex-col gap-3.5 overflow-y-auto px-4"
            : "flex flex-col gap-3.5",
        )}
      >
        {/* Compact Segmented Control for Audio */}
        <form.Field name="file">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-9 p-0.5 rounded-xl bg-slate-100">
                    <TabsTrigger
                      value="upload"
                      className="h-8 rounded-lg text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs"
                    >
                      <Upload className="mr-1.5 size-3.5" />
                      Upload audio
                    </TabsTrigger>
                    <TabsTrigger
                      value="record"
                      className="h-8 rounded-lg text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-2xs"
                    >
                      <Mic className="mr-1.5 size-3.5" />
                      Record audio
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-2">
                    <FileDropzone
                      file={field.state.value}
                      onFileChange={field.handleChange}
                      isInvalid={isInvalid}
                    />
                  </TabsContent>
                  <TabsContent value="record" className="mt-2">
                    <VoiceRecorder
                      file={field.state.value}
                      onFileChange={field.handleChange}
                      isInvalid={isInvalid}
                    />
                  </TabsContent>
                </Tabs>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Single Required Text Field: Voice name */}
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <Input
                  id={field.name}
                  placeholder="Voice name"
                  aria-invalid={isInvalid}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-10 rounded-xl border-slate-200 bg-white px-3.5 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-100"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Collapsed Advanced Options Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced" className="border-none">
            <AccordionTrigger className="py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:no-underline">
              Advanced options
            </AccordionTrigger>
            <AccordionContent className="pt-2.5 pb-1 flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <form.Field name="category">
                  {(field) => (
                    <Field>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v as VoiceCategory)}
                      >
                        <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 bg-white text-xs shadow-none">
                          <SelectValue placeholder="Category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {VOICE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {VOICE_CATEGORY_LABELS[cat]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>

                <form.Field name="language">
                  {(field) => (
                    <Field>
                      <LanguageCombobox
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field name="description">
                {(field) => (
                  <Field>
                    <Textarea
                      id={field.name}
                      placeholder="Description (optional)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="min-h-16 resize-none rounded-xl border-slate-200 bg-white p-2.5 text-xs shadow-none"
                      rows={2}
                    />
                  </Field>
                )}
              </form.Field>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Compact Unobtrusive Permission Safeguard Checkbox */}
        <form.Field name="authorizationConfirmed">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="gap-1.5">
                <div
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border border-slate-200/60 bg-slate-50/40 p-2.5 transition-colors hover:bg-slate-50",
                    field.state.value && "border-rose-200 bg-rose-50/20",
                  )}
                >
                  <Checkbox
                    id="voice-authorization"
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    className="mt-0.5 data-checked:border-brand data-checked:bg-brand data-[state=checked]:border-brand data-[state=checked]:bg-brand"
                  />
                  <label
                    htmlFor="voice-authorization"
                    className="cursor-pointer select-none text-[11px] leading-relaxed font-normal text-slate-500"
                  >
                    I confirm that I own this voice or have the speaker&apos;s
                    permission to create a voice clone.
                  </label>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Primary Button & Pricing */}
        <form.Subscribe
          selector={(s) => ({
            isSubmitting: s.isSubmitting,
            canSubmit: s.canSubmit,
            values: s.values,
          })}
        >
          {({ isSubmitting, canSubmit, values }) => {
            const isFormValid =
              Boolean(values.name?.trim()) &&
              Boolean(values.file) &&
              Boolean(values.category) &&
              Boolean(values.language) &&
              values.authorizationConfirmed === true;

            const isPending = isSubmitting || createMutation.isPending;
            const isDisabled = isPending || !canSubmit || !isFormValid;

            const submitButton = (
              <div className="flex flex-col gap-1.5 pt-1">
                <Button
                  type="submit"
                  disabled={isDisabled}
                  className="h-10 w-full rounded-xl bg-brand font-medium text-white shadow-xs transition-all hover:bg-brand-hover active:scale-[0.99] disabled:bg-brand disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Creating voice...
                    </>
                  ) : (
                    "Create voice"
                  )}
                </Button>
                <p className="text-center text-[11px] text-muted-foreground">
                  ₹ 2 per voice creation
                </p>
              </div>
            );
            return footer ? footer(submitButton) : submitButton;
          }}
        </form.Subscribe>
      </div>
    </form>
  );
}