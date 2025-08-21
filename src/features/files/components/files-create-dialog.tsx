'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type StepfunFileCreateParams } from '@/services/filesAPI'
import { Loader2Icon } from 'lucide-react'
import { useCreate } from '@/hooks/use-files'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFiles } from './files-provider'

const formSchema = z
  .object({
    purpose: z.enum(
      ['file-extract', 'retrieval-text', 'retrieval-image', 'storage'],
      {
        message: '请选择用途',
      }
    ),
    uploadType: z.enum(['url', 'file'], { message: '请选择上传方式' }),
    url: z.string().optional(),
    file: z.instanceof(File).optional(),
  })
  .refine((data) => {
    if (data.uploadType === 'url') {
      return (
        data.url &&
        data.url.length > 0 &&
        z.string().url().safeParse(data.url).success
      )
    }
    if (data.uploadType === 'file') {
      return data.file instanceof File
    }
    return false
  })

type FileForm = z.infer<typeof formSchema>

export function FilesCreateDialog() {
  const { open, setOpen } = useFiles()
  const createMutation = useCreate()

  const form = useForm<FileForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: 'storage' as const,
      uploadType: 'file' as const,
      url: '',
    },
  })

  const onSubmit = async (values: FileForm) => {
    try {
      const submitData: StepfunFileCreateParams = {
        purpose: values.purpose,
      }

      if (values.uploadType === 'url' && values.url) {
        submitData.url = values.url
      }

      if (values.uploadType === 'file' && values.file) {
        submitData.file = values.file
      }

      await createMutation.mutateAsync(submitData)
      form.reset()
      setOpen(null)
    } catch (_error) {
      // 错误已在 hook 中处理
    }
  }

  return (
    <Dialog
      open={open === 'create'}
      onOpenChange={(state) => {
        if (state) {
          form.reset({
            purpose: 'storage',
            uploadType: 'file',
            url: '',
          })
        } else {
          form.reset()
        }
        setOpen(state ? 'create' : null)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>上传文件</DialogTitle>
          <DialogDescription>上传一个文件到文件服务</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='file-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='my-4 space-y-6'
          >
            <FormField
              control={form.control}
              name='purpose'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormLabel>用途</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='col-span-4 flex flex-wrap gap-x-8'
                    >
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='file-extract' />
                        </FormControl>
                        <FormLabel className='font-normal'>文件提取</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='retrieval-text' />
                        </FormControl>
                        <FormLabel className='font-normal'>文本检索</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='retrieval-image' />
                        </FormControl>
                        <FormLabel className='font-normal'>图片检索</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='storage' />
                        </FormControl>
                        <FormLabel className='font-normal'>存储</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='uploadType'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormLabel>上传方式</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue='file'
                    >
                      <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value='file'>本地上传</TabsTrigger>
                        <TabsTrigger value='url'>从 URL 上传</TabsTrigger>
                      </TabsList>
                      <TabsContent value='file' className='space-y-4'>
                        <FormField
                          control={form.control}
                          name='file'
                          render={({
                            field: { onChange, value, ...field },
                          }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type='file'
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      onChange(file)
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value='url' className='space-y-4'>
                        <FormField
                          control={form.control}
                          name='url'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder='https://example.com/file.pdf'
                                  autoComplete='off'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(null)}
            disabled={createMutation.isPending}
          >
            取消
          </Button>
          <Button
            form='file-form'
            type='submit'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && (
              <Loader2Icon className='animate-spin' />
            )}
            上传
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
