import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SignInEnv() {
  return (
    <div className='container flex h-svh w-lg items-center justify-center'>
      <Card className='w-full gap-2'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>要求环境变量</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className='list-decimal pl-5 marker:text-gray-500'>
            <li className='list-item'>
              <p className='flex items-center gap-1'>
                <span>将</span>
                <Badge variant='outline'>.env.example</Badge>
                <span>拷贝为</span>
                <Badge variant='outline'>.env</Badge>
              </p>
            </li>
            <li className='list-item'>
              <p className='flex items-center gap-1'>
                <span>添加密钥到</span>
                <Badge variant='outline'>.env</Badge>
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
