import BlogEditor from "@/components/BlogEditor"
import { getSession } from "@auth0/nextjs-auth0"


const DashboardPage = async () => {
  const session = await getSession()
  const user = session?.user

  return (
    <div>
      <BlogEditor />

      {user && <div className="p-8">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <button className="bg-white-100 text-black-200">
          <a href='api/auth/logout'>Logout</a>
        </button>
      </div>}
    </div>
  )
}

export default DashboardPage