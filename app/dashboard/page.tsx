'use client'
import BlogEditor from "@/components/BlogEditor"
import { useRouter } from "next/navigation";


const DashboardPage = () => {
  const router = useRouter();
  const user = { name: "Saikat Roy" }; // Example user data; replace with actual user state

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    // Redirect to the homepage or login page
    router.push("/"); // Change this to your desired route
  };


  return (
    <div>
      <BlogEditor />

      {user && (
        <div className="p-8">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <button
            className="bg-white-100 text-black-200 px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default DashboardPage