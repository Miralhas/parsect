import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useParserProvider } from "@/contexts/parser-context";
import { MetadataSchema, SOURCES, type MetadataInput } from "@/lib/schemas/metadata-schema";
import { isApiError } from "@/lib/utils/common-utils";
import { useMetadataExtractor } from "@/service/epub/mutations/use-metadata-extractor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const MetadataForm = () => {
  const mutation = useMetadataExtractor();
  const { handleParsed } = useParserProvider();

  const form = useForm<MetadataInput>({
    resolver: zodResolver(MetadataSchema),
    defaultValues: {
      source: "GOODREADS",
      sourceId: "15839976-red-rising",
    },
  });

  const onSubmit = (input: MetadataInput) => {
    mutation.mutate(input, {
      onSuccess: (metadata) => {
        handleParsed(({
          alias: "",
          ...metadata,
        }));
        toast.add({
          type: "success",
          title: "Metadata extracted successfully"
        });
      },
      onError: (err) => {
        const description = isApiError(err) ? err.detail : err.message;
        toast.add({
          type: "error",
          priority: "high",
          title: "Failed to extract metadata",
          description,
        });
      },
    });
  }

  return (
    <form id="metadata-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-3 gap-2">
          <Controller
            name="sourceId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel htmlFor="metadata-form-sourceId">
                  Source ID
                </FieldLabel>
                <Input
                  {...field}
                  id="metadata-form-sourceId"
                  aria-invalid={fieldState.invalid}
                  placeholder="15839976-red-rising"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="source"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="metadata-form-source">
                    <span className="sr-only md:not-sr-only">Metadata</span> Source
                  </FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="metadata-form-source"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map(source => (
                      <SelectItem value={source} key={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <Field>
        <Button form="metadata-form" type="submit" className="mt-2 w-full font-bold" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <p className="animate-pulse">Extracting...</p>
          ) : "Extract Metadata"}
        </Button>
      </Field>

    </form>
  )
}

export default MetadataForm;
