import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 简单的测试逻辑
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Admin", email: "admin@tradeops.com" }
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only",
})
export { handler as GET, handler as POST }
