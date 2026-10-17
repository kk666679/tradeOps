import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 你的中间件逻辑（比如检查 Session）
  // const session = await getToken({ req: request });
  // if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  
  return NextResponse.next()
}

// ✅ 核心修复：必须使用静态字符串数组！
export const config = {
  // 匹配你需要保护的路由，同时排除 api/auth 和静态资源
  matcher: [
    '/dashboard/:path*',
    '/console/:path*',
    '/wms/:path*',
    '/trade-ops/:path*',
    // 如果上面无法满足，可以使用正则表达式排除法（匹配所有，除了静态资源和API）
    // '/((?!api/auth|_next/static|_next/image|favicon.ico).*)'
  ],
}
