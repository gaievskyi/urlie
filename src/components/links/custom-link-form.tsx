"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { Output as Infer } from "valibot"
import { checkSlug, createShortLink, editShortLink } from "@/api/actions/link"
import type { ShortLink } from "@/api/db/schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDebounce } from "@/hooks/use-debounce"
import type { SafeActionError } from "@/lib/utils"
import { setFormErrors } from "@/lib/utils"
import { insertLinkSchema } from "@/lib/validations/link"

const formSchema = insertLinkSchema

type FormSchema = Infer<typeof formSchema>

type CustomLinkFormProps = (
  | {
      isEditing: boolean
      defaultValues?: ShortLink
    }
  | {
      isEditing?: undefined
      defaultValues?: undefined
    }
) & {
  onSetIsDialogOpen: (value: boolean) => void
}

export const CustomLinkForm = ({
  onSetIsDialogOpen,
  isEditing = false,
  defaultValues,
}: CustomLinkFormProps) => {
  const [slug, setSlug] = useState("")
  const [isSlugExist, setIsSlugExist] = useState(false)
  const debouncedSlug = useDebounce(slug, 500)

  const form = useForm<FormSchema>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      url: defaultValues?.url ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
    },
  })

  const handleSuccess = () => {
    toast.success(
      isEditing ? "Edited successfully" : "Shortened successfully",
      {
        description: isEditing
          ? "Your link has been successfully edited."
          : "Your link has been successfully shortened.",
      },
    )
    onSetIsDialogOpen(false)
    form.reset()
  }

  const handleError = (error: SafeActionError) => {
    if (error.validationErrors) {
      return setFormErrors(form, error.validationErrors)
    }
    toast.error(error.serverError ?? error.fetchError)
  }

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  )

  const { execute: editLink, status: editLinkStatus } = useAction(
    editShortLink,
    {
      onSuccess: handleSuccess,
      onError: handleError,
    },
  )

  const { execute: checkSlugExists, status: checkSlugExistsStatus } = useAction(
    checkSlug,
    {
      onError: handleError,
      onSuccess: (slugExist) => {
        if (slugExist) {
          setIsSlugExist(true)
          form.setError("slug", { message: "Slug already exist" })
        } else {
          setIsSlugExist(false)
          form.clearErrors("slug")
        }
      },
    },
  )

  useEffect(() => {
    setIsSlugExist(false)

    if (!debouncedSlug) {
      return form.clearErrors("slug")
    }

    checkSlugExists({ slug: debouncedSlug })
  }, [checkSlugExists, debouncedSlug, form])

  const onSubmit = (values: FormSchema) => {
    if (isSlugExist) {
      return form.setError("slug", { message: "Slug already exist" })
    }

    if (isEditing) {
      editLink({ slug: defaultValues?.slug ?? "", newLink: values })
    } else {
      createLink(values)
    }
  }

  const isExecuting =
    createLinkStatus === "executing" || editLinkStatus === "executing"

  const isCheckingSlug = checkSlugExistsStatus === "executing"

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination URL</FormLabel>
              <FormControl>
                <Input placeholder="https://gaievskyi.com/" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short link</FormLabel>
              <FormControl>
                <>
                  <Input
                    placeholder="/portfolio"
                    className="pe-8"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setSlug(e.target.value)
                    }}
                  />
                  {isCheckingSlug && (
                    <div className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  )}
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="My link is cool and you should check it out..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isDirty || isExecuting}>
          {isExecuting && <ReloadIcon className="mr-2 size-4 animate-spin" />}
          {isEditing
            ? isExecuting
              ? "Saving changes..."
              : "Save changes"
            : isExecuting
              ? "Shortening..."
              : "Shorten"}
        </Button>
      </form>
    </Form>
  )
}
