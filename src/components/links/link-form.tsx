"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { Output as Infer } from "valibot"
import { object, string, url } from "valibot"
import { createShortLink } from "@/api/actions/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { setFormErrors } from "@/lib/utils"
import { CustomLinkButton } from "./custom-link-button"
import { CustomLinkDialog } from "./custom-link-dialog"

const formSchema = object({
  url: string([url()]),
})

type FormSchema = Infer<typeof formSchema>

export const LinkForm = () => {
  const session = useSession()
  const isAuth = !!session.data

  const form = useForm<FormSchema>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  const { execute: createLink, status: createLinkStatus } = useAction(
    createShortLink,
    {
      onSuccess() {
        toast.success("Shortened successfully", {
          description: "Your link has been successfully shortened.",
        })
        form.reset()
      },
      onError(error) {
        if (error.validationErrors) {
          return setFormErrors(form, error.validationErrors)
        }
        toast.error(error.serverError ?? error.fetchError)
      },
    },
  )

  const onSubmit = (values: FormSchema) => {
    createLink({ url: values.url, slug: "" })
  }

  const isLoading = createLinkStatus === "executing"

  return (
    <Form {...form}>
      <div className="flex w-full gap-2">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full justify-center gap-2"
        >
          <div className="flex-1">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Paste your URL ->" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 size-4 animate-spin" />}
            Shorten
          </Button>
        </form>
        {isAuth ? <CustomLinkDialog /> : <CustomLinkButton disabled />}
      </div>
    </Form>
  )
}
