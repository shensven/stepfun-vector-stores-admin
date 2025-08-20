'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreate } from '@/hooks/use-vector-stores'
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
import { useVectorStores } from './vector-stores-provider'

const formSchema = z.object({
  name: z.string().min(1, '名称必填'),
  type: z.enum(['text', 'image'], { message: '请选择类型' }),
})

type VectorStoreForm = z.infer<typeof formSchema>

export function VectorStoresCreateDialog() {
  const { open, setOpen } = useVectorStores()
  const createMutation = useCreate()

  const form = useForm<VectorStoreForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'text' as const,
    },
  })

  const onSubmit = async (values: VectorStoreForm) => {
    try {
      await createMutation.mutateAsync(values)
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
        form.reset()
        setOpen(state ? 'create' : null)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>创建知识库</DialogTitle>
          <DialogDescription>
            创建一个新的知识库，用于存储文本内容。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='vector-store-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='my-4 space-y-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='必填'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>类型</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='col-span-4 flex flex-col flex-wrap gap-x-6 gap-y-2'
                    >
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='text' />
                        </FormControl>
                        <FormLabel className='font-normal'>文本</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='image' />
                        </FormControl>
                        <FormLabel className='font-normal'>图片</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
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
            form='vector-store-form'
            type='submit'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? '创建中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
