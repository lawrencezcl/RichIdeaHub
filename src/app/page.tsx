import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/cases')
  return null // 这行代码不会执行，但是由于TypeScript要求必须有返回值
}
