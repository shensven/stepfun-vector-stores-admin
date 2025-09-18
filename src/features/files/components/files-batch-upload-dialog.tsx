'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type StepfunFileCreateParams } from '@/services/files-api'
import { Loader2Icon, PlaneTakeoff, X } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFiles } from './files-provider'

const formSchema = z.object({
  purpose: z.enum(
    ['file-extract', 'retrieval-text', 'retrieval-image', 'storage'],
    {
      message: '请选择用途',
    }
  ),
  files: z.array(z.instanceof(File)).min(1, '请至少选择一个文件'),
})

type BatchUploadForm = z.infer<typeof formSchema>

interface FileWithProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function FilesBatchUploadDialog() {
  const { open, setOpen } = useFiles()
  const createMutation = useCreate()
  const [fileList, setFileList] = useState<FileWithProgress[]>([])

  const form = useForm<BatchUploadForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: 'retrieval-text' as const,
      files: [],
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newFiles = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }))
    setFileList((prev) => [...prev, ...newFiles])
    form.setValue('files', [...form.getValues('files'), ...files])
  }

  const removeFile = (index: number) => {
    setFileList((prev) => prev.filter((_, i) => i !== index))
    const currentFiles = form.getValues('files')
    form.setValue(
      'files',
      currentFiles.filter((_, i) => i !== index)
    )
  }

  const onSubmit = async (values: BatchUploadForm) => {
    try {
      // 重置所有文件状态
      setFileList((prev) =>
        prev.map((item) => ({ ...item, status: 'pending', progress: 0 }))
      )

      // 逐个上传文件
      for (let i = 0; i < values.files.length; i++) {
        const file = values.files[i]

        // 更新文件状态为上传中
        setFileList((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, status: 'uploading', progress: 0 } : item
          )
        )

        try {
          const submitData: StepfunFileCreateParams = {
            purpose: values.purpose,
            file: file,
          }

          await createMutation.mutateAsync(submitData)

          // 更新文件状态为成功
          setFileList((prev) =>
            prev.map((item, index) =>
              index === i ? { ...item, status: 'success', progress: 100 } : item
            )
          )
        } catch (error) {
          // 更新文件状态为失败
          setFileList((prev) =>
            prev.map((item, index) =>
              index === i
                ? {
                    ...item,
                    status: 'error',
                    error: error instanceof Error ? error.message : '上传失败',
                  }
                : item
            )
          )
        }
      }

      // 延迟重置表单，让用户看到结果
      setTimeout(() => {
        form.reset()
        setFileList([])
        setOpen(null)
      }, 2000)
    } catch (_error) {
      // 错误已在 hook 中处理
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog
      open={open === 'batch-upload'}
      onOpenChange={(state) => {
        if (state) {
          form.reset({
            purpose: 'retrieval-text',
            files: [],
          })
          setFileList([])
        } else {
          form.reset()
          setFileList([])
        }
        setOpen(state ? 'batch-upload' : null)
      }}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>批量上传文件</DialogTitle>
          <DialogDescription>批量上传多个文件到文件服务</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='batch-upload-form'
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
              name='files'
              render={() => (
                <FormItem className='space-y-2'>
                  <FormLabel>选择文件</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      <Input
                        type='file'
                        multiple
                        onChange={handleFileSelect}
                        className='cursor-pointer'
                      />
                      {fileList.length > 0 && (
                        <div className='space-y-2'>
                          <p className='text-muted-foreground text-sm'>
                            已选择 {fileList.length} 个文件
                          </p>
                          <ScrollArea className='h-48 space-y-2 rounded-md border'>
                            {fileList.map((fileItem, index) => (
                              <div
                                key={index}
                                className='bg-muted m-3 flex items-center justify-between rounded-sm p-2'
                              >
                                <div className='min-w-0 flex-1'>
                                  <p className='truncate text-sm font-medium'>
                                    {fileItem.file.name}
                                  </p>
                                  <p className='text-muted-foreground text-xs'>
                                    {formatFileSize(fileItem.file.size)}
                                  </p>
                                  {fileItem.status === 'error' &&
                                    fileItem.error && (
                                      <p className='text-destructive text-xs'>
                                        {fileItem.error}
                                      </p>
                                    )}
                                </div>
                                <div className='flex items-center space-x-2'>
                                  {fileItem.status === 'uploading' && (
                                    <Loader2Icon className='h-4 w-4 animate-spin' />
                                  )}
                                  {fileItem.status === 'success' && (
                                    <div className='h-4 w-4 rounded-full bg-green-500' />
                                  )}
                                  {fileItem.status === 'error' && (
                                    <div className='h-4 w-4 rounded-full bg-red-500' />
                                  )}
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => removeFile(index)}
                                    disabled={fileItem.status === 'uploading'}
                                  >
                                    <X className='h-4 w-4' />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      )}
                    </div>
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
            form='batch-upload-form'
            type='submit'
            disabled={createMutation.isPending || fileList.length === 0}
          >
            {!createMutation.isPending && <PlaneTakeoff />}
            {createMutation.isPending && (
              <Loader2Icon className='animate-spin' />
            )}
            开始上传
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
